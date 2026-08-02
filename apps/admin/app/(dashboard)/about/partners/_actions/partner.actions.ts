'use server';

import { Prisma, prisma } from '@ak-strannik/database';
import {
  createPartnerContentDtoSchema,
  type CreatePartnerContentDto,
  updatePartnerContentDtoSchema,
  type UpdatePartnerContentDto,
} from '@ak-strannik/types/partner';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionFailure,
  type ActionResult,
} from '../../../../../lib/action-utils';
import { validateRequiredLocales } from '../../../../../lib/validate-required-locales';

const partnersPath = '/about/partners';

function handleDatabaseError(error: unknown): ActionFailure {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return {
        success: false,
        message: 'Партнёр с такими данными уже существует',
      };
    }

    if (error.code === 'P2025') {
      return { success: false, message: 'Партнёр не найден' };
    }
  }

  console.error('[PartnerContent] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить изменения. Попробуйте ещё раз',
  };
}

export async function createPartnerContent(
  input: CreatePartnerContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsed = createPartnerContentDtoSchema.safeParse(input);
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
    await prisma.partnerContent.create({
      data: {
        link: parsed.data.link,
        images: parsed.data.images,
        translations: {
          create: parsed.data.translations.map((translation) => ({
            locale: translation.locale,
            title: translation.title,
            text: translation.text,
          })),
        },
      },
    });
    revalidatePath(partnersPath);
    return { success: true, message: 'Партнёр создан' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function updatePartnerContent(
  id: string,
  input: UpdatePartnerContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsedId = idSchema.safeParse(id);
  const parsed = updatePartnerContentDtoSchema.safeParse(input);
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
      await transaction.partnerContent.update({
        where: { id: parsedId.data },
        data: {
          link: parsed.data.link,
          images: parsed.data.images,
        },
      });

      for (const translation of translations) {
        const { locale, text, title } = translation;
        if (!locale || !title) {
          throw new Error('Validated partner translation is incomplete');
        }

        await transaction.partnerContentTranslation.upsert({
          where: {
            partnerContentId_locale: {
              partnerContentId: parsedId.data,
              locale,
            },
          },
          create: {
            partnerContentId: parsedId.data,
            locale,
            title,
            text,
          },
          update: {
            title,
            text,
          },
        });
      }
    });
    revalidatePath(partnersPath);
    revalidatePath(`${partnersPath}/${parsedId.data}/edit`);
    return { success: true, message: 'Партнёр обновлён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function deletePartnerContent(id: string): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return { success: false, message: 'Некорректный идентификатор партнёра' };
  }

  try {
    await prisma.partnerContent.delete({ where: { id: parsedId.data } });
    revalidatePath(partnersPath);
    return { success: true, message: 'Партнёр удалён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
