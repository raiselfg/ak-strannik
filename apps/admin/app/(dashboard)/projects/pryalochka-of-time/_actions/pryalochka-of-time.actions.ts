'use server';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import {
  createPryalochkaOfTimeContentDtoSchema,
  type CreatePryalochkaOfTimeContentDto,
  updatePryalochkaOfTimeContentDtoSchema,
  type UpdatePryalochkaOfTimeContentDto,
} from '@ak-strannik/types/pryalochka-of-time';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionFailure,
  type ActionResult,
} from '../../../../../lib/action-utils';
import { validateRequiredLocales } from '../../../../../lib/validate-required-locales';

const pagePath = '/projects/pryalochka-of-time';
class SingletonAlreadyExistsError extends Error {}
class SingletonConflictError extends Error {}
class ContentNotFoundError extends Error {}
class ContentIdMismatchError extends Error {}
class ForeignEventError extends Error {}
class ForeignActorError extends Error {}
class DuplicateEventError extends Error {}
class DuplicateActorError extends Error {}
class IncompleteNestedDataError extends Error {}

function validateLocales(
  data: CreatePryalochkaOfTimeContentDto | UpdatePryalochkaOfTimeContentDto
): ActionFailure | null {
  for (const [index, event] of (data.events ?? []).entries()) {
    const failure = validateRequiredLocales(event.translations);
    if (failure)
      return {
        success: false,
        message: `Событие ${index + 1}: ${failure.message}`,
        fieldErrors: {
          [`events.${index}.translations`]: [
            'Обязательны переводы ru и en без дубликатов',
          ],
        },
      };
  }
  for (const [index, actor] of (data.actors ?? []).entries()) {
    const failure = validateRequiredLocales(actor.translations);
    if (failure)
      return {
        success: false,
        message: `Актёр ${index + 1}: ${failure.message}`,
        fieldErrors: {
          [`actors.${index}.translations`]: [
            'Обязательны переводы ru и en без дубликатов',
          ],
        },
      };
  }
  return null;
}

function handleError(error: unknown): ActionFailure {
  if (error instanceof SingletonAlreadyExistsError)
    return {
      success: false,
      message:
        'Запись PryalochkaOfTimeContent уже существует. Создание второй singleton-записи запрещено',
    };
  if (error instanceof SingletonConflictError)
    return {
      success: false,
      message:
        'Обнаружено несколько записей PryalochkaOfTimeContent. Исправьте данные вручную в базе',
    };
  if (error instanceof ContentNotFoundError)
    return {
      success: false,
      message: 'Запись PryalochkaOfTimeContent не найдена',
    };
  if (error instanceof ContentIdMismatchError)
    return {
      success: false,
      message:
        'Переданная запись не соответствует singleton PryalochkaOfTimeContent',
    };
  if (error instanceof ForeignEventError)
    return {
      success: false,
      message: 'Одно из событий не принадлежит редактируемой записи',
    };
  if (error instanceof ForeignActorError)
    return {
      success: false,
      message: 'Один из актёров не принадлежит редактируемой записи',
    };
  if (error instanceof DuplicateEventError)
    return { success: false, message: 'Событие не может повторяться в форме' };
  if (error instanceof DuplicateActorError)
    return { success: false, message: 'Актёр не может повторяться в форме' };
  if (error instanceof IncompleteNestedDataError)
    return {
      success: false,
      message: 'Проверьте заполнение событий, актёров и их переводов',
    };
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025')
      return {
        success: false,
        message: 'Запись PryalochkaOfTimeContent не найдена',
      };
    if (error.code === 'P2002')
      return {
        success: false,
        message: 'Нарушена уникальность порядка или переводов',
      };
  }
  console.error('[PryalochkaOfTimeContent] mutation failed', error);
  return {
    success: false,
    message:
      'Не удалось сохранить раздел «Прялочка времени». Попробуйте ещё раз',
  };
}

