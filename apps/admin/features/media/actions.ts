'use server';

import { prisma } from '@ak-strannik/database';
import { createHash, randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import {
  authenticate,
  fieldErrors,
  idSchema,
  type ActionResult,
} from '../../lib/action-utils';
import { deleteObject, putObject } from '../../lib/s3cloud';
import {
  ALLOWED_MEDIA_MIME_TYPES,
  MAX_MEDIA_FILE_SIZE,
  MEDIA_EXTENSIONS,
} from './constants';
import { getMediaAssetUsage } from './queries';
import {
  MediaAssetMetadataFormSchema,
  type MediaAssetMetadataFormValues,
} from './schema';

const MIME_TYPES_BY_SHARP_FORMAT: Record<
  string,
  (typeof ALLOWED_MEDIA_MIME_TYPES)[number]
> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif'
};

function extensionFor(file: File) {
  const type = file.type as (typeof ALLOWED_MEDIA_MIME_TYPES)[number];
  const allowed = MEDIA_EXTENSIONS[type];
  const supplied = file.name.split('.').pop()?.toLowerCase();
  if (!allowed || !supplied || !allowed.includes(supplied)) return null;
  return supplied === 'jpeg' ? 'jpg' : supplied;
}

export async function uploadMediaAssetAction(
  formData: FormData
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0)
    return { success: false, message: 'Файл не выбран' };
  if (file.size > MAX_MEDIA_FILE_SIZE)
    return { success: false, message: 'Файл превышает допустимый размер' };
  if (
    !ALLOWED_MEDIA_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_MEDIA_MIME_TYPES)[number]
    )
  )
    return { success: false, message: 'Этот тип файла не поддерживается' };
  const extension = extensionFor(file);
  if (!extension)
    return {
      success: false,
      message: 'Расширение файла не соответствует его типу',
    };

  const now = new Date();
  const objectKey = `media/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const checksumSha256 = createHash('sha256').update(buffer).digest('hex');
  if (
    await prisma.mediaAsset.findUnique({
      where: { checksumSha256 },
      select: { id: true },
    })
  ) {
    return { success: false, message: 'Такой файл уже есть в медиатеке' };
  }
  let width: number | null = null;
  let height: number | null = null;
  try {
    const metadata = await sharp(buffer).metadata();
    const detectedMimeType = metadata.format
      ? MIME_TYPES_BY_SHARP_FORMAT[metadata.format]
      : undefined;
    if (!detectedMimeType || detectedMimeType !== file.type) {
      return {
        success: false,
        message: 'File contents do not match its declared type',
      };
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
    await prisma.mediaAsset.create({
      data: {
        objectKey,
        checksumSha256,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        width,
        height,
      },
    });
  } catch (error) {
    console.error('Failed to create media asset:', error);
    try {
      await deleteObject(objectKey);
    } catch (cleanupError) {
      console.error('Failed to compensate media upload:', cleanupError);
    }
    return { success: false, message: 'Не удалось загрузить файл' };
  }
  revalidatePath('/media');
  return { success: true, message: 'Медиафайл загружен' };
}

function hasContent(value: MediaAssetMetadataFormValues['translations']['ru']) {
  return Boolean(
    value.alt?.trim() || value.title?.trim() || value.caption?.trim()
  );
}

export async function updateMediaAssetMetadataAction(
  id: string,
  input: MediaAssetMetadataFormValues
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success)
    return { success: false, message: 'Некорректный идентификатор файла' };
  const parsed = MediaAssetMetadataFormSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: 'Проверьте заполненные поля',
      fieldErrors: fieldErrors(parsed.error),
    };
  try {
    const exists = await prisma.mediaAsset.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return { success: false, message: 'Медиафайл не найден' };
    await prisma.$transaction(async (tx) => {
      for (const locale of ['ru', 'en'] as const) {
        const value = parsed.data.translations[locale];
        if (hasContent(value)) {
          await tx.mediaAssetTranslation.upsert({
            where: { mediaAssetId_locale: { mediaAssetId: id, locale } },
            create: { mediaAssetId: id, locale, ...value },
            update: value,
          });
        } else {
          await tx.mediaAssetTranslation.deleteMany({
            where: { mediaAssetId: id, locale },
          });
        }
      }
    });
    revalidatePath('/media');
    revalidatePath(`/media/${id}`);
    return { success: true, message: 'Метаданные сохранены' };
  } catch (error) {
    console.error('Failed to update media metadata:', error);
    return { success: false, message: 'Не удалось сохранить метаданные' };
  }
}

export async function deleteMediaAssetAction(
  id: string
): Promise<ActionResult> {
  const authError = await authenticate();
  if (authError) return authError;
  if (!idSchema.safeParse(id).success)
    return { success: false, message: 'Некорректный идентификатор файла' };
  try {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
      select: { objectKey: true },
    });
    if (!asset) return { success: false, message: 'Медиафайл не найден' };
    if ((await getMediaAssetUsage(id)).length)
      return {
        success: false,
        message: 'Нельзя удалить файл, пока он используется в контенте',
      };
    try {
      await prisma.mediaAsset.delete({ where: { id } });
    } catch (databaseError) {
      if (
        typeof databaseError === 'object' &&
        databaseError !== null &&
        'code' in databaseError &&
        databaseError.code === 'P2003'
      ) {
        return {
          success: false,
          message: 'Нельзя удалить файл, пока он используется в контенте',
        };
      }
      throw databaseError;
    }
    revalidatePath('/media');
    try {
      await deleteObject(asset.objectKey);
    } catch (storageError) {
      console.error('Media DB record deleted but storage cleanup failed:', {
        id,
        storageError,
      });
      return {
        success: true,
        message: 'Запись удалена; объект в хранилище требует очистки',
      };
    }
    return { success: true, message: 'Медиафайл удалён' };
  } catch (error) {
    console.error('Failed to delete media asset:', error);
    return { success: false, message: 'Не удалось удалить файл' };
  }
}
