'use server';
import { Prisma, prisma } from '@ak-strannik/database';
import {
  createAttractionContentDtoSchema,
  type CreateAttractionContentDto,
  updateAttractionContentDtoSchema,
  type UpdateAttractionContentDto,
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
const listPath = '/rental/attraction';
function handleDatabaseError(error: unknown): ActionFailure {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002')
      return { success: false, message: 'Такая запись уже существует' };
    if (error.code === 'P2025')
      return { success: false, message: 'Аттракцион не найден' };
  }
  console.error('[AttractionContent] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить изменения. Попробуйте ещё раз',
  };
}
export async function createAttractionContent(
  input: CreateAttractionContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsed = createAttractionContentDtoSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: fieldErrors(parsed.error),
    };
  const localeFailure = validateRequiredLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;
  try {
    await prisma.attractionContent.create({
      data: {
        image: parsed.data.image,
        translations: {
          create: parsed.data.translations.map(({ locale, text }) => ({
            locale,
            text,
          })),
        },
      },
    });
    revalidatePath(listPath);
    return { success: true, message: 'Аттракцион создан' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
export async function updateAttractionContent(
  id: string,
  input: UpdateAttractionContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  const parsed = updateAttractionContentDtoSchema.safeParse(input);
  if (!parsedId.success || !parsed.success)
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: parsed.success ? undefined : fieldErrors(parsed.error),
    };
  const localeFailure = validateRequiredLocales(parsed.data.translations);
  if (localeFailure) return localeFailure;
  const translations = parsed.data.translations;
  if (!translations || translations.some((item) => !item.locale || !item.text))
    return { success: false, message: 'Заполните тексты на двух языках' };
  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.attractionContent.update({
        where: { id: parsedId.data },
        data: { image: parsed.data.image },
      });
      for (const translation of translations) {
        const { locale, text } = translation;
        if (!locale || !text)
          throw new Error('Validated attraction translation is incomplete');
        await transaction.attractionContentTranslation.upsert({
          where: {
            attractionContentId_locale: {
              attractionContentId: parsedId.data,
              locale,
            },
          },
          create: { attractionContentId: parsedId.data, locale, text },
          update: { text },
        });
      }
    });
    revalidatePath(listPath);
    revalidatePath(`${listPath}/${parsedId.data}/edit`);
    return { success: true, message: 'Аттракцион обновлён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
export async function deleteAttractionContent(
  id: string
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success)
    return {
      success: false,
      message: 'Некорректный идентификатор аттракциона',
    };
  try {
    await prisma.attractionContent.delete({ where: { id: parsedId.data } });
    revalidatePath(listPath);
    return { success: true, message: 'Аттракцион удалён' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
