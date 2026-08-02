'use server';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import {
  createPerformancesContentDtoSchema,
  type CreatePerformancesContentDto,
  updatePerformancesContentDtoSchema,
  type UpdatePerformancesContentDto,
} from '@ak-strannik/types/performances';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionFailure,
  type ActionResult,
} from '../../../../../lib/action-utils';
import { validateRequiredLocales } from '../../../../../lib/validate-required-locales';

const listPath = '/projects/performances';

class ForeignPersonError extends Error {}
class PerformancesContentNotFoundError extends Error {}

function validateLocales(
  data: CreatePerformancesContentDto | UpdatePerformancesContentDto
): ActionFailure | null {
  const rootFailure = validateRequiredLocales(data.translations);
  if (rootFailure) {
    return {
      success: false,
      message: rootFailure.message,
      fieldErrors: {
        translations: ['Обязательны переводы ru и en без дубликатов'],
      },
    };
  }

  for (const [index, person] of (data.persons ?? []).entries()) {
    const failure = validateRequiredLocales(person.translations);
    if (failure) {
      return {
        success: false,
        message: `Участник ${index + 1}: ${failure.message}`,
        fieldErrors: {
          [`persons.${index}.translations`]: [
            'Обязательны переводы ru и en без дубликатов',
          ],
        },
      };
    }
  }

  return null;
}

function handleDatabaseError(error: unknown): ActionFailure {
  if (error instanceof ForeignPersonError) {
    return {
      success: false,
      message: 'Один из участников не принадлежит редактируемой постановке',
    };
  }
  if (error instanceof PerformancesContentNotFoundError) {
    return { success: false, message: 'Постановка не найдена' };
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return {
        success: false,
        message: 'Нарушена уникальность данных постановки',
      };
    }
    if (error.code === 'P2025') {
      return { success: false, message: 'Постановка не найдена' };
    }
  }

  console.error('[PerformancesContent] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить изменения. Попробуйте ещё раз',
  };
}

export async function createPerformancesContent(
  input: CreatePerformancesContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsed = createPerformancesContentDtoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const localeFailure = validateLocales(parsed.data);
  if (localeFailure) return localeFailure;

  try {
    await prisma.$transaction(async (transaction) => {
      const root = await transaction.performancesContent.create({
        data: { images: parsed.data.images, videos: parsed.data.videos },
        select: { id: true },
      });

      await transaction.performancesContentTranslation.createMany({
        data: parsed.data.translations.map((translation) => ({
          performancesContentId: root.id,
          locale: translation.locale,
          title: translation.title,
        })),
      });

      for (const [position, person] of parsed.data.persons.entries()) {
        const created = await transaction.performancePerson.create({
          data: { performancesContentId: root.id, position },
          select: { id: true },
        });
        await transaction.performancePersonTranslation.createMany({
          data: person.translations.map((translation) => ({
            performancePersonId: created.id,
            locale: translation.locale,
            name: translation.name,
          })),
        });
      }
    });

    revalidatePath(listPath);
    return { success: true, message: 'Постановка создана' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function updatePerformancesContent(
  id: string,
  input: UpdatePerformancesContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsedId = idSchema.safeParse(id);
  const parsed = updatePerformancesContentDtoSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: parsed.success ? undefined : fieldErrors(parsed.error),
    };
  }
  const localeFailure = validateLocales(parsed.data);
  if (localeFailure) return localeFailure;

  const persons = parsed.data.persons ?? [];
  const personIds = persons.flatMap((person) => (person.id ? [person.id] : []));
  if (new Set(personIds).size !== personIds.length) {
    return { success: false, message: 'Участник не может повторяться в форме' };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const root = await transaction.performancesContent.findUnique({
        where: { id: parsedId.data },
        select: { id: true },
      });
      if (!root) throw new PerformancesContentNotFoundError();

      const existing = await transaction.performancePerson.findMany({
        where: { performancesContentId: parsedId.data },
        select: { id: true, position: true },
      });
      const existingIds = new Set(existing.map((person) => person.id));
      if (personIds.some((personId) => !existingIds.has(personId))) {
        throw new ForeignPersonError();
      }

      const submittedIds = new Set(personIds);
      await transaction.performancePerson.deleteMany({
        where: {
          performancesContentId: parsedId.data,
          id: { notIn: [...submittedIds] },
        },
      });

      const maxPosition = existing.reduce(
        (maximum, person) => Math.max(maximum, person.position),
        -1
      );
      const offset = maxPosition + persons.length + 1;
      await transaction.performancePerson.updateMany({
        where: {
          performancesContentId: parsedId.data,
          id: { in: personIds },
        },
        data: { position: { increment: offset } },
      });

      await transaction.performancesContent.update({
        where: { id: parsedId.data },
        data: {
          images: parsed.data.images,
          videos: parsed.data.videos,
        },
      });
      await transaction.performancesContentTranslation.deleteMany({
        where: {
          performancesContentId: parsedId.data,
          locale: { notIn: [Locale.ru, Locale.en] },
        },
      });
      for (const translation of parsed.data.translations ?? []) {
        if (!translation.locale || !translation.title) {
          throw new Error('Validated root translation is incomplete');
        }
        await transaction.performancesContentTranslation.upsert({
          where: {
            performancesContentId_locale: {
              performancesContentId: parsedId.data,
              locale: translation.locale,
            },
          },
          create: {
            performancesContentId: parsedId.data,
            locale: translation.locale,
            title: translation.title,
          },
          update: { title: translation.title },
        });
      }

      for (const [position, person] of persons.entries()) {
        const translations = person.translations;
        if (!translations)
          throw new Error('Validated person has no translations');

        let personId: string;
        if (person.id) {
          const updated = await transaction.performancePerson.updateMany({
            where: {
              id: person.id,
              performancesContentId: parsedId.data,
            },
            data: { position },
          });
          if (updated.count !== 1) throw new ForeignPersonError();
          personId = person.id;
        } else {
          const created = await transaction.performancePerson.create({
            data: { performancesContentId: parsedId.data, position },
            select: { id: true },
          });
          personId = created.id;
        }

        await transaction.performancePersonTranslation.deleteMany({
          where: {
            performancePersonId: personId,
            locale: { notIn: [Locale.ru, Locale.en] },
          },
        });
        for (const translation of translations) {
          if (!translation.locale || !translation.name) {
            throw new Error('Validated person translation is incomplete');
          }
          await transaction.performancePersonTranslation.upsert({
            where: {
              performancePersonId_locale: {
                performancePersonId: personId,
                locale: translation.locale,
              },
            },
            create: {
              performancePersonId: personId,
              locale: translation.locale,
              name: translation.name,
            },
            update: { name: translation.name },
          });
        }
      }
    });

    revalidatePath(listPath);
    revalidatePath(`${listPath}/${parsedId.data}/edit`);
    return { success: true, message: 'Постановка обновлена' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function deletePerformancesContent(
  id: string
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return { success: false, message: 'Некорректный идентификатор постановки' };
  }

  try {
    await prisma.performancesContent.delete({ where: { id: parsedId.data } });
    revalidatePath(listPath);
    return { success: true, message: 'Постановка удалена' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
