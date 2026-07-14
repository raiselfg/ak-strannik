'use server';

import { prisma } from '@ak-strannik/database';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionResult,
} from '../../lib/action-utils';
import { PartnerFormSchema, type PartnerFormValues } from './schema';

function hasEnglishTranslation(values: PartnerFormValues) {
  return Boolean(
    values.translations.en.name.trim() ||
    values.translations.en.description?.trim()
  );
}

async function imagesExist(values: PartnerFormValues) {
  const ids = [
    ...(values.logoId ? [values.logoId] : []),
    ...values.media.map(({ mediaId }) => mediaId),
  ];
  if (!ids.length) return true;
  return (
    (await prisma.mediaAsset.count({
      where: { id: { in: ids }, mimeType: { startsWith: 'image/' } },
    })) === new Set(ids).size
  );
}

export async function createPartnerAction(
  input: PartnerFormValues
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  const parsed = PartnerFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполненные поля',
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  if (!(await imagesExist(parsed.data))) {
    return {
      success: false,
      message: 'Одно из выбранных изображений не найдено',
      fieldErrors: { media: ['Одно из выбранных изображений не найдено'] },
    };
  }

  try {
    const values = parsed.data;
    await prisma.$transaction(async (tx) => {
      const partner = await tx.partner.create({
        data: {
          logoId: values.logoId,
          websiteUrl: values.websiteUrl,
          sortOrder: values.sortOrder,
          isActive: values.isActive,
        },
      });
      await tx.partnerTranslation.create({
        data: {
          partnerId: partner.id,
          locale: 'ru',
          ...values.translations.ru,
        },
      });
      if (hasEnglishTranslation(values)) {
        await tx.partnerTranslation.create({
          data: {
            partnerId: partner.id,
            locale: 'en',
            ...values.translations.en,
          },
        });
      }
      if (values.media.length) {
        await tx.partnerMedia.createMany({
          data: values.media.map((item) => ({
            partnerId: partner.id,
            ...item,
          })),
        });
      }
      if (values.videos.length) {
        await tx.partnerVideo.createMany({
          data: values.videos.map((item) => ({
            partnerId: partner.id,
            ...item,
          })),
        });
      }
    });
    revalidatePath('/partners');
    return { success: true, message: 'Партнёр добавлен' };
  } catch (error) {
    console.error('Failed to create partner:', error);
    return { success: false, message: 'Не удалось добавить партнёра' };
  }
}

export async function updatePartnerAction(
  id: string,
  input: PartnerFormValues
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success) {
    return { success: false, message: 'Некорректный идентификатор партнёра' };
  }
  const parsed = PartnerFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполненные поля',
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  if (!(await imagesExist(parsed.data))) {
    return {
      success: false,
      message: 'Одно из выбранных изображений не найдено',
      fieldErrors: { media: ['Одно из выбранных изображений не найдено'] },
    };
  }

  try {
    const values = parsed.data;
    const exists = await prisma.partner.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return { success: false, message: 'Партнёр не найден' };
    await prisma.$transaction(async (tx) => {
      await tx.partner.update({
        where: { id },
        data: {
          logoId: values.logoId,
          websiteUrl: values.websiteUrl,
          sortOrder: values.sortOrder,
          isActive: values.isActive,
        },
      });
      await tx.partnerTranslation.upsert({
        where: { partnerId_locale: { partnerId: id, locale: 'ru' } },
        create: { partnerId: id, locale: 'ru', ...values.translations.ru },
        update: values.translations.ru,
      });
      if (hasEnglishTranslation(values)) {
        await tx.partnerTranslation.upsert({
          where: { partnerId_locale: { partnerId: id, locale: 'en' } },
          create: { partnerId: id, locale: 'en', ...values.translations.en },
          update: values.translations.en,
        });
      } else {
        await tx.partnerTranslation.deleteMany({
          where: { partnerId: id, locale: 'en' },
        });
      }
      await tx.partnerMedia.deleteMany({ where: { partnerId: id } });
      if (values.media.length) {
        await tx.partnerMedia.createMany({
          data: values.media.map((item) => ({ partnerId: id, ...item })),
        });
      }
      await tx.partnerVideo.deleteMany({ where: { partnerId: id } });
      if (values.videos.length) {
        await tx.partnerVideo.createMany({
          data: values.videos.map((item) => ({ partnerId: id, ...item })),
        });
      }
    });
    revalidatePath('/partners');
    revalidatePath(`/partners/${id}`);
    return { success: true, message: 'Изменения сохранены' };
  } catch (error) {
    console.error('Failed to update partner:', error);
    return { success: false, message: 'Не удалось сохранить изменения' };
  }
}

export async function deletePartnerAction(id: string): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success) {
    return { success: false, message: 'Некорректный идентификатор партнёра' };
  }
  try {
    const exists = await prisma.partner.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return { success: false, message: 'Партнёр не найден' };
    await prisma.partner.delete({ where: { id } });
    revalidatePath('/partners');
    return { success: true, message: 'Партнёр удалён' };
  } catch (error) {
    console.error('Failed to delete partner:', error);
    return { success: false, message: 'Не удалось удалить партнёра' };
  }
}
