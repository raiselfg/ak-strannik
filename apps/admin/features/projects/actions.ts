'use server';

import { prisma } from '@ak-strannik/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdminSession } from '../../lib/require-admin-session';
import type { ActionResult } from '../team/actions';
import { ProjectFormSchema, type ProjectFormValues } from './schema';

type ActionFailure = Extract<ActionResult, { success: false }>;
type CreateProjectResult =
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

function hasEnglishTranslation(values: ProjectFormValues) {
  const translation = values.translations.en;
  return Boolean(
    translation.title.trim() || translation.subtitle?.trim()
    || translation.excerpt?.trim() || translation.seoTitle?.trim()
    || translation.seoDescription?.trim()
  );
}

function isUniqueConstraintError(error: unknown) {
  return typeof error === 'object' && error !== null
    && 'code' in error && error.code === 'P2002';
}

async function authenticate(): Promise<ActionFailure | null> {
  try {
    await requireAdminSession();
    return null;
  } catch {
    return { success: false, message: 'Необходимо войти в административную панель' };
  }
}

function slugConflictResult(): ActionFailure {
  return {
    success: false,
    message: 'Проект с таким slug уже существует',
    fieldErrors: { slug: ['Проект с таким slug уже существует'] },
  };
}

async function validateCover(coverImageId: string | null): Promise<ActionFailure | null> {
  if (!coverImageId) return null;
  const cover = await prisma.mediaAsset.findFirst({
    where: { id: coverImageId, mimeType: { startsWith: 'image/' } },
    select: { id: true },
  });
  return cover ? null : {
    success: false,
    message: 'Выбранная обложка не найдена',
    fieldErrors: { coverImageId: ['Выбранная обложка не найдена'] },
  };
}

function resolvePublishedAt(
  values: ProjectFormValues,
  existing: Date | null = null
) {
  if (values.status !== 'published') return values.publishedAt ?? existing;
  return values.publishedAt ?? existing ?? new Date();
}

export async function createProjectAction(
  input: ProjectFormValues
): Promise<CreateProjectResult> {
  const authError = await authenticate();
  if (authError) return authError;
  const parsed = ProjectFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: 'Проверьте заполненные поля', fieldErrors: fieldErrors(parsed.error) };
  }
  const values = parsed.data;
  if (await prisma.project.findUnique({ where: { slug: values.slug }, select: { id: true } })) {
    return slugConflictResult();
  }
  const coverError = await validateCover(values.coverImageId);
  if (coverError) return coverError;

  try {
    const id = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          slug: values.slug,
          type: values.type,
          status: values.status,
          coverImageId: values.coverImageId,
          sortOrder: values.sortOrder,
          publishedAt: resolvePublishedAt(values),
        },
      });
      await tx.projectTranslation.create({
        data: { projectId: project.id, locale: 'ru', ...values.translations.ru },
      });
      if (hasEnglishTranslation(values)) {
        await tx.projectTranslation.create({
          data: { projectId: project.id, locale: 'en', ...values.translations.en },
        });
      }
      return project.id;
    });
    revalidatePath('/projects');
    return { success: true, data: { id }, message: 'Проект создан' };
  } catch (error) {
    if (isUniqueConstraintError(error)) return slugConflictResult();
    console.error('Failed to create project:', error);
    return { success: false, message: 'Не удалось создать проект' };
  }
}

export async function updateProjectAction(
  id: string,
  input: ProjectFormValues
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success) {
    return { success: false, message: 'Некорректный идентификатор проекта' };
  }
  const parsed = ProjectFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: 'Проверьте заполненные поля', fieldErrors: fieldErrors(parsed.error) };
  }
  const values = parsed.data;
  const existing = await prisma.project.findUnique({
    where: { id }, select: { id: true, publishedAt: true },
  });
  if (!existing) return { success: false, message: 'Проект не найден' };
  if (await prisma.project.findFirst({
    where: { slug: values.slug, id: { not: id } }, select: { id: true },
  })) return slugConflictResult();
  const coverError = await validateCover(values.coverImageId);
  if (coverError) return coverError;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id },
        data: {
          slug: values.slug,
          type: values.type,
          status: values.status,
          coverImageId: values.coverImageId,
          sortOrder: values.sortOrder,
          publishedAt: resolvePublishedAt(values, existing.publishedAt),
        },
      });
      await tx.projectTranslation.upsert({
        where: { projectId_locale: { projectId: id, locale: 'ru' } },
        create: { projectId: id, locale: 'ru', ...values.translations.ru },
        update: values.translations.ru,
      });
      if (hasEnglishTranslation(values)) {
        await tx.projectTranslation.upsert({
          where: { projectId_locale: { projectId: id, locale: 'en' } },
          create: { projectId: id, locale: 'en', ...values.translations.en },
          update: values.translations.en,
        });
      } else {
        await tx.projectTranslation.deleteMany({ where: { projectId: id, locale: 'en' } });
      }
    });
    revalidatePath('/projects');
    revalidatePath(`/projects/${id}`);
    return { success: true, message: 'Изменения сохранены' };
  } catch (error) {
    if (isUniqueConstraintError(error)) return slugConflictResult();
    console.error('Failed to update project:', error);
    return { success: false, message: 'Не удалось сохранить изменения' };
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success) {
    return { success: false, message: 'Некорректный идентификатор проекта' };
  }
  try {
    if (!await prisma.project.findUnique({ where: { id }, select: { id: true } })) {
      return { success: false, message: 'Проект не найден' };
    }
    await prisma.project.delete({ where: { id } });
    revalidatePath('/projects');
    return { success: true, message: 'Проект удалён' };
  } catch (error) {
    console.error('Failed to delete project:', error);
    return { success: false, message: 'Не удалось удалить проект' };
  }
}
