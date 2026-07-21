'use server';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import {
  createFestivalContentDtoSchema,
  type CreateFestivalContentDto,
  updateFestivalContentDtoSchema,
  type UpdateFestivalContentDto,
} from '@ak-strannik/types';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionFailure,
  type ActionResult,
} from '../../../../../lib/action-utils';
import { validateRequiredLocales } from '../../../../../lib/validate-required-locales';

const listPath = '/projects/festival';

class ForeignNestedIdError extends Error {}
class DuplicateNestedIdError extends Error {}
class FestivalNotFoundError extends Error {}
class DuplicateSlugError extends Error {}
class IncompleteFestivalError extends Error {}

function localeFailure(path: string, label?: string): ActionFailure {
  return {
    success: false,
    message: label
      ? `${label}: обязательны переводы ru и en`
      : 'Обязательны переводы ru и en',
    fieldErrors: { [path]: ['Обязательны переводы ru и en без дубликатов'] },
  };
}

function validateLocales(
  data: CreateFestivalContentDto | UpdateFestivalContentDto
): ActionFailure | null {
  if (validateRequiredLocales(data.translations))
    return localeFailure('translations');
  for (const [index, event] of (data.events ?? []).entries()) {
    if (validateRequiredLocales(event.translations))
      return localeFailure(
        `events.${index}.translations`,
        `Событие ${index + 1}`
      );
  }
  if (
    data.nominations &&
    validateRequiredLocales(data.nominations.translations)
  )
    return localeFailure('nominations.translations', 'Номинации');
  if (data.jury) {
    if (validateRequiredLocales(data.jury.translations))
      return localeFailure('jury.translations', 'Жюри');
    for (const [index, person] of (data.jury.persons ?? []).entries()) {
      if (validateRequiredLocales(person.translations))
        return localeFailure(
          `jury.persons.${index}.translations`,
          `Член жюри ${index + 1}`
        );
    }
  }
  if (data.organizations) {
    if (validateRequiredLocales(data.organizations.translations))
      return localeFailure('organizations.translations', 'Организации');
    for (const [index, item] of (
      data.organizations.organizations ?? []
    ).entries()) {
      if (validateRequiredLocales(item.translations))
        return localeFailure(
          `organizations.organizations.${index}.translations`,
          `Организация ${index + 1}`
        );
    }
  }
  return null;
}

function assertUniqueIds(ids: string[]): void {
  if (new Set(ids).size !== ids.length) throw new DuplicateNestedIdError();
}

function handleDatabaseError(error: unknown): ActionFailure {
  if (error instanceof DuplicateSlugError)
    return {
      success: false,
      message: 'Фестиваль с таким slug уже существует',
      fieldErrors: { slug: ['Slug должен быть уникальным'] },
    };
  if (error instanceof ForeignNestedIdError)
    return {
      success: false,
      message:
        'Один из вложенных элементов не принадлежит редактируемому фестивалю',
    };
  if (error instanceof DuplicateNestedIdError)
    return {
      success: false,
      message: 'Вложенный элемент не может повторяться в форме',
    };
  if (error instanceof FestivalNotFoundError)
    return { success: false, message: 'Фестиваль не найден' };
  if (error instanceof IncompleteFestivalError)
    return { success: false, message: 'Форма содержит неполные данные' };
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002')
      return {
        success: false,
        message: 'Фестиваль с таким slug уже существует',
        fieldErrors: { slug: ['Slug должен быть уникальным'] },
      };
    if (error.code === 'P2025')
      return { success: false, message: 'Фестиваль не найден' };
  }
  console.error('[FestivalContent] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить фестиваль. Попробуйте ещё раз',
  };
}

