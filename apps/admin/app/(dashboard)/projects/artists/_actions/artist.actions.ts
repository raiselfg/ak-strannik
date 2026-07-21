'use server';

import { Prisma, prisma } from '@ak-strannik/database';
import {
  createArtistContentDtoSchema,
  type CreateArtistContentDto,
  updateArtistContentDtoSchema,
  type UpdateArtistContentDto,
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

const listPath = '/projects/artists';

function handleDatabaseError(error: unknown): ActionFailure {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002')
      return { success: false, message: 'Такая запись уже существует' };
    if (error.code === 'P2025')
      return { success: false, message: 'Артист не найден' };
  }
  console.error('[ArtistContent] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить изменения. Попробуйте ещё раз',
  };
}

export async function createArtistContent(
  input: CreateArtistContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsed = createArtistContentDtoSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: fieldErrors(parsed.error),
    };
  const localeFailure = validateRequiredLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;
  try {
    await prisma.artistContent.create({
      data: {
        images: parsed.data.images,
        videos: parsed.data.videos,
        translations: {
          create: parsed.data.translations.map(({ locale, text, title }) => ({
            locale,
            text,
            title,
          })),
        },
      },
    });
    revalidatePath(listPath);
    return { success: true, message: 'Артист создан' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function updateArtistContent(
  id: string,
  input: UpdateArtistContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  const parsed = updateArtistContentDtoSchema.safeParse(input);
  if (!parsedId.success || !parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: parsed.success ? undefined : fieldErrors(parsed.error),
    };
  const localeFailure = validateRequiredLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;
  const translations = parsed.data.translations;
  if (!translations) {
    return { success: false, message: 'Обязательны переводы ru и en' };
  }
  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.artistContent.update({
        where: { id: parsedId.data },
        data: { images: parsed.data.images, videos: parsed.data.videos },
      });
      for (const translation of translations) {
        const { locale, text, title } = translation;
        if (!locale)
          throw new Error('Validated artist translation has no locale');
        await transaction.artistContentTranslation.upsert({
          where: {
            artistContentId_locale: { artistContentId: parsedId.data, locale },
          },
          create: { artistContentId: parsedId.data, locale, text, title },
          update: { text, title },
        });
      }
    });
    revalidatePath(listPath);
    revalidatePath(`${listPath}/${parsedId.data}/edit`);
    return { success: true, message: 'Артист обновлён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function deleteArtistContent(id: string): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success)
    return { success: false, message: 'Некорректный идентификатор артиста' };
  try {
    await prisma.artistContent.delete({ where: { id: parsedId.data } });
    revalidatePath(listPath);
    return { success: true, message: 'Артист удалён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
