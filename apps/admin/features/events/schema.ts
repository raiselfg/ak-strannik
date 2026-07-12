import { z } from 'zod';

const nullableText = z.union([z.string(), z.null()]).transform((value) => {
  const normalized = value?.trim() ?? '';
  return normalized === '' ? null : normalized;
});

const nullableUuid = z.union([z.literal(''), z.uuid(), z.null()])
  .transform((value) => value === '' ? null : value);

export function isValidYoutubeUrl(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === 'https:'
      && (host === 'youtube.com'
        || host === 'www.youtube.com'
        || host === 'youtu.be');
  } catch {
    return false;
  }
}

const nullableYoutubeUrl = z.union([z.string(), z.null()])
  .transform((value) => {
    const normalized = value?.trim() ?? '';
    return normalized === '' ? null : normalized;
  })
  .refine((value) => value === null || isValidYoutubeUrl(value),
    'Укажите корректную ссылку YouTube');

export const ContentStatusSchema = z.enum(['draft', 'published', 'archived']);

const translationSchema = z.object({
  title: z.string().trim(),
  excerpt: nullableText,
  body: nullableText,
  seoTitle: nullableText.refine(
    (value) => value === null || value.length <= 70,
    'SEO title не должен превышать 70 символов'
  ),
  seoDescription: nullableText.refine(
    (value) => value === null || value.length <= 170,
    'SEO description не должен превышать 170 символов'
  ),
});

export const EventFormSchema = z.object({
  slug: z.string()
    .trim()
    .min(1, 'Укажите slug')
    .max(160, 'Slug слишком длинный')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Используйте строчные латинские буквы, цифры и дефисы'
    ),
  status: ContentStatusSchema,
  eventDate: z.date().nullable(),
  coverImageId: nullableUuid,
  youtubeUrl: nullableYoutubeUrl,
  sortOrder: z.number()
    .int('Порядок должен быть целым числом')
    .min(0, 'Порядок не может быть отрицательным'),
  publishedAt: z.date().nullable(),
  translations: z.object({
    ru: translationSchema.extend({
      title: z.string().trim().min(1, 'Укажите название мероприятия'),
    }),
    en: translationSchema,
  }),
  gallery: z.array(z.object({
    mediaId: z.uuid(),
    sortOrder: z.number().int().min(0),
  })).superRefine((items, context) => {
    const ids = new Set<string>();
    for (const item of items) {
      if (ids.has(item.mediaId)) {
        context.addIssue({
          code: 'custom',
          message: 'Изображения галереи не должны повторяться',
        });
      }
      ids.add(item.mediaId);
    }
  }).transform((items) => items.map((item, index) => ({
    mediaId: item.mediaId,
    sortOrder: index,
  }))),
});

export type EventFormValues = z.infer<typeof EventFormSchema>;
