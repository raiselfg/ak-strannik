'use server';

import { randomUUID } from 'node:crypto';
import type { ActionResult } from '../../lib/action-utils';
import { authenticate } from '../../lib/action-utils';
import { getMediaPublicUrl, putObject } from '../../lib/s3cloud';

const maxImageSize = 4 * 1024 * 1024;

function fileExtension(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension && /^[a-z0-9]{1,10}$/.test(extension) ? extension : 'image';
}

export async function uploadImage(
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const authFailure = await authenticate();
  if (authFailure) return authFailure;

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return { success: false, message: 'Выберите файл изображения' };
  }
  if (!file.type.startsWith('image/')) {
    return { success: false, message: 'Разрешены только изображения' };
  }
  if (file.size > maxImageSize) {
    return {
      success: false,
      message: 'Размер изображения не должен превышать 4 МБ',
    };
  }

  try {
    const objectKey = `media/${randomUUID()}.${fileExtension(file)}`;
    const body = Buffer.from(await file.arrayBuffer());
    await putObject(objectKey, body, file.type);
    return {
      success: true,
      data: { url: getMediaPublicUrl(objectKey) },
    };
  } catch (error) {
    console.error('[Media] image upload failed', error);
    return {
      success: false,
      message: 'Не удалось загрузить изображение. Попробуйте ещё раз',
    };
  }
}
