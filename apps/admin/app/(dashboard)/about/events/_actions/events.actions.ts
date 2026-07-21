'use server';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import {
  createEventsContentDtoSchema,
  type CreateEventsContentDto,
  updateEventsContentDtoSchema,
  type UpdateEventsContentDto,
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

const listPath = '/about/events';

class ForeignEventError extends Error {}
class EventsContentNotFoundError extends Error {}
class DuplicateYearError extends Error {}

function validateEventLocales(
  events: CreateEventsContentDto['events'] | UpdateEventsContentDto['events']
): ActionFailure | null {
  for (const [index, event] of (events ?? []).entries()) {
    const failure = validateRequiredLocales(event.translations);
    if (failure) {
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
  }
  return null;
}

function handleDatabaseError(error: unknown): ActionFailure {
  if (error instanceof ForeignEventError) {
    return {
      success: false,
      message: 'Одно из событий не принадлежит редактируемому году',
    };
  }
  if (error instanceof EventsContentNotFoundError) {
    return { success: false, message: 'Контент событий не найден' };
  }
  if (error instanceof DuplicateYearError) {
    return {
      success: false,
      message: 'Контент событий за этот год уже существует',
      fieldErrors: { year: ['Год должен быть уникальным'] },
    };
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return {
        success: false,
        message: 'Нарушена уникальность данных события',
      };
    }
    if (error.code === 'P2025') {
      return { success: false, message: 'Контент событий не найден' };
    }
  }
  console.error('[EventsContent] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить изменения. Попробуйте ещё раз',
  };
}

export async function createEventsContent(
  input: CreateEventsContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsed = createEventsContentDtoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const localeFailure = validateEventLocales(parsed.data.events);
  if (localeFailure) return localeFailure;

  try {
    await prisma.$transaction(async (transaction) => {
      const duplicate = await transaction.eventsContent.findFirst({
        where: { year: parsed.data.year },
        select: { id: true },
      });
      if (duplicate) throw new DuplicateYearError();
      const root = await transaction.eventsContent.create({
        data: { year: parsed.data.year },
        select: { id: true },
      });
      for (const [position, event] of parsed.data.events.entries()) {
        await transaction.eventsContentEvent.create({
          data: {
            eventsContentId: root.id,
            position,
            images: event.images,
            videos: event.videos,
            translations: {
              create: event.translations.map(({ locale, text }) => ({
                locale,
                text,
              })),
            },
          },
        });
      }
    });
    revalidatePath(listPath);
    return { success: true, message: 'Год событий создан' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function updateEventsContent(
  id: string,
  input: UpdateEventsContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  const parsed = updateEventsContentDtoSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: parsed.success ? undefined : fieldErrors(parsed.error),
    };
  }
  const { events, year } = parsed.data;
  if (!year || !events) {
    return { success: false, message: 'Укажите год и события' };
  }
  const localeFailure = validateEventLocales(events);
  if (localeFailure) return localeFailure;
  const eventIds = events.flatMap((event) => (event.id ? [event.id] : []));
  if (new Set(eventIds).size !== eventIds.length) {
    return { success: false, message: 'Событие не может повторяться в форме' };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const root = await transaction.eventsContent.findUnique({
        where: { id: parsedId.data },
        select: { id: true },
      });
      if (!root) {
        throw new EventsContentNotFoundError();
      }
      const duplicate = await transaction.eventsContent.findFirst({
        where: { year, id: { not: parsedId.data } },
        select: { id: true },
      });
      if (duplicate) throw new DuplicateYearError();

      const existing = await transaction.eventsContentEvent.findMany({
        where: { eventsContentId: parsedId.data },
        select: { id: true, position: true },
      });
      const existingIds = new Set(existing.map((event) => event.id));
      if (eventIds.some((eventId) => !existingIds.has(eventId))) {
        throw new ForeignEventError();
      }

      const submittedIds = new Set(eventIds);
      await transaction.eventsContentEvent.deleteMany({
        where: {
          eventsContentId: parsedId.data,
          id: { notIn: [...submittedIds] },
        },
      });

      const maxPosition = existing.reduce(
        (maximum, event) => Math.max(maximum, event.position),
        -1
      );
      const offset = maxPosition + events.length + 1;
      await transaction.eventsContentEvent.updateMany({
        where: { eventsContentId: parsedId.data, id: { in: eventIds } },
        data: { position: { increment: offset } },
      });

      for (const [position, event] of events.entries()) {
        const translations = event.translations;
        if (!translations)
          throw new Error('Validated event has no translations');
        let eventId: string;
        if (event.id) {
          const updated = await transaction.eventsContentEvent.updateMany({
            where: { id: event.id, eventsContentId: parsedId.data },
            data: { images: event.images, videos: event.videos, position },
          });
          if (updated.count !== 1) throw new ForeignEventError();
          eventId = event.id;
        } else {
          const created = await transaction.eventsContentEvent.create({
            data: {
              eventsContentId: parsedId.data,
              images: event.images ?? [],
              videos: event.videos ?? [],
              position,
            },
            select: { id: true },
          });
          eventId = created.id;
        }

        await transaction.eventTranslation.deleteMany({
          where: { eventId, locale: { notIn: [Locale.ru, Locale.en] } },
        });
        for (const translation of translations) {
          const { locale, text } = translation;
          if (!locale || !text)
            throw new Error('Validated event translation is incomplete');
          await transaction.eventTranslation.upsert({
            where: { eventId_locale: { eventId, locale } },
            create: { eventId, locale, text },
            update: { text },
          });
        }
      }

      await transaction.eventsContent.update({
        where: { id: parsedId.data },
        data: { year },
      });
    });
    revalidatePath(listPath);
    revalidatePath(`${listPath}/${parsedId.data}/edit`);
    return { success: true, message: 'Год событий обновлён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function deleteEventsContent(id: string): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return { success: false, message: 'Некорректный идентификатор года' };
  }
  try {
    await prisma.eventsContent.delete({ where: { id: parsedId.data } });
    revalidatePath(listPath);
    return { success: true, message: 'Год событий удалён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
