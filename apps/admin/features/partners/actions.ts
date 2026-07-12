'use server';

import { prisma } from '@ak-strannik/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdminSession } from '../../lib/require-admin-session';
import type { ActionResult } from '../team/actions';
import { PartnerFormSchema, type PartnerFormValues } from './schema';

const idSchema = z.uuid();

function fieldErrors(error: z.ZodError): Record<string, string[]> {
  return error.issues.reduce<Record<string, string[]>>((result, issue) => {
    const key = issue.path.join('.');
    if (key) result[key] = [...(result[key] ?? []), issue.message];
    return result;
  }, {});
}

function hasEnglishTranslation(values: PartnerFormValues) {
  return Boolean(
    values.translations.en.name.trim()
    || values.translations.en.description?.trim()
  );
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

async function imageExists(logoId: string | null) {
  if (logoId === null) return true;
  const image = await prisma.mediaAsset.findFirst({
    where: { id: logoId, mimeType: { startsWith: 'image/' } },
    select: { id: true },
  });
  return Boolean(image);
}

export async function createPartnerAction(input: PartnerFormValues): Promise<ActionResult> {
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

  if (!await imageExists(parsed.data.logoId)) {
    return { success: false, message: 'Selected image was not found', fieldErrors: { logoId: ['Select an existing image'] } };
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
    });
    revalidatePath('/partners');
    return { success: true, message: 'Партнёр добавлен' };
  } catch (error) {
    console.error('Failed to create partner:', error);
    return { success: false, message: 'Не удалось добавить партнёра' };
  }
}

export async function updatePartnerAction(id: string, input: PartnerFormValues): Promise<ActionResult> {
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

  if (!await imageExists(parsed.data.logoId)) {
    return { success: false, message: 'Selected image was not found', fieldErrors: { logoId: ['Select an existing image'] } };
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
