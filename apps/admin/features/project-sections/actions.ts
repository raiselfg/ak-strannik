'use server';

import { prisma } from '@ak-strannik/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdminSession } from '../../lib/require-admin-session';
import type { ActionResult } from '../team/actions';
import {
  ProjectSectionFormSchema,
  type ProjectSectionFormValues,
} from './schema';

type ActionFailure = Extract<ActionResult, { success: false }>;
type CreateSectionResult =
  | ActionFailure
  | { success: true; data: { id: string }; message?: string };
const idSchema = z.uuid();

function fieldErrors(error: z.ZodError): Record<string, string[]> {
  return error.issues.reduce<Record<string, string[]>>((result, issue) => {
    const key = issue.path.join('.');
    if (key) result[key] = [...(result[key] ?? []), issue.message];
    return result;
  }, {});
}

function hasTranslation(
  value: ProjectSectionFormValues['translations']['ru']
) {
  return Boolean(
    value.title?.trim() || value.subtitle?.trim()
    || value.body?.trim() || value.author?.trim()
  );
}

async function authenticate(): Promise<ActionFailure | null> {
  try {
    await requireAdminSession();
    return null;
  } catch {
    return { success: false, message: 'Необходимо войти в административную панель' };
  }
}

async function validateMedia(
  values: ProjectSectionFormValues
): Promise<ActionFailure | null> {
  const ids = values.media.map((item) => item.mediaId);
  if (!ids.length) return null;
  const assets = await prisma.mediaAsset.findMany({
    where: { id: { in: ids } },
    select: { id: true, mimeType: true },
  });
  if (assets.length !== ids.length) {
    return {
      success: false,
      message: 'Один из выбранных медиафайлов не найден',
      fieldErrors: { media: ['Один из выбранных медиафайлов не найден'] },
    };
  }
  if (assets.some((asset) => !asset.mimeType.startsWith('image/'))) {
    return {
      success: false,
      message: 'Для секции можно выбрать только изображения',
      fieldErrors: { media: ['Для секции можно выбрать только изображения'] },
    };
  }
  return null;
}

function youtubeFor(values: ProjectSectionFormValues) {
  return values.variant === 'youtube' ? values.youtubeUrl : null;
}

export async function createProjectSectionAction(
  projectId: string,
  input: ProjectSectionFormValues
): Promise<CreateSectionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(projectId).success) {
    return { success: false, message: 'Проект не найден' };
  }
  if (!await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } })) {
    return { success: false, message: 'Проект не найден' };
  }
  const parsed = ProjectSectionFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: 'Проверьте заполненные поля', fieldErrors: fieldErrors(parsed.error) };
  }
  const values = parsed.data;
  const mediaError = await validateMedia(values);
  if (mediaError) return mediaError;

  try {
    const id = await prisma.$transaction(async (tx) => {
      const section = await tx.projectSection.create({
        data: {
          projectId,
          variant: values.variant,
          youtubeUrl: youtubeFor(values),
          sortOrder: values.sortOrder,
          isActive: values.isActive,
        },
      });
      for (const locale of ['ru', 'en'] as const) {
        const translation = values.translations[locale];
        if (hasTranslation(translation)) {
          await tx.projectSectionTranslation.create({
            data: { sectionId: section.id, locale, ...translation },
          });
        }
      }
      if (values.media.length) {
        await tx.projectSectionMedia.createMany({
          data: values.media.map((item) => ({ sectionId: section.id, ...item })),
        });
      }
      return section.id;
    });
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: { id }, message: 'Секция добавлена' };
  } catch (error) {
    console.error('Failed to create project section:', error);
    return { success: false, message: 'Не удалось создать секцию' };
  }
}

export async function updateProjectSectionAction(
  projectId: string,
  sectionId: string,
  input: ProjectSectionFormValues
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(projectId).success || !idSchema.safeParse(sectionId).success) {
    return { success: false, message: 'Секция не найдена' };
  }
  if (!await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } })) {
    return { success: false, message: 'Проект не найден' };
  }
  const section = await prisma.projectSection.findUnique({
    where: { id: sectionId }, select: { id: true, projectId: true },
  });
  if (!section) return { success: false, message: 'Секция не найдена' };
  if (section.projectId !== projectId) {
    return { success: false, message: 'Секция не принадлежит указанному проекту' };
  }
  const parsed = ProjectSectionFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: 'Проверьте заполненные поля', fieldErrors: fieldErrors(parsed.error) };
  }
  const values = parsed.data;
  const mediaError = await validateMedia(values);
  if (mediaError) return mediaError;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.projectSection.update({
        where: { id: sectionId },
        data: {
          variant: values.variant,
          youtubeUrl: youtubeFor(values),
          sortOrder: values.sortOrder,
          isActive: values.isActive,
        },
      });
      for (const locale of ['ru', 'en'] as const) {
        const translation = values.translations[locale];
        if (hasTranslation(translation)) {
          await tx.projectSectionTranslation.upsert({
            where: { sectionId_locale: { sectionId, locale } },
            create: { sectionId, locale, ...translation },
            update: translation,
          });
        } else {
          await tx.projectSectionTranslation.deleteMany({ where: { sectionId, locale } });
        }
      }
      await tx.projectSectionMedia.deleteMany({ where: { sectionId } });
      if (values.media.length) {
        await tx.projectSectionMedia.createMany({
          data: values.media.map((item) => ({ sectionId, ...item })),
        });
      }
    });
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/sections/${sectionId}`);
    return { success: true, message: 'Изменения сохранены' };
  } catch (error) {
    console.error('Failed to update project section:', error);
    return { success: false, message: 'Не удалось сохранить секцию' };
  }
}

export async function deleteProjectSectionAction(
  projectId: string,
  sectionId: string
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(projectId).success || !idSchema.safeParse(sectionId).success) {
    return { success: false, message: 'Секция не найдена' };
  }
  try {
    if (!await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })) {
      return { success: false, message: 'Проект не найден' };
    }
    const section = await prisma.projectSection.findUnique({
      where: { id: sectionId }, select: { id: true, projectId: true },
    });
    if (!section) return { success: false, message: 'Секция не найдена' };
    if (section.projectId !== projectId) {
      return { success: false, message: 'Секция не принадлежит указанному проекту' };
    }
    await prisma.projectSection.delete({ where: { id: sectionId } });
    revalidatePath(`/projects/${projectId}`);
    return { success: true, message: 'Секция удалена' };
  } catch (error) {
    console.error('Failed to delete project section:', error);
    return { success: false, message: 'Не удалось удалить секцию' };
  }
}
