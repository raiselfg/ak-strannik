'use server';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import {
  createRequisiteContentDtoSchema,
  type CreateRequisiteContentDto,
  updateRequisiteContentDtoSchema,
  type UpdateRequisiteContentDto,
} from '@ak-strannik/types/requisite';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionFailure,
  type ActionResult,
} from '../../../../../lib/action-utils';
import { validateRequiredLocales } from '../../../../../lib/validate-required-locales';

const listPath = '/rental/requisite';

class ForeignRequisiteItemError extends Error {}
class RequisiteContentNotFoundError extends Error {}

function validateLocales(
  data: CreateRequisiteContentDto | UpdateRequisiteContentDto
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

  for (const [index, requisite] of (data.requisites ?? []).entries()) {
    const failure = validateRequiredLocales(requisite.translations);
    if (failure) {
      return {
        success: false,
        message: `Элемент ${index + 1}: ${failure.message}`,
        fieldErrors: {
          [`requisites.${index}.translations`]: [
            'Обязательны переводы ru и en без дубликатов',
          ],
        },
      };
    }
  }

  return null;
}

function handleDatabaseError(error: unknown): ActionFailure {
  if (error instanceof ForeignRequisiteItemError) {
    return {
      success: false,
      message: 'Один из элементов не принадлежит редактируемой записи',
    };
  }
  if (error instanceof RequisiteContentNotFoundError) {
    return { success: false, message: 'Набор реквизита не найден' };
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return {
        success: false,
        message: 'Нарушена уникальность данных реквизита',
      };
    }
    if (error.code === 'P2025') {
      return { success: false, message: 'Набор реквизита не найден' };
    }
  }

  console.error('[RequisiteContent] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить изменения. Попробуйте ещё раз',
  };
}

export async function createRequisiteContent(
  input: CreateRequisiteContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsed = createRequisiteContentDtoSchema.safeParse(input);
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
      const root = await transaction.requisiteContent.create({
        data: {},
        select: { id: true },
      });
      await transaction.requisiteContentTranslation.createMany({
        data: parsed.data.translations.map((translation) => ({
          requisiteContentId: root.id,
          locale: translation.locale,
          title: translation.title ?? null,
        })),
      });

      for (const [position, requisite] of parsed.data.requisites.entries()) {
        const created = await transaction.requisiteItem.create({
          data: {
            requisiteContentId: root.id,
            position,
            image: requisite.image,
          },
          select: { id: true },
        });
        await transaction.requisiteItemTranslation.createMany({
          data: requisite.translations.map((translation) => ({
            requisiteItemId: created.id,
            locale: translation.locale,
            title: translation.title ?? null,
          })),
        });
      }
    });

    revalidatePath(listPath);
    return { success: true, message: 'Набор реквизита создан' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function updateRequisiteContent(
  id: string,
  input: UpdateRequisiteContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsedId = idSchema.safeParse(id);
  const parsed = updateRequisiteContentDtoSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: parsed.success ? undefined : fieldErrors(parsed.error),
    };
  }
  const localeFailure = validateLocales(parsed.data);
  if (localeFailure) return localeFailure;

  const requisites = parsed.data.requisites ?? [];
  const requisiteIds = requisites.flatMap((item) => (item.id ? [item.id] : []));
  if (new Set(requisiteIds).size !== requisiteIds.length) {
    return { success: false, message: 'Элемент не может повторяться в форме' };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const root = await transaction.requisiteContent.findUnique({
        where: { id: parsedId.data },
        select: { id: true },
      });
      if (!root) throw new RequisiteContentNotFoundError();

      const existing = await transaction.requisiteItem.findMany({
        where: { requisiteContentId: parsedId.data },
        select: { id: true, position: true },
      });
      const existingIds = new Set(existing.map((item) => item.id));
      if (requisiteIds.some((itemId) => !existingIds.has(itemId))) {
        throw new ForeignRequisiteItemError();
      }

      const submittedIds = new Set(requisiteIds);
      await transaction.requisiteItem.deleteMany({
        where: {
          requisiteContentId: parsedId.data,
          id: { notIn: [...submittedIds] },
        },
      });

      const maxPosition = existing.reduce(
        (maximum, item) => Math.max(maximum, item.position),
        -1
      );
      const offset = maxPosition + requisites.length + 1;
      await transaction.requisiteItem.updateMany({
        where: {
          requisiteContentId: parsedId.data,
          id: { in: requisiteIds },
        },
        data: { position: { increment: offset } },
      });

      await transaction.requisiteContentTranslation.deleteMany({
        where: {
          requisiteContentId: parsedId.data,
          locale: { notIn: [Locale.ru, Locale.en] },
        },
      });
      for (const translation of parsed.data.translations ?? []) {
        if (!translation.locale) {
          throw new Error('Validated root translation is incomplete');
        }
        await transaction.requisiteContentTranslation.upsert({
          where: {
            requisiteContentId_locale: {
              requisiteContentId: parsedId.data,
              locale: translation.locale,
            },
          },
          create: {
            requisiteContentId: parsedId.data,
            locale: translation.locale,
            title: translation.title ?? null,
          },
          update: { title: translation.title ?? null },
        });
      }

      for (const [position, requisite] of requisites.entries()) {
        if (!requisite.image) {
          throw new Error('Validated requisite item has no image');
        }
        const translations = requisite.translations;
        if (!translations) {
          throw new Error('Validated requisite item has no translations');
        }

        let requisiteItemId: string;
        if (requisite.id) {
          const updated = await transaction.requisiteItem.updateMany({
            where: {
              id: requisite.id,
              requisiteContentId: parsedId.data,
            },
            data: { image: requisite.image, position },
          });
          if (updated.count !== 1) throw new ForeignRequisiteItemError();
          requisiteItemId = requisite.id;
        } else {
          const created = await transaction.requisiteItem.create({
            data: {
              requisiteContentId: parsedId.data,
              image: requisite.image,
              position,
            },
            select: { id: true },
          });
          requisiteItemId = created.id;
        }

        await transaction.requisiteItemTranslation.deleteMany({
          where: {
            requisiteItemId,
            locale: { notIn: [Locale.ru, Locale.en] },
          },
        });
        for (const translation of translations) {
          if (!translation.locale) {
            throw new Error('Validated item translation is incomplete');
          }
          await transaction.requisiteItemTranslation.upsert({
            where: {
              requisiteItemId_locale: {
                requisiteItemId,
                locale: translation.locale,
              },
            },
            create: {
              requisiteItemId,
              locale: translation.locale,
              title: translation.title ?? null,
            },
            update: { title: translation.title ?? null },
          });
        }
      }
    });

    revalidatePath(listPath);
    revalidatePath(`${listPath}/${parsedId.data}/edit`);
    return { success: true, message: 'Набор реквизита обновлён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function deleteRequisiteContent(
  id: string
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return { success: false, message: 'Некорректный идентификатор набора' };
  }

  try {
    await prisma.requisiteContent.delete({ where: { id: parsedId.data } });
    revalidatePath(listPath);
    return { success: true, message: 'Набор реквизита удалён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
