'use server';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import {
  createUstaContentDtoSchema,
  type CreateUstaContentDto,
  updateUstaContentDtoSchema,
  type UpdateUstaContentDto,
} from '@ak-strannik/types/usta';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionFailure,
  type ActionResult,
} from '../../../../../lib/action-utils';
import { validateRequiredLocales } from '../../../../../lib/validate-required-locales';

const pagePath = '/projects/usta';

class SingletonConflictError extends Error {}
class SingletonAlreadyExistsError extends Error {}
class UstaNotFoundError extends Error {}
class UstaIdMismatchError extends Error {}
class IncompleteTranslationError extends Error {}

function validateLocales(
  translations:
    | CreateUstaContentDto['translations']
    | UpdateUstaContentDto['translations']
): ActionFailure | null {
  const failure = validateRequiredLocales(translations);
  if (!failure) return null;
  return {
    success: false,
    message: failure.message,
    fieldErrors: {
      translations: ['Обязательны переводы ru и en без дубликатов'],
    },
  };
}

function handleError(error: unknown): ActionFailure {
  if (error instanceof SingletonAlreadyExistsError) {
    return {
      success: false,
      message:
        'Запись UstaContent уже существует. Создание второй singleton-записи запрещено',
    };
  }
  if (error instanceof SingletonConflictError) {
    return {
      success: false,
      message:
        'Обнаружено несколько записей UstaContent. Исправьте данные вручную в базе',
    };
  }
  if (error instanceof UstaNotFoundError) {
    return { success: false, message: 'Запись UstaContent не найдена' };
  }
  if (error instanceof UstaIdMismatchError) {
    return {
      success: false,
      message: 'Переданная запись не соответствует singleton UstaContent',
    };
  }
  if (error instanceof IncompleteTranslationError) {
    return { success: false, message: 'Проверьте заполнение переводов' };
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return { success: false, message: 'Запись UstaContent не найдена' };
    }
    if (error.code === 'P2002') {
      return { success: false, message: 'Нарушена уникальность переводов' };
    }
  }
  console.error('[UstaContent] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить раздел «Уста». Попробуйте ещё раз',
  };
}

export async function createUstaContent(
  input: CreateUstaContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsed = createUstaContentDtoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const localeFailure = validateLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;

  try {
    await prisma.$transaction(async (transaction) => {
      const existing = await transaction.ustaContent.findMany({
        take: 1,
        select: { id: true },
      });
      if (existing.length > 0) throw new SingletonAlreadyExistsError();

      const root = await transaction.ustaContent.create({
        data: {
          videos: parsed.data.videos,
          images: parsed.data.images,
          achievements: parsed.data.achievements,
        },
        select: { id: true },
      });
      await transaction.ustaContentTranslation.createMany({
        data: parsed.data.translations.map((translation) => ({
          ustaContentId: root.id,
          locale: translation.locale,
          text: translation.text,
        })),
      });
    });

    revalidatePath(pagePath);
    return { success: true, message: 'Раздел «Уста» создан' };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateUstaContent(
  id: string,
  input: UpdateUstaContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsedId = idSchema.safeParse(id);
  const parsed = updateUstaContentDtoSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: parsed.success ? undefined : fieldErrors(parsed.error),
    };
  }
  const localeFailure = validateLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;

  try {
    await prisma.$transaction(async (transaction) => {
      const records = await transaction.ustaContent.findMany({
        take: 2,
        select: { id: true },
      });
      if (records.length === 0) throw new UstaNotFoundError();
      if (records.length > 1) throw new SingletonConflictError();
      if (records[0]?.id !== parsedId.data) throw new UstaIdMismatchError();

      await transaction.ustaContent.update({
        where: { id: parsedId.data },
        data: {
          videos: parsed.data.videos,
          images: parsed.data.images,
          achievements: parsed.data.achievements,
        },
      });
      await transaction.ustaContentTranslation.deleteMany({
        where: {
          ustaContentId: parsedId.data,
          locale: { notIn: [Locale.ru, Locale.en] },
        },
      });
      for (const translation of parsed.data.translations ?? []) {
        if (!translation.locale || !translation.text) {
          throw new IncompleteTranslationError();
        }
        await transaction.ustaContentTranslation.upsert({
          where: {
            ustaContentId_locale: {
              ustaContentId: parsedId.data,
              locale: translation.locale,
            },
          },
          create: {
            ustaContentId: parsedId.data,
            locale: translation.locale,
            text: translation.text,
          },
          update: { text: translation.text },
        });
      }
    });

    revalidatePath(pagePath);
    return { success: true, message: 'Раздел «Уста» обновлён' };
  } catch (error) {
    return handleError(error);
  }
}
