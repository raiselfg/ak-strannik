'use server';
import { Prisma, prisma } from '@ak-strannik/database';
import {
  createConcertContentDtoSchema,
  type CreateConcertContentDto,
  updateConcertContentDtoSchema,
  type UpdateConcertContentDto,
} from '@ak-strannik/types/concert';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionFailure,
  type ActionResult,
} from '../../../../../lib/action-utils';
import { validateRequiredLocales } from '../../../../../lib/validate-required-locales';
const listPath = '/projects/concerts';
function handleDatabaseError(error: unknown): ActionFailure {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002')
      return { success: false, message: 'Такая запись уже существует' };
    if (error.code === 'P2025')
      return { success: false, message: 'Концерт не найден' };
  }
  console.error('[ConcertContent] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить изменения. Попробуйте ещё раз',
  };
}
export async function createConcertContent(
  input: CreateConcertContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsed = createConcertContentDtoSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: fieldErrors(parsed.error),
    };
  const localeFailure = validateRequiredLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;
  try {
    await prisma.concertContent.create({
      data: {
        images: parsed.data.images,
        videos: parsed.data.videos,
        translations: {
          create: parsed.data.translations.map(
            ({ duration, locale, text, title }) => ({
              duration,
              locale,
              text,
              title,
            })
          ),
        },
      },
    });
    revalidatePath(listPath);
    return { success: true, message: 'Концерт создан' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
export async function updateConcertContent(
  id: string,
  input: UpdateConcertContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  const parsed = updateConcertContentDtoSchema.safeParse(input);
  if (!parsedId.success || !parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: parsed.success ? undefined : fieldErrors(parsed.error),
    };
  const localeFailure = validateRequiredLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;
  const translations = parsed.data.translations;
  if (!translations)
    return { success: false, message: 'Обязательны переводы ru и en' };
  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.concertContent.update({
        where: { id: parsedId.data },
        data: { images: parsed.data.images, videos: parsed.data.videos },
      });
      for (const translation of translations) {
        const { duration, locale, text, title } = translation;
        if (!locale)
          throw new Error('Validated concert translation has no locale');
        await transaction.concertContentTranslation.upsert({
          where: {
            concertContentId_locale: {
              concertContentId: parsedId.data,
              locale,
            },
          },
          create: {
            concertContentId: parsedId.data,
            duration,
            locale,
            text,
            title,
          },
          update: { duration, text, title },
        });
      }
    });
    revalidatePath(listPath);
    revalidatePath(`${listPath}/${parsedId.data}/edit`);
    return { success: true, message: 'Концерт обновлён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
export async function deleteConcertContent(id: string): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success)
    return { success: false, message: 'Некорректный идентификатор концерта' };
  try {
    await prisma.concertContent.delete({ where: { id: parsedId.data } });
    revalidatePath(listPath);
    return { success: true, message: 'Концерт удалён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
