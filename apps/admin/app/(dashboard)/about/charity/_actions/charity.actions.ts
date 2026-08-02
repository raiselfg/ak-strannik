'use server';

import { Prisma, prisma } from '@ak-strannik/database';
import {
  createCharityContentDtoSchema,
  type CreateCharityContentDto,
  updateCharityContentDtoSchema,
  type UpdateCharityContentDto,
} from '@ak-strannik/types/charity';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionFailure,
  type ActionResult,
} from '../../../../../lib/action-utils';
import { validateRequiredLocales } from '../../../../../lib/validate-required-locales';

const charityPath = '/about/charity';

function handleDatabaseError(error: unknown): ActionFailure {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return { success: false, message: 'Такая запись уже существует' };
    }
    if (error.code === 'P2025') {
      return { success: false, message: 'Благотворительный проект не найден' };
    }
  }

  console.error('[CharityContent] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить изменения. Попробуйте ещё раз',
  };
}

export async function createCharityContent(
  input: CreateCharityContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsed = createCharityContentDtoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const localeFailure = validateRequiredLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;

  try {
    await prisma.charityContent.create({
      data: {
        images: parsed.data.images,
        videos: parsed.data.videos,
        translations: {
          create: parsed.data.translations.map((translation) => ({
            locale: translation.locale,
            title: translation.title,
            text: translation.text,
          })),
        },
      },
    });
    revalidatePath(charityPath);
    return { success: true, message: 'Благотворительный проект создан' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function updateCharityContent(
  id: string,
  input: UpdateCharityContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsedId = idSchema.safeParse(id);
  const parsed = updateCharityContentDtoSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: parsed.success ? undefined : fieldErrors(parsed.error),
    };
  }
  const localeFailure = validateRequiredLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;

  const translations = parsed.data.translations;
  if (
    !translations ||
    translations.some(
      (translation) => !translation.locale || !translation.title
    )
  ) {
    return {
      success: false,
      message: 'Заполните названия на русском и английском языках',
      fieldErrors: {
        translations: ['Для каждого перевода обязательно название'],
      },
    };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.charityContent.update({
        where: { id: parsedId.data },
        data: {
          images: parsed.data.images,
          videos: parsed.data.videos,
        },
      });

      for (const translation of translations) {
        const { locale, text, title } = translation;
        if (!locale || !title) {
          throw new Error('Validated charity translation is incomplete');
        }
        await transaction.charityContentTranslation.upsert({
          where: {
            charityContentId_locale: {
              charityContentId: parsedId.data,
              locale,
            },
          },
          create: {
            charityContentId: parsedId.data,
            locale,
            title,
            text,
          },
          update: { title, text },
        });
      }
    });
    revalidatePath(charityPath);
    revalidatePath(`${charityPath}/${parsedId.data}/edit`);
    return { success: true, message: 'Благотворительный проект обновлён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function deleteCharityContent(id: string): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return { success: false, message: 'Некорректный идентификатор записи' };
  }

  try {
    await prisma.charityContent.delete({ where: { id: parsedId.data } });
    revalidatePath(charityPath);
    return { success: true, message: 'Благотворительный проект удалён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
