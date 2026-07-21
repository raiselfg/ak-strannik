'use server';

import { Prisma, prisma } from '@ak-strannik/database';
import {
  createThankYouNoteContentDtoSchema,
  type CreateThankYouNoteContentDto,
  updateThankYouNoteContentDtoSchema,
  type UpdateThankYouNoteContentDto,
} from '@ak-strannik/types';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionFailure,
  type ActionResult,
} from '../../../../../lib/action-utils';

const thankYouNotesPath = '/about/thank-you-notes';

function handleDatabaseError(error: unknown): ActionFailure {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return { success: false, message: 'Такая запись уже существует' };
    }
    if (error.code === 'P2025') {
      return { success: false, message: 'Благодарственное письмо не найдено' };
    }
  }
  console.error('[ThankYouNoteContent] mutation failed', error);
  return {
    success: false,
    message: 'Не удалось сохранить изменения. Попробуйте ещё раз',
  };
}

export async function createThankYouNoteContent(
  input: CreateThankYouNoteContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsed = createThankYouNoteContentDtoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  try {
    await prisma.thankYouNoteContent.create({ data: parsed.data });
    revalidatePath(thankYouNotesPath);
    return { success: true, message: 'Благодарственное письмо добавлено' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function updateThankYouNoteContent(
  id: string,
  input: UpdateThankYouNoteContentDto
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  const parsed = updateThankYouNoteContentDtoSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) {
    return {
      success: false,
      message: 'Проверьте заполнение формы',
      fieldErrors: parsed.success ? undefined : fieldErrors(parsed.error),
    };
  }
  try {
    await prisma.thankYouNoteContent.update({
      where: { id: parsedId.data },
      data: { image: parsed.data.image },
    });
    revalidatePath(thankYouNotesPath);
    revalidatePath(`${thankYouNotesPath}/${parsedId.data}/edit`);
    return { success: true, message: 'Благодарственное письмо обновлено' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function deleteThankYouNoteContent(
  id: string
): Promise<ActionResult> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return { success: false, message: 'Некорректный идентификатор записи' };
  }
  try {
    await prisma.thankYouNoteContent.delete({ where: { id: parsedId.data } });
    revalidatePath(thankYouNotesPath);
    return { success: true, message: 'Благодарственное письмо удалено' };
  } catch (error) {
    return handleDatabaseError(error);
  }
}