export async function createPryalochkaOfTimeContent(
  input: CreatePryalochkaOfTimeContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsed = createPryalochkaOfTimeContentDtoSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: fieldErrors(parsed.error),
    };
  const localeFailure = validateLocales(parsed.data);
  if (localeFailure) return localeFailure;

  try {
    await prisma.$transaction(async (transaction) => {
      const existing = await transaction.pryalochkaOfTimeContent.findMany({
        take: 1,
        select: { id: true },
      });
      if (existing.length) throw new SingletonAlreadyExistsError();
      const root = await transaction.pryalochkaOfTimeContent.create({
        data: { images: parsed.data.images },
        select: { id: true },
      });
      for (const [position, event] of parsed.data.events.entries()) {
        const created = await transaction.pryalochkaOfTimeEvent.create({
          data: {
            pryalochkaOfTimeContentId: root.id,
            image: event.image,
            link: event.link ?? null,
            position,
          },
          select: { id: true },
        });
        await transaction.pryalochkaOfTimeEventTranslation.createMany({
          data: event.translations.map((translation) => ({
            pryalochkaOfTimeEventId: created.id,
            locale: translation.locale,
            text: translation.text,
          })),
        });
      }
      for (const [position, actor] of parsed.data.actors.entries()) {
        const created = await transaction.pryalochkaOfTimeActor.create({
          data: { pryalochkaOfTimeContentId: root.id, position },
          select: { id: true },
        });
        await transaction.pryalochkaOfTimeActorTranslation.createMany({
          data: actor.translations.map((translation) => ({
            pryalochkaOfTimeActorId: created.id,
            locale: translation.locale,
            name: translation.name,
            text: translation.text,
          })),
        });
      }
    });
    revalidatePath(pagePath);
    return { success: true, message: 'Раздел «Прялочка времени» создан' };
  } catch (error) {
    return handleError(error);
  }
}

