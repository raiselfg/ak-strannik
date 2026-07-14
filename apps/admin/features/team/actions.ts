'use server';

import { prisma } from '@ak-strannik/database';
import { revalidatePath } from 'next/cache';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionResult,
} from '../../lib/action-utils';
import { TeamMemberFormSchema, type TeamMemberFormValues } from './schema';

function hasEnglishTranslation(values: TeamMemberFormValues) {
  const translation = values.translations.en;
  return Boolean(
    translation.name.trim() ||
    translation.role?.trim() ||
    translation.description?.trim()
  );
}

async function imageExists(imageId: string | null) {
  if (imageId === null) return true;
  const image = await prisma.mediaAsset.findFirst({
    where: { id: imageId, mimeType: { startsWith: 'image/' } },
    select: { id: true },
  });
  return Boolean(image);
}

export async function createTeamMemberAction(
  input: TeamMemberFormValues
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  const parsed = TeamMemberFormSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: 'Проверьте заполненные поля',
      fieldErrors: fieldErrors(parsed.error),
    };

  if (!(await imageExists(parsed.data.imageId))) {
    return {
      success: false,
      message: 'Selected image was not found',
      fieldErrors: { imageId: ['Select an existing image'] },
    };
  }

  try {
    const values = parsed.data;
    await prisma.$transaction(async (tx) => {
      const member = await tx.teamMember.create({
        data: {
          imageId: values.imageId,
          sortOrder: values.sortOrder,
          isActive: values.isActive,
        },
      });
      await tx.teamMemberTranslation.create({
        data: {
          teamMemberId: member.id,
          locale: 'ru',
          ...values.translations.ru,
        },
      });
      if (hasEnglishTranslation(values)) {
        await tx.teamMemberTranslation.create({
          data: {
            teamMemberId: member.id,
            locale: 'en',
            ...values.translations.en,
          },
        });
      }
    });
    revalidatePath('/team');
    return { success: true, message: 'Участник команды добавлен' };
  } catch (error) {
    console.error('Failed to create team member:', error);
    return { success: false, message: 'Не удалось добавить участника' };
  }
}

export async function updateTeamMemberAction(
  id: string,
  input: TeamMemberFormValues
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success)
    return { success: false, message: 'Некорректный идентификатор участника' };
  const parsed = TeamMemberFormSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: 'Проверьте заполненные поля',
      fieldErrors: fieldErrors(parsed.error),
    };

  if (!(await imageExists(parsed.data.imageId))) {
    return {
      success: false,
      message: 'Selected image was not found',
      fieldErrors: { imageId: ['Select an existing image'] },
    };
  }

  try {
    const values = parsed.data;
    const exists = await prisma.teamMember.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return { success: false, message: 'Участник не найден' };
    await prisma.$transaction(async (tx) => {
      await tx.teamMember.update({
        where: { id },
        data: {
          imageId: values.imageId,
          sortOrder: values.sortOrder,
          isActive: values.isActive,
        },
      });
      await tx.teamMemberTranslation.upsert({
        where: { teamMemberId_locale: { teamMemberId: id, locale: 'ru' } },
        create: { teamMemberId: id, locale: 'ru', ...values.translations.ru },
        update: values.translations.ru,
      });
      if (hasEnglishTranslation(values)) {
        await tx.teamMemberTranslation.upsert({
          where: { teamMemberId_locale: { teamMemberId: id, locale: 'en' } },
          create: { teamMemberId: id, locale: 'en', ...values.translations.en },
          update: values.translations.en,
        });
      } else {
        await tx.teamMemberTranslation.deleteMany({
          where: { teamMemberId: id, locale: 'en' },
        });
      }
    });
    revalidatePath('/team');
    revalidatePath(`/team/${id}`);
    return { success: true, message: 'Изменения сохранены' };
  } catch (error) {
    console.error('Failed to update team member:', error);
    return { success: false, message: 'Не удалось сохранить изменения' };
  }
}

export async function deleteTeamMemberAction(
  id: string
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success)
    return { success: false, message: 'Некорректный идентификатор участника' };
  try {
    const exists = await prisma.teamMember.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return { success: false, message: 'Участник не найден' };
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath('/team');
    return { success: true, message: 'Участник удалён' };
  } catch (error) {
    console.error('Failed to delete team member:', error);
    return { success: false, message: 'Не удалось удалить участника' };
  }
}
