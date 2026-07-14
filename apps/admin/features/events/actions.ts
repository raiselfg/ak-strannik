'use server';

import { prisma } from '@ak-strannik/database';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionResult,
} from '../../lib/action-utils';
import { EventFormSchema, type EventFormValues } from './schema';

function hasEnglishTranslation(values: EventFormValues) {
  const translation = values.translations.en;
  return Boolean(
    translation.title.trim() ||
    translation.excerpt?.trim() ||
    translation.body?.trim() ||
    translation.seoTitle?.trim() ||
    translation.seoDescription?.trim() ||
    translation.dateText?.trim() ||
    translation.locationText?.trim()
  );
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}

function slugConflictResult(): ActionResult {
  return {
    success: false,
    message: 'Мероприятие с таким slug уже существует',
    fieldErrors: { slug: ['Мероприятие с таким slug уже существует'] },
  };
}

async function validateMedia(
  values: EventFormValues
): Promise<ActionResult | null> {
  if (
    values.projectId &&
    !(await prisma.project.findUnique({
      where: { id: values.projectId },
      select: { id: true },
    }))
  ) {
    return {
      success: false,
      message: 'Выбранный проект не найден',
      fieldErrors: { projectId: ['Выбранный проект не найден'] },
    };
  }
  if (values.coverImageId) {
    const cover = await prisma.mediaAsset.findFirst({
      where: { id: values.coverImageId, mimeType: { startsWith: 'image/' } },
      select: { id: true },
    });
    if (!cover) {
      return {
        success: false,
        message: 'Выбранная обложка не найдена',
        fieldErrors: { coverImageId: ['Выбранная обложка не найдена'] },
      };
    }
  }
  const galleryIds = values.gallery.map((item) => item.mediaId);
  if (galleryIds.length) {
    const count = await prisma.mediaAsset.count({
      where: { id: { in: galleryIds }, mimeType: { startsWith: 'image/' } },
    });
    if (count !== galleryIds.length) {
      return {
        success: false,
        message: 'Одно из изображений галереи не найдено',
        fieldErrors: { gallery: ['Одно из изображений галереи не найдено'] },
      };
    }
  }
  return null;
}

function resolvePublishedAt(
  values: EventFormValues,
  existing: Date | null = null
) {
  if (values.status !== 'published') return values.publishedAt ?? existing;
  return values.publishedAt ?? existing ?? new Date();
}

export async function createEventAction(
  input: EventFormValues
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  const parsed = EventFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполненные поля',
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const values = parsed.data;
  if (
    await prisma.event.findUnique({
      where: { slug: values.slug },
      select: { id: true },
    })
  ) {
    return slugConflictResult();
  }
  const mediaError = await validateMedia(values);
  if (mediaError) return mediaError;

  try {
    await prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          slug: values.slug,
          status: values.status,
          eventYear: values.eventYear,
          startDate: values.startDate,
          endDate: values.endDate,
          projectId: values.projectId,
          coverImageId: values.coverImageId,
          sortOrder: values.sortOrder,
          publishedAt: resolvePublishedAt(values),
        },
      });
      await tx.eventTranslation.create({
        data: { eventId: event.id, locale: 'ru', ...values.translations.ru },
      });
      if (hasEnglishTranslation(values)) {
        await tx.eventTranslation.create({
          data: { eventId: event.id, locale: 'en', ...values.translations.en },
        });
      }
      if (values.gallery.length) {
        await tx.eventImage.createMany({
          data: values.gallery.map((image) => ({
            eventId: event.id,
            ...image,
          })),
        });
      }
      if (values.videos.length) {
        await tx.eventVideo.createMany({
          data: values.videos.map((video) => ({ eventId: event.id, ...video })),
        });
      }
    });
    revalidatePath('/events');
    return { success: true, message: 'Мероприятие добавлено' };
  } catch (error) {
    if (isUniqueConstraintError(error)) return slugConflictResult();
    console.error('Failed to create event:', error);
    return { success: false, message: 'Не удалось добавить мероприятие' };
  }
}

export async function updateEventAction(
  id: string,
  input: EventFormValues
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success) {
    return {
      success: false,
      message: 'Некорректный идентификатор мероприятия',
    };
  }
  const parsed = EventFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполненные поля',
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const values = parsed.data;
  const existing = await prisma.event.findUnique({
    where: { id },
    select: { id: true, publishedAt: true },
  });
  if (!existing) return { success: false, message: 'Мероприятие не найдено' };
  if (
    await prisma.event.findFirst({
      where: { slug: values.slug, id: { not: id } },
      select: { id: true },
    })
  )
    return slugConflictResult();
  const mediaError = await validateMedia(values);
  if (mediaError) return mediaError;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.event.update({
        where: { id },
        data: {
          slug: values.slug,
          status: values.status,
          eventYear: values.eventYear,
          startDate: values.startDate,
          endDate: values.endDate,
          projectId: values.projectId,
          coverImageId: values.coverImageId,
          sortOrder: values.sortOrder,
          publishedAt: resolvePublishedAt(values, existing.publishedAt),
        },
      });
      await tx.eventTranslation.upsert({
        where: { eventId_locale: { eventId: id, locale: 'ru' } },
        create: { eventId: id, locale: 'ru', ...values.translations.ru },
        update: values.translations.ru,
      });
      if (hasEnglishTranslation(values)) {
        await tx.eventTranslation.upsert({
          where: { eventId_locale: { eventId: id, locale: 'en' } },
          create: { eventId: id, locale: 'en', ...values.translations.en },
          update: values.translations.en,
        });
      } else {
        await tx.eventTranslation.deleteMany({
          where: { eventId: id, locale: 'en' },
        });
      }
      await tx.eventImage.deleteMany({ where: { eventId: id } });
      if (values.gallery.length) {
        await tx.eventImage.createMany({
          data: values.gallery.map((image) => ({ eventId: id, ...image })),
        });
      }
      await tx.eventVideo.deleteMany({ where: { eventId: id } });
      if (values.videos.length) {
        await tx.eventVideo.createMany({
          data: values.videos.map((video) => ({ eventId: id, ...video })),
        });
      }
    });
    revalidatePath('/events');
    revalidatePath(`/events/${id}`);
    return { success: true, message: 'Изменения сохранены' };
  } catch (error) {
    if (isUniqueConstraintError(error)) return slugConflictResult();
    console.error('Failed to update event:', error);
    return { success: false, message: 'Не удалось сохранить изменения' };
  }
}

export async function deleteEventAction(id: string): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success) {
    return {
      success: false,
      message: 'Некорректный идентификатор мероприятия',
    };
  }
  try {
    if (
      !(await prisma.event.findUnique({ where: { id }, select: { id: true } }))
    ) {
      return { success: false, message: 'Мероприятие не найдено' };
    }
    await prisma.event.delete({ where: { id } });
    revalidatePath('/events');
    return { success: true, message: 'Мероприятие удалено' };
  } catch (error) {
    console.error('Failed to delete event:', error);
    return { success: false, message: 'Не удалось удалить мероприятие' };
  }
}
