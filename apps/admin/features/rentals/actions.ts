'use server';

import { prisma } from '@ak-strannik/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdminSession } from '../../lib/require-admin-session';
import type { ActionResult } from '../team/actions';
import { RentalItemFormSchema, type RentalItemFormValues } from './schema';

const idSchema = z.uuid();

function fieldErrors(error: z.ZodError): Record<string, string[]> {
  return error.issues.reduce<Record<string, string[]>>((result, issue) => {
    const key = issue.path.join('.');
    if (key) result[key] = [...(result[key] ?? []), issue.message];
    return result;
  }, {});
}

function hasEnglishTranslation(values: RentalItemFormValues) {
  const translation = values.translations.en;
  return Boolean(
    translation.title.trim()
    || translation.description?.trim()
    || translation.priceText?.trim()
  );
}

function isUniqueConstraintError(error: unknown) {
  return typeof error === 'object'
    && error !== null
    && 'code' in error
    && error.code === 'P2002';
}

async function authenticate(): Promise<ActionResult | null> {
  try {
    await requireAdminSession();
    return null;
  } catch {
    return {
      success: false,
      message: 'Необходимо войти в административную панель',
    };
  }
}

async function imageExists(imageId: string | null) {
  if (imageId === null) return true;
  const image = await prisma.mediaAsset.findFirst({
    where: { id: imageId, mimeType: { startsWith: 'image/' } },
    select: { id: true },
  });
  return Boolean(image);
}

function slugConflictResult(): ActionResult {
  return {
    success: false,
    message: 'Позиция с таким slug уже существует',
    fieldErrors: { slug: ['Позиция с таким slug уже существует'] },
  };
}

export async function createRentalItemAction(
  input: RentalItemFormValues
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  const parsed = RentalItemFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполненные поля',
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const values = parsed.data;
  const slugExists = await prisma.rentalItem.findUnique({
    where: { slug: values.slug },
    select: { id: true },
  });
  if (slugExists) return slugConflictResult();
  if (!await imageExists(values.imageId)) {
    return {
      success: false,
      message: 'Выбранное изображение не найдено',
      fieldErrors: { imageId: ['Выбранное изображение не найдено'] },
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const item = await tx.rentalItem.create({
        data: {
          slug: values.slug,
          type: values.type,
          imageId: values.imageId,
          sortOrder: values.sortOrder,
          isActive: values.isActive,
        },
      });
      await tx.rentalItemTranslation.create({
        data: {
          rentalItemId: item.id,
          locale: 'ru',
          ...values.translations.ru,
        },
      });
      if (hasEnglishTranslation(values)) {
        await tx.rentalItemTranslation.create({
          data: {
            rentalItemId: item.id,
            locale: 'en',
            ...values.translations.en,
          },
        });
      }
    });
    revalidatePath('/rentals');
    return { success: true, message: 'Позиция аренды добавлена' };
  } catch (error) {
    if (isUniqueConstraintError(error)) return slugConflictResult();
    console.error('Failed to create rental item:', error);
    return { success: false, message: 'Не удалось добавить позицию аренды' };
  }
}

export async function updateRentalItemAction(
  id: string,
  input: RentalItemFormValues
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success) {
    return { success: false, message: 'Некорректный идентификатор позиции' };
  }
  const parsed = RentalItemFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполненные поля',
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const values = parsed.data;
  const item = await prisma.rentalItem.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!item) return { success: false, message: 'Позиция аренды не найдена' };
  const slugExists = await prisma.rentalItem.findFirst({
    where: { slug: values.slug, id: { not: id } },
    select: { id: true },
  });
  if (slugExists) return slugConflictResult();
  if (!await imageExists(values.imageId)) {
    return {
      success: false,
      message: 'Выбранное изображение не найдено',
      fieldErrors: { imageId: ['Выбранное изображение не найдено'] },
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.rentalItem.update({
        where: { id },
        data: {
          slug: values.slug,
          type: values.type,
          imageId: values.imageId,
          sortOrder: values.sortOrder,
          isActive: values.isActive,
        },
      });
      await tx.rentalItemTranslation.upsert({
        where: { rentalItemId_locale: { rentalItemId: id, locale: 'ru' } },
        create: { rentalItemId: id, locale: 'ru', ...values.translations.ru },
        update: values.translations.ru,
      });
      if (hasEnglishTranslation(values)) {
        await tx.rentalItemTranslation.upsert({
          where: { rentalItemId_locale: { rentalItemId: id, locale: 'en' } },
          create: { rentalItemId: id, locale: 'en', ...values.translations.en },
          update: values.translations.en,
        });
      } else {
        await tx.rentalItemTranslation.deleteMany({
          where: { rentalItemId: id, locale: 'en' },
        });
      }
    });
    revalidatePath('/rentals');
    revalidatePath(`/rentals/${id}`);
    return { success: true, message: 'Изменения сохранены' };
  } catch (error) {
    if (isUniqueConstraintError(error)) return slugConflictResult();
    console.error('Failed to update rental item:', error);
    return { success: false, message: 'Не удалось сохранить изменения' };
  }
}

export async function deleteRentalItemAction(id: string): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success) {
    return { success: false, message: 'Некорректный идентификатор позиции' };
  }
  try {
    const exists = await prisma.rentalItem.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return { success: false, message: 'Позиция аренды не найдена' };
    await prisma.rentalItem.delete({ where: { id } });
    revalidatePath('/rentals');
    return { success: true, message: 'Позиция аренды удалена' };
  } catch (error) {
    console.error('Failed to delete rental item:', error);
    return { success: false, message: 'Не удалось удалить позицию аренды' };
  }
}
