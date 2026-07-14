import { z } from 'zod';
import { VideoInputSchema } from '@ak-strannik/types';

const nullableText = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable();

const nullableUuid = z
  .union([z.literal(''), z.uuid('Выберите корректное изображение'), z.null()])
  .transform((value) => (value === '' ? null : value));

const nullableHttpUrl = z
  .union([z.string(), z.null()])
  .transform((value) => {
    const normalized = value?.trim() ?? '';
    return normalized === '' ? null : normalized;
  })
  .refine((value) => {
    if (value === null) return true;
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Укажите корректный URL');

export const PartnerFormSchema = z.object({
  logoId: nullableUuid,
  websiteUrl: nullableHttpUrl,
  sortOrder: z
    .number()
    .int('Порядок должен быть целым числом')
    .min(0, 'Порядок не может быть отрицательным'),
  isActive: z.boolean(),
  media: z
    .array(
      z.object({
        mediaId: z.uuid(),
        sortOrder: z.number().int().min(0),
      })
    )
    .superRefine((items, context) => {
      const ids = new Set<string>();
      for (const item of items) {
        if (ids.has(item.mediaId))
          context.addIssue({
            code: 'custom',
            message: 'Медиафайлы не должны повторяться',
          });
        ids.add(item.mediaId);
      }
    })
    .transform((items) =>
      items.map((item, index) => ({ ...item, sortOrder: index }))
    ),
  videos: z
    .array(VideoInputSchema)
    .superRefine((items, context) => {
      const urls = new Set<string>();
      for (const item of items) {
        if (urls.has(item.url))
          context.addIssue({
            code: 'custom',
            message: 'Ссылки на видео не должны повторяться',
          });
        urls.add(item.url);
      }
    })
    .transform((items) =>
      items.map((item, index) => ({ ...item, sortOrder: index }))
    ),
  translations: z.object({
    ru: z.object({
      name: z.string().trim().min(1, 'Укажите название партнёра'),
      description: nullableText,
    }),
    en: z.object({
      name: z.string().trim(),
      description: nullableText,
    }),
  }),
});

export type PartnerFormValues = z.infer<typeof PartnerFormSchema>;