export async function createFestivalContent(
  input: CreateFestivalContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsed = createFestivalContentDtoSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: fieldErrors(parsed.error),
    };
  const validationFailure = validateLocales(parsed.data);
  if (validationFailure) return validationFailure;

  try {
    await prisma.$transaction(async (tx) => {
      const root = await tx.festivalContent.create({
        data: {
          logo: parsed.data.logo,
          slug: parsed.data.slug,
          images: parsed.data.images,
          videos: parsed.data.videos,
          achievements: parsed.data.achievements,
          socials: parsed.data.socials,
        },
        select: { id: true },
      });
      await tx.festivalContentTranslation.createMany({
        data: parsed.data.translations.map((translation) => ({
          festivalContentId: root.id,
          locale: translation.locale,
          title: translation.title,
        })),
      });

      for (const [position, event] of parsed.data.events.entries()) {
        const created = await tx.festivalEvent.create({
          data: { festivalContentId: root.id, position },
          select: { id: true },
        });
        await tx.festivalEventTranslation.createMany({
          data: event.translations.map((translation) => ({
            festivalEventId: created.id,
            locale: translation.locale,
            title: translation.title,
            text: translation.text,
          })),
        });
      }

      if (parsed.data.nominations) {
        const block = await tx.festivalNominations.create({
          data: { festivalContentId: root.id },
          select: { id: true },
        });
        await tx.festivalNominationsTranslation.createMany({
          data: parsed.data.nominations.translations.map((translation) => ({
            festivalNominationsId: block.id,
            locale: translation.locale,
            title: translation.title,
            text: translation.text,
          })),
        });
      }

      if (parsed.data.jury) {
        const jury = await tx.festivalJury.create({
          data: { festivalContentId: root.id },
          select: { id: true },
        });
        await tx.festivalJuryTranslation.createMany({
          data: parsed.data.jury.translations.map((translation) => ({
            festivalJuryId: jury.id,
            locale: translation.locale,
            title: translation.title,
          })),
        });
        for (const [position, person] of parsed.data.jury.persons.entries()) {
          const created = await tx.festivalJuryPerson.create({
            data: { festivalJuryId: jury.id, image: person.image, position },
            select: { id: true },
          });
          await tx.festivalJuryPersonTranslation.createMany({
            data: person.translations.map((translation) => ({
              festivalJuryPersonId: created.id,
              locale: translation.locale,
              name: translation.name,
              position: translation.position,
            })),
          });
        }
      }

      if (parsed.data.organizations) {
        const block = await tx.festivalOrganizations.create({
          data: { festivalContentId: root.id },
          select: { id: true },
        });
        await tx.festivalOrganizationsTranslation.createMany({
          data: parsed.data.organizations.translations.map((translation) => ({
            festivalOrganizationsId: block.id,
            locale: translation.locale,
            title: translation.title,
          })),
        });
        for (const [
          position,
          item,
        ] of parsed.data.organizations.organizations.entries()) {
          const created = await tx.festivalOrganization.create({
            data: {
              festivalOrganizationsId: block.id,
              value: item.value,
              position,
            },
            select: { id: true },
          });
          await tx.festivalOrganizationTranslation.createMany({
            data: item.translations.map((translation) => ({
              festivalOrganizationId: created.id,
              locale: translation.locale,
              name: translation.name,
            })),
          });
        }
      }
    });
    revalidatePath(listPath);
    return { success: true, message: 'Фестиваль создан' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

async function syncEvents(
  tx: Prisma.TransactionClient,
  festivalContentId: string,
  events: NonNullable<UpdateFestivalContentDto['events']>
): Promise<void> {
  const existing = await tx.festivalEvent.findMany({
    where: { festivalContentId },
    select: { id: true, position: true },
  });
  const ids = events.flatMap((event) => (event.id ? [event.id] : []));
  assertUniqueIds(ids);
  const existingIds = new Set(existing.map((event) => event.id));
  if (ids.some((id) => !existingIds.has(id))) throw new ForeignNestedIdError();
  await tx.festivalEvent.deleteMany({
    where: { festivalContentId, id: { notIn: ids } },
  });
  const maxPosition = existing.reduce(
    (maximum, event) => Math.max(maximum, event.position),
    -1
  );
  await tx.festivalEvent.updateMany({
    where: { festivalContentId, id: { in: ids } },
    data: { position: { increment: maxPosition + events.length + 1 } },
  });
  for (const [position, event] of events.entries()) {
    const translations = event.translations;
    if (!translations) throw new IncompleteFestivalError();
    let eventId: string;
    if (event.id) {
      const updated = await tx.festivalEvent.updateMany({
        where: { id: event.id, festivalContentId },
        data: { position },
      });
      if (updated.count !== 1) throw new ForeignNestedIdError();
      eventId = event.id;
    } else {
      eventId = (
        await tx.festivalEvent.create({
          data: { festivalContentId, position },
          select: { id: true },
        })
      ).id;
    }
    await tx.festivalEventTranslation.deleteMany({
      where: {
        festivalEventId: eventId,
        locale: { notIn: [Locale.ru, Locale.en] },
      },
    });
    for (const translation of translations) {
      if (!translation.locale || !translation.title || !translation.text)
        throw new IncompleteFestivalError();
      await tx.festivalEventTranslation.upsert({
        where: {
          festivalEventId_locale: {
            festivalEventId: eventId,
            locale: translation.locale,
          },
        },
        create: {
          festivalEventId: eventId,
          locale: translation.locale,
          title: translation.title,
          text: translation.text,
        },
        update: { title: translation.title, text: translation.text },
      });
    }
  }
}

async function syncNominations(
  tx: Prisma.TransactionClient,
  festivalContentId: string,
  nominations: UpdateFestivalContentDto['nominations']
): Promise<void> {
  const existing = await tx.festivalNominations.findUnique({
    where: { festivalContentId },
    select: { id: true },
  });
  if (!nominations) {
    await tx.festivalNominations.deleteMany({ where: { festivalContentId } });
    return;
  }
  if (nominations.id && nominations.id !== existing?.id)
    throw new ForeignNestedIdError();
  const blockId =
    existing?.id ??
    (
      await tx.festivalNominations.create({
        data: { festivalContentId },
        select: { id: true },
      })
    ).id;
  if (!nominations.translations) throw new IncompleteFestivalError();
  await tx.festivalNominationsTranslation.deleteMany({
    where: {
      festivalNominationsId: blockId,
      locale: { notIn: [Locale.ru, Locale.en] },
    },
  });
  for (const translation of nominations.translations) {
    if (!translation.locale || !translation.title || !translation.text)
      throw new IncompleteFestivalError();
    await tx.festivalNominationsTranslation.upsert({
      where: {
        festivalNominationsId_locale: {
          festivalNominationsId: blockId,
          locale: translation.locale,
        },
      },
      create: {
        festivalNominationsId: blockId,
        locale: translation.locale,
        title: translation.title,
        text: translation.text,
      },
      update: { title: translation.title, text: translation.text },
    });
  }
}

async function syncJury(
  tx: Prisma.TransactionClient,
  festivalContentId: string,
  jury: UpdateFestivalContentDto['jury']
): Promise<void> {
  const existing = await tx.festivalJury.findUnique({
    where: { festivalContentId },
    select: { id: true },
  });
  if (!jury) {
    await tx.festivalJury.deleteMany({ where: { festivalContentId } });
    return;
  }
  if (jury.id && jury.id !== existing?.id) throw new ForeignNestedIdError();
  const juryId =
    existing?.id ??
    (
      await tx.festivalJury.create({
        data: { festivalContentId },
        select: { id: true },
      })
    ).id;
  if (!jury.translations || !jury.persons) throw new IncompleteFestivalError();
  await tx.festivalJuryTranslation.deleteMany({
    where: {
      festivalJuryId: juryId,
      locale: { notIn: [Locale.ru, Locale.en] },
    },
  });
  for (const translation of jury.translations) {
    if (!translation.locale || !translation.title)
      throw new IncompleteFestivalError();
    await tx.festivalJuryTranslation.upsert({
      where: {
        festivalJuryId_locale: {
          festivalJuryId: juryId,
          locale: translation.locale,
        },
      },
      create: {
        festivalJuryId: juryId,
        locale: translation.locale,
        title: translation.title,
      },
      update: { title: translation.title },
    });
  }
  const existingPersons = await tx.festivalJuryPerson.findMany({
    where: { festivalJuryId: juryId },
    select: { id: true, position: true },
  });
  const ids = jury.persons.flatMap((person) => (person.id ? [person.id] : []));
  assertUniqueIds(ids);
  const existingIds = new Set(existingPersons.map((person) => person.id));
  if (ids.some((id) => !existingIds.has(id))) throw new ForeignNestedIdError();
  await tx.festivalJuryPerson.deleteMany({
    where: { festivalJuryId: juryId, id: { notIn: ids } },
  });
  const maxPosition = existingPersons.reduce(
    (maximum, person) => Math.max(maximum, person.position),
    -1
  );
  await tx.festivalJuryPerson.updateMany({
    where: { festivalJuryId: juryId, id: { in: ids } },
    data: { position: { increment: maxPosition + jury.persons.length + 1 } },
  });
  for (const [orderPosition, person] of jury.persons.entries()) {
    if (!person.image || !person.translations)
      throw new IncompleteFestivalError();
    let personId: string;
    if (person.id) {
      const updated = await tx.festivalJuryPerson.updateMany({
        where: { id: person.id, festivalJuryId: juryId },
        data: { image: person.image, position: orderPosition },
      });
      if (updated.count !== 1) throw new ForeignNestedIdError();
      personId = person.id;
    } else {
      personId = (
        await tx.festivalJuryPerson.create({
          data: {
            festivalJuryId: juryId,
            image: person.image,
            position: orderPosition,
          },
          select: { id: true },
        })
      ).id;
    }
    await tx.festivalJuryPersonTranslation.deleteMany({
      where: {
        festivalJuryPersonId: personId,
        locale: { notIn: [Locale.ru, Locale.en] },
      },
    });
    for (const translation of person.translations) {
      if (!translation.locale || !translation.name || !translation.position)
        throw new IncompleteFestivalError();
      await tx.festivalJuryPersonTranslation.upsert({
        where: {
          festivalJuryPersonId_locale: {
            festivalJuryPersonId: personId,
            locale: translation.locale,
          },
        },
        create: {
          festivalJuryPersonId: personId,
          locale: translation.locale,
          name: translation.name,
          position: translation.position,
        },
        update: { name: translation.name, position: translation.position },
      });
    }
  }
}

async function syncOrganizations(
  tx: Prisma.TransactionClient,
  festivalContentId: string,
  organizations: UpdateFestivalContentDto['organizations']
): Promise<void> {
  const existing = await tx.festivalOrganizations.findUnique({
    where: { festivalContentId },
    select: { id: true },
  });
  if (!organizations) {
    await tx.festivalOrganizations.deleteMany({ where: { festivalContentId } });
    return;
  }
  if (organizations.id && organizations.id !== existing?.id)
    throw new ForeignNestedIdError();
  const blockId =
    existing?.id ??
    (
      await tx.festivalOrganizations.create({
        data: { festivalContentId },
        select: { id: true },
      })
    ).id;
  if (!organizations.translations || !organizations.organizations)
    throw new IncompleteFestivalError();
  await tx.festivalOrganizationsTranslation.deleteMany({
    where: {
      festivalOrganizationsId: blockId,
      locale: { notIn: [Locale.ru, Locale.en] },
    },
  });
  for (const translation of organizations.translations) {
    if (!translation.locale || !translation.title)
      throw new IncompleteFestivalError();
    await tx.festivalOrganizationsTranslation.upsert({
      where: {
        festivalOrganizationsId_locale: {
          festivalOrganizationsId: blockId,
          locale: translation.locale,
        },
      },
      create: {
        festivalOrganizationsId: blockId,
        locale: translation.locale,
        title: translation.title,
      },
      update: { title: translation.title },
    });
  }
  const existingItems = await tx.festivalOrganization.findMany({
    where: { festivalOrganizationsId: blockId },
    select: { id: true, position: true },
  });
  const ids = organizations.organizations.flatMap((item) =>
    item.id ? [item.id] : []
  );
  assertUniqueIds(ids);
  const existingIds = new Set(existingItems.map((item) => item.id));
  if (ids.some((id) => !existingIds.has(id))) throw new ForeignNestedIdError();
  await tx.festivalOrganization.deleteMany({
    where: { festivalOrganizationsId: blockId, id: { notIn: ids } },
  });
  const maxPosition = existingItems.reduce(
    (maximum, item) => Math.max(maximum, item.position),
    -1
  );
  await tx.festivalOrganization.updateMany({
    where: { festivalOrganizationsId: blockId, id: { in: ids } },
    data: {
      position: {
        increment: maxPosition + organizations.organizations.length + 1,
      },
    },
  });
  for (const [position, item] of organizations.organizations.entries()) {
    if (!item.value || !item.translations) throw new IncompleteFestivalError();
    let itemId: string;
    if (item.id) {
      const updated = await tx.festivalOrganization.updateMany({
        where: { id: item.id, festivalOrganizationsId: blockId },
        data: { value: item.value, position },
      });
      if (updated.count !== 1) throw new ForeignNestedIdError();
      itemId = item.id;
    } else {
      itemId = (
        await tx.festivalOrganization.create({
          data: {
            festivalOrganizationsId: blockId,
            value: item.value,
            position,
          },
          select: { id: true },
        })
      ).id;
    }
    await tx.festivalOrganizationTranslation.deleteMany({
      where: {
        festivalOrganizationId: itemId,
        locale: { notIn: [Locale.ru, Locale.en] },
      },
    });
    for (const translation of item.translations) {
      if (!translation.locale || !translation.name)
        throw new IncompleteFestivalError();
      await tx.festivalOrganizationTranslation.upsert({
        where: {
          festivalOrganizationId_locale: {
            festivalOrganizationId: itemId,
            locale: translation.locale,
          },
        },
        create: {
          festivalOrganizationId: itemId,
          locale: translation.locale,
          name: translation.name,
        },
        update: { name: translation.name },
      });
    }
  }
}

export async function updateFestivalContent(
  id: string,
  input: UpdateFestivalContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  const parsed = updateFestivalContentDtoSchema.safeParse(input);
  if (!parsedId.success || !parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: parsed.success ? undefined : fieldErrors(parsed.error),
    };
  const validationFailure = validateLocales(parsed.data);
  if (validationFailure) return validationFailure;

  try {
    await prisma.$transaction(async (tx) => {
      const root = await tx.festivalContent.findUnique({
        where: { id: parsedId.data },
        select: { id: true },
      });
      if (!root) throw new FestivalNotFoundError();
      if (parsed.data.slug) {
        const duplicate = await tx.festivalContent.findFirst({
          where: { slug: parsed.data.slug, id: { not: parsedId.data } },
          select: { id: true },
        });
        if (duplicate) throw new DuplicateSlugError();
      }
      await tx.festivalContent.update({
        where: { id: parsedId.data },
        data: {
          logo: parsed.data.logo,
          slug: parsed.data.slug,
          images: parsed.data.images,
          videos: parsed.data.videos,
          achievements: parsed.data.achievements,
          socials: parsed.data.socials,
        },
      });
      await tx.festivalContentTranslation.deleteMany({
        where: {
          festivalContentId: parsedId.data,
          locale: { notIn: [Locale.ru, Locale.en] },
        },
      });
      for (const translation of parsed.data.translations ?? []) {
        if (!translation.locale || !translation.title)
          throw new IncompleteFestivalError();
        await tx.festivalContentTranslation.upsert({
          where: {
            festivalContentId_locale: {
              festivalContentId: parsedId.data,
              locale: translation.locale,
            },
          },
          create: {
            festivalContentId: parsedId.data,
            locale: translation.locale,
            title: translation.title,
          },
          update: { title: translation.title },
        });
      }
      await syncEvents(tx, parsedId.data, parsed.data.events ?? []);
      await syncNominations(tx, parsedId.data, parsed.data.nominations);
      await syncJury(tx, parsedId.data, parsed.data.jury);
      await syncOrganizations(tx, parsedId.data, parsed.data.organizations);
    });
    revalidatePath(listPath);
    revalidatePath(`${listPath}/${parsedId.data}/edit`);
    return { success: true, message: 'Фестиваль обновлён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function deleteFestivalContent(id: string): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success)
    return { success: false, message: 'Некорректный идентификатор фестиваля' };
  try {
    await prisma.festivalContent.delete({ where: { id: parsedId.data } });
    revalidatePath(listPath);
    return { success: true, message: 'Фестиваль удалён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
