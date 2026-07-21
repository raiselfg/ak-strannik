'use server';
import { Prisma, prisma } from '@ak-strannik/database';
import {
  createMasterclassesContentDtoSchema,
  type CreateMasterclassesContentDto,
  updateMasterclassesContentDtoSchema,
  type UpdateMasterclassesContentDto,
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
const listPath = '/projects/masterclasses';
function handleDatabaseError(error: unknown): ActionFailure {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002')
      return { success: false, message: 'Такая запись уже существует' };
    if (error.code === 'P2025')
      return { success: false, message: 'Мастер-класс не найден' };
  }
  console.error('[MasterclassesContent] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить изменения. Попробуйте ещё раз',
  };
}
export async function createMasterclassesContent(
  input: CreateMasterclassesContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsed = createMasterclassesContentDtoSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: fieldErrors(parsed.error),
    };
  const localeFailure = validateRequiredLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;
  try {
    await prisma.masterclassesContent.create({
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
    return { success: true, message: 'Мастер-класс создан' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
export async function updateMasterclassesContent(
  id: string,
  input: UpdateMasterclassesContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  const parsed = updateMasterclassesContentDtoSchema.safeParse(input);
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
      await transaction.masterclassesContent.update({
        where: { id: parsedId.data },
        data: { images: parsed.data.images, videos: parsed.data.videos },
      });
      for (const translation of translations) {
        const { locale, text, title } = translation;
        if (!locale || !title)
          throw new Error('Validated masterclasses translation is incomplete');
        await transaction.masterclassesContentTranslation.upsert({
          where: {
            masterclassesContentId_locale: {
              masterclassesContentId: parsedId.data,
              locale,
            },
          },
          create: {
            masterclassesContentId: parsedId.data,
            locale,
            text,
            title,
          },
          update: { text, title },
        });
      }
    });
    revalidatePath(listPath);
    revalidatePath(`${listPath}/${parsedId.data}/edit`);
    return { success: true, message: 'Мастер-класс обновлён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
export async function deleteMasterclassesContent(
  id: string
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success)
    return {
      success: false,
      message: 'Некорректный идентификатор мастер-класса',
    };
  try {
    await prisma.masterclassesContent.delete({ where: { id: parsedId.data } });
    revalidatePath(listPath);
    return { success: true, message: 'Мастер-класс удалён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
