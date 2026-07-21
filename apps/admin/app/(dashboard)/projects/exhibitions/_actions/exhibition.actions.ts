'use server';
import { Prisma, prisma } from '@ak-strannik/database';
import {
  createExhibitionContentDtoSchema,
  type CreateExhibitionContentDto,
  updateExhibitionContentDtoSchema,
  type UpdateExhibitionContentDto,
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
const listPath = '/projects/exhibitions';
function handleDatabaseError(error: unknown): ActionFailure {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002')
      return { success: false, message: 'Такая запись уже существует' };
    if (error.code === 'P2025')
      return { success: false, message: 'Выставка не найдена' };
  }
  console.error('[ExhibitionContent] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить изменения. Попробуйте ещё раз',
  };
}
export async function createExhibitionContent(
  input: CreateExhibitionContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsed = createExhibitionContentDtoSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: fieldErrors(parsed.error),
    };
  const localeFailure = validateRequiredLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;
  try {
    await prisma.exhibitionContent.create({
      data: {
        images: parsed.data.images,
        translations: {
          create: parsed.data.translations.map(({ locale, title }) => ({
            locale,
            title,
          })),
        },
      },
    });
    revalidatePath(listPath);
    return { success: true, message: 'Выставка создана' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
export async function updateExhibitionContent(
  id: string,
  input: UpdateExhibitionContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  const parsed = updateExhibitionContentDtoSchema.safeParse(input);
  if (!parsedId.success || !parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: parsed.success ? undefined : fieldErrors(parsed.error),
    };
  const localeFailure = validateRequiredLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;
  const translations = parsed.data.translations;
  if (!translations || translations.some((item) => !item.locale || !item.title))
    return { success: false, message: 'Заполните названия на двух языках' };
  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.exhibitionContent.update({
        where: { id: parsedId.data },
        data: { images: parsed.data.images },
      });
      for (const translation of translations) {
        const { locale, title } = translation;
        if (!locale || !title)
          throw new Error('Validated exhibition translation is incomplete');
        await transaction.exhibitionContentTranslation.upsert({
          where: {
            exhibitionContentId_locale: {
              exhibitionContentId: parsedId.data,
              locale,
            },
          },
          create: { exhibitionContentId: parsedId.data, locale, title },
          update: { title },
        });
      }
    });
    revalidatePath(listPath);
    revalidatePath(`${listPath}/${parsedId.data}/edit`);
    return { success: true, message: 'Выставка обновлена' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
export async function deleteExhibitionContent(
  id: string
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success)
    return { success: false, message: 'Некорректный идентификатор выставки' };
  try {
    await prisma.exhibitionContent.delete({ where: { id: parsedId.data } });
    revalidatePath(listPath);
    return { success: true, message: 'Выставка удалена' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