export async function updatePryalochkaOfTimeContent(
  id: string,
  input: UpdatePryalochkaOfTimeContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  const parsed = updatePryalochkaOfTimeContentDtoSchema.safeParse(input);
  if (!parsedId.success || !parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: parsed.success ? undefined : fieldErrors(parsed.error),
    };
  const localeFailure = validateLocales(parsed.data);
  if (localeFailure) return localeFailure;
  const events = parsed.data.events ?? [];
  const actors = parsed.data.actors ?? [];
  const eventIds = events.flatMap((event) => (event.id ? [event.id] : []));
  const actorIds = actors.flatMap((actor) => (actor.id ? [actor.id] : []));
  if (new Set(eventIds).size !== eventIds.length)
    return handleError(new DuplicateEventError());
  if (new Set(actorIds).size !== actorIds.length)
    return handleError(new DuplicateActorError());

  try {
    await prisma.$transaction(async (transaction) => {
      const roots = await transaction.pryalochkaOfTimeContent.findMany({
        take: 2,
        select: { id: true },
      });
      if (!roots.length) throw new ContentNotFoundError();
      if (roots.length > 1) throw new SingletonConflictError();
      if (roots[0]?.id !== parsedId.data) throw new ContentIdMismatchError();
      const [existingEvents, existingActors] = await Promise.all([
        transaction.pryalochkaOfTimeEvent.findMany({
          where: { pryalochkaOfTimeContentId: parsedId.data },
          select: { id: true, position: true },
        }),
        transaction.pryalochkaOfTimeActor.findMany({
          where: { pryalochkaOfTimeContentId: parsedId.data },
          select: { id: true, position: true },
        }),
      ]);
      const existingEventIds = new Set(existingEvents.map((item) => item.id));
      const existingActorIds = new Set(existingActors.map((item) => item.id));
      if (eventIds.some((itemId) => !existingEventIds.has(itemId)))
        throw new ForeignEventError();
      if (actorIds.some((itemId) => !existingActorIds.has(itemId)))
        throw new ForeignActorError();

      await transaction.pryalochkaOfTimeEvent.deleteMany({
        where: {
          pryalochkaOfTimeContentId: parsedId.data,
          id: { notIn: eventIds },
        },
      });
      await transaction.pryalochkaOfTimeActor.deleteMany({
        where: {
          pryalochkaOfTimeContentId: parsedId.data,
          id: { notIn: actorIds },
        },
      });
      const eventShift =
        Math.max(
          events.length,
          ...existingEvents.map((item) => item.position + 1)
        ) +
        existingEvents.length +
        1;
      const actorShift =
        Math.max(
          actors.length,
          ...existingActors.map((item) => item.position + 1)
        ) +
        existingActors.length +
        1;
      await transaction.pryalochkaOfTimeEvent.updateMany({
        where: { pryalochkaOfTimeContentId: parsedId.data },
        data: { position: { increment: eventShift } },
      });
      await transaction.pryalochkaOfTimeActor.updateMany({
        where: { pryalochkaOfTimeContentId: parsedId.data },
        data: { position: { increment: actorShift } },
      });
      await transaction.pryalochkaOfTimeContent.update({
        where: { id: parsedId.data },
        data: { images: parsed.data.images ?? [] },
      });

      for (const [position, event] of events.entries()) {
        if (!event.image || !event.translations)
          throw new IncompleteNestedDataError();
        let eventId: string;
        if (event.id) {
          const updated = await transaction.pryalochkaOfTimeEvent.updateMany({
            where: { id: event.id, pryalochkaOfTimeContentId: parsedId.data },
            data: { image: event.image, link: event.link ?? null, position },
          });
          if (updated.count !== 1) throw new ForeignEventError();
          eventId = event.id;
        } else {
          const created = await transaction.pryalochkaOfTimeEvent.create({
            data: {
              pryalochkaOfTimeContentId: parsedId.data,
              image: event.image,
              link: event.link ?? null,
              position,
            },
            select: { id: true },
          });
          eventId = created.id;
        }
        await transaction.pryalochkaOfTimeEventTranslation.deleteMany({
          where: {
            pryalochkaOfTimeEventId: eventId,
            locale: { notIn: [Locale.ru, Locale.en] },
          },
        });
        for (const translation of event.translations) {
          if (!translation.locale || !translation.text)
            throw new IncompleteNestedDataError();
          await transaction.pryalochkaOfTimeEventTranslation.upsert({
            where: {
              pryalochkaOfTimeEventId_locale: {
                pryalochkaOfTimeEventId: eventId,
                locale: translation.locale,
              },
            },
            create: {
              pryalochkaOfTimeEventId: eventId,
              locale: translation.locale,
              text: translation.text,
            },
            update: { text: translation.text },
          });
        }
      }
      for (const [position, actor] of actors.entries()) {
        if (!actor.translations) throw new IncompleteNestedDataError();
        let actorId: string;
        if (actor.id) {
          const updated = await transaction.pryalochkaOfTimeActor.updateMany({
            where: { id: actor.id, pryalochkaOfTimeContentId: parsedId.data },
            data: { position },
          });
          if (updated.count !== 1) throw new ForeignActorError();
          actorId = actor.id;
        } else {
          const created = await transaction.pryalochkaOfTimeActor.create({
            data: { pryalochkaOfTimeContentId: parsedId.data, position },
            select: { id: true },
          });
          actorId = created.id;
        }
        await transaction.pryalochkaOfTimeActorTranslation.deleteMany({
          where: {
            pryalochkaOfTimeActorId: actorId,
            locale: { notIn: [Locale.ru, Locale.en] },
          },
        });
        for (const translation of actor.translations) {
          if (!translation.locale || !translation.name || !translation.text)
            throw new IncompleteNestedDataError();
          await transaction.pryalochkaOfTimeActorTranslation.upsert({
            where: {
              pryalochkaOfTimeActorId_locale: {
                pryalochkaOfTimeActorId: actorId,
                locale: translation.locale,
              },
            },
            create: {
              pryalochkaOfTimeActorId: actorId,
              locale: translation.locale,
              name: translation.name,
              text: translation.text,
            },
            update: { name: translation.name, text: translation.text },
          });
        }
      }
    });
    revalidatePath(pagePath);
    return { success: true, message: 'Раздел «Прялочка времени» обновлён' };
  } catch (error) {
    return handleError(error);
  }
}
