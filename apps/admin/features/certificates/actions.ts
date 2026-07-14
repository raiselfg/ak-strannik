'use server';

import { prisma } from '@ak-strannik/database';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionResult,
} from '../../lib/action-utils';
import { CertificateFormSchema, type CertificateFormValues } from './schema';

function hasEnglishTranslation(values: CertificateFormValues) {
  const translation = values.translations.en;
  return Boolean(
    translation.title?.trim() ||
    translation.issuer?.trim() ||
    translation.description?.trim()
  );
}

async function imageExists(imageId: string) {
  return prisma.mediaAsset.findFirst({
    where: { id: imageId, mimeType: { startsWith: 'image/' } },
    select: { id: true },
  });
}

export async function createCertificateAction(
  input: CertificateFormValues
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  const parsed = CertificateFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполненные поля',
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  if (!(await imageExists(parsed.data.imageId))) {
    return {
      success: false,
      message: 'Выбранное изображение не найдено',
      fieldErrors: { imageId: ['Выберите изображение сертификата'] },
    };
  }

  try {
    const values = parsed.data;
    await prisma.$transaction(async (tx) => {
      const certificate = await tx.certificate.create({
        data: {
          imageId: values.imageId,
          year: values.year,
          sortOrder: values.sortOrder,
          isActive: values.isActive,
        },
      });
      await tx.certificateTranslation.create({
        data: {
          certificateId: certificate.id,
          locale: 'ru',
          ...values.translations.ru,
        },
      });
      if (hasEnglishTranslation(values)) {
        await tx.certificateTranslation.create({
          data: {
            certificateId: certificate.id,
            locale: 'en',
            ...values.translations.en,
          },
        });
      }
    });
    revalidatePath('/certificates');
    return { success: true, message: 'Сертификат добавлен' };
  } catch (error) {
    console.error('Failed to create certificate:', error);
    return { success: false, message: 'Не удалось добавить сертификат' };
  }
}

export async function updateCertificateAction(
  id: string,
  input: CertificateFormValues
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success) {
    return {
      success: false,
      message: 'Некорректный идентификатор сертификата',
    };
  }
  const parsed = CertificateFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполненные поля',
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  if (!(await imageExists(parsed.data.imageId))) {
    return {
      success: false,
      message: 'Выбранное изображение не найдено',
      fieldErrors: { imageId: ['Выберите изображение сертификата'] },
    };
  }

  try {
    const values = parsed.data;
    const exists = await prisma.certificate.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return { success: false, message: 'Сертификат не найден' };
    await prisma.$transaction(async (tx) => {
      await tx.certificate.update({
        where: { id },
        data: {
          imageId: values.imageId,
          year: values.year,
          sortOrder: values.sortOrder,
          isActive: values.isActive,
        },
      });
      await tx.certificateTranslation.upsert({
        where: { certificateId_locale: { certificateId: id, locale: 'ru' } },
        create: {
          certificateId: id,
          locale: 'ru',
          ...values.translations.ru,
        },
        update: values.translations.ru,
      });
      if (hasEnglishTranslation(values)) {
        await tx.certificateTranslation.upsert({
          where: { certificateId_locale: { certificateId: id, locale: 'en' } },
          create: {
            certificateId: id,
            locale: 'en',
            ...values.translations.en,
          },
          update: values.translations.en,
        });
      } else {
        await tx.certificateTranslation.deleteMany({
          where: { certificateId: id, locale: 'en' },
        });
      }
    });
    revalidatePath('/certificates');
    revalidatePath(`/certificates/${id}`);
    return { success: true, message: 'Изменения сохранены' };
  } catch (error) {
    console.error('Failed to update certificate:', error);
    return { success: false, message: 'Не удалось сохранить изменения' };
  }
}

export async function deleteCertificateAction(
  id: string
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success) {
    return {
      success: false,
      message: 'Некорректный идентификатор сертификата',
    };
  }
  try {
    const exists = await prisma.certificate.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return { success: false, message: 'Сертификат не найден' };
    await prisma.certificate.delete({ where: { id } });
    revalidatePath('/certificates');
    return { success: true, message: 'Сертификат удалён' };
  } catch (error) {
    console.error('Failed to delete certificate:', error);
    return { success: false, message: 'Не удалось удалить сертификат' };
  }
}
