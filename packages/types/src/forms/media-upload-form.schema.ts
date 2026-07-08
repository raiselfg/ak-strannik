import { z } from 'zod';

import { MediaKindSchema } from '../media/media.schemas';

export const MEDIA_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  document: ['application/pdf'],
  video: ['video/mp4', 'video/webm'],
} as const;

export const MediaUploadFormSchema = z
  .object({
    kind: MediaKindSchema,
    filename: z.string().trim().min(1, 'Выберите файл').max(255),
    contentType: z.string().min(1, 'Не удалось определить тип файла'),
    sizeBytes: z.number().int().positive('Файл не должен быть пустым'),
  })
  .superRefine((value, context) => {
    const allowed = MEDIA_MIME_TYPES[value.kind] as readonly string[];
    if (!allowed.includes(value.contentType)) {
      context.addIssue({
        code: 'custom',
        path: ['contentType'],
        message: `Тип ${value.contentType} не поддерживается для ${value.kind}`,
      });
    }
  });

export type MediaUploadFormValues = z.infer<typeof MediaUploadFormSchema>;
