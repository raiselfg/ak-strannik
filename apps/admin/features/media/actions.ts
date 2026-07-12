'use server';

import { prisma } from '@ak-strannik/database';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { z } from 'zod';
import { requireAdminSession } from '../../lib/require-admin-session';
import { deleteObject, putObject } from '../../lib/s3cloud';
import { ALLOWED_MEDIA_MIME_TYPES, MAX_MEDIA_FILE_SIZE, MEDIA_EXTENSIONS } from './constants';
import { getMediaAssetUsage } from './queries';
import { MediaAssetMetadataFormSchema, type MediaAssetMetadataFormValues } from './schema';

export type MediaActionResult =
  | { success: true; message?: string }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };

const idSchema = z.uuid();

const MIME_TYPES_BY_SHARP_FORMAT: Record<string, (typeof ALLOWED_MEDIA_MIME_TYPES)[number]> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
};

async function authenticate(): Promise<MediaActionResult | null> {
  try { await requireAdminSession(); return null; }
  catch { return { success: false, message: 'Необходимо войти в административную панель' }; }
}

function extensionFor(file: File) {
  const type = file.type as (typeof ALLOWED_MEDIA_MIME_TYPES)[number];
  const allowed = MEDIA_EXTENSIONS[type];
  const supplied = file.name.split('.').pop()?.toLowerCase();
  if (!allowed || !supplied || !allowed.includes(supplied)) return null;
  return supplied === 'jpeg' ? 'jpg' : supplied;
}

export async function uploadMediaAssetAction(formData: FormData): Promise<MediaActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return { success: false, message: 'Файл не выбран' };
  if (file.size > MAX_MEDIA_FILE_SIZE) return { success: false, message: 'Файл превышает допустимый размер' };
  if (!ALLOWED_MEDIA_MIME_TYPES.includes(file.type as (typeof ALLOWED_MEDIA_MIME_TYPES)[number])) return { success: false, message: 'Этот тип файла не поддерживается' };
  const extension = extensionFor(file);
  if (!extension) return { success: false, message: 'Расширение файла не соответствует его типу' };

  const now = new Date();
  const objectKey = `media/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  let width: number | null = null;
  let height: number | null = null;
  try {
    const metadata = await sharp(buffer).metadata();
    const detectedMimeType = metadata.format
      ? MIME_TYPES_BY_SHARP_FORMAT[metadata.format]
      : undefined;
    if (!detectedMimeType || detectedMimeType !== file.type) {
      return { success: false, message: 'File contents do not match its declared type' };
    }
    width = metadata.width ?? null;
    height = metadata.height ?? null;
  } catch (error) {
    console.error('Failed to read image dimensions:', error);
    return { success: false, message: 'Не удалось прочитать изображение' };
  }

  try {
    await putObject(objectKey, buffer, file.type);
  } catch {
    return { success: false, message: 'Не удалось загрузить файл' };
  }
  try {
    await prisma.mediaAsset.create({ data: { objectKey, originalName: file.name, mimeType: file.type, size: file.size, width, height } });
  } catch (error) {
    console.error('Failed to create media asset:', error);
    try { await deleteObject(objectKey); } catch (cleanupError) { console.error('Failed to compensate media upload:', cleanupError); }
    return { success: false, message: 'Не удалось загрузить файл' };
  }
  revalidatePath('/media');
  return { success: true, message: 'Медиафайл загружен' };
}

function hasContent(value: MediaAssetMetadataFormValues['translations']['ru']) {
  return Boolean(value.alt?.trim() || value.title?.trim() || value.caption?.trim());
}

function fieldErrors(error: z.ZodError) {
  return error.issues.reduce<Record<string, string[]>>((result, issue) => {
    const key = issue.path.join('.');
    if (key) result[key] = [...(result[key] ?? []), issue.message];
    return result;
  }, {});
}

export async function updateMediaAssetMetadataAction(id: string, input: MediaAssetMetadataFormValues): Promise<MediaActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success) return { success: false, message: 'Некорректный идентификатор файла' };
  const parsed = MediaAssetMetadataFormSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: 'Проверьте заполненные поля', fieldErrors: fieldErrors(parsed.error) };
  try {
    const exists = await prisma.mediaAsset.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return { success: false, message: 'Медиафайл не найден' };
    await prisma.$transaction(async (tx) => {
      for (const locale of ['ru', 'en'] as const) {
        const value = parsed.data.translations[locale];
        if (hasContent(value)) {
          await tx.mediaAssetTranslation.upsert({ where: { mediaAssetId_locale: { mediaAssetId: id, locale } }, create: { mediaAssetId: id, locale, ...value }, update: value });
        } else {
          await tx.mediaAssetTranslation.deleteMany({ where: { mediaAssetId: id, locale } });
        }
      }
    });
    revalidatePath('/media'); revalidatePath(`/media/${id}`);
    return { success: true, message: 'Метаданные сохранены' };
  } catch (error) {
    console.error('Failed to update media metadata:', error);
    return { success: false, message: 'Не удалось сохранить метаданные' };
  }
}

export async function deleteMediaAssetAction(id: string): Promise<MediaActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success) return { success: false, message: 'Некорректный идентификатор файла' };
  try {
    const asset = await prisma.mediaAsset.findUnique({ where: { id }, select: { objectKey: true } });
    if (!asset) return { success: false, message: 'Медиафайл не найден' };
    if ((await getMediaAssetUsage(id)).length) return { success: false, message: 'Файл используется в других разделах и не может быть удалён' };
    await deleteObject(asset.objectKey);
    try { await prisma.mediaAsset.delete({ where: { id } }); }
    catch (databaseError) {
      console.error('CRITICAL: storage object deleted but media DB record remains:', { id, databaseError });
      return { success: false, message: 'Файл удалён из хранилища, но запись медиатеки удалить не удалось' };
    }
    revalidatePath('/media');
    return { success: true, message: 'Медиафайл удалён' };
  } catch (error) {
    console.error('Failed to delete media asset:', error);
    return { success: false, message: 'Не удалось удалить файл' };
  }
}
