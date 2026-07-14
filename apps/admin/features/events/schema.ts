import { ContentStatusSchema, VideoInputSchema } from '@ak-strannik/types';
import { z } from 'zod';

const nullableText = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable();

const nullableUuid = z
  .union([z.literal(''), z.uuid(), z.null()])
  .transform((value) => (value === '' ? null : value));

const translationSchema = z.object({
  title: z.string().trim(),
  excerpt: nullableText,
  body: nullableText,
  dateText: nullableText,
  locationText: nullableText,
  seoTitle: nullableText.refine(
    (value) => value === null || value.length <= 70,
    'SEO title не должен превышать 70 символов'
  ),
  seoDescription: nullableText.refine(
    (value) => value === null || value.length <= 170,
    'SEO description не должен превышать 170 символов'
  ),
});

const orderedMediaSchema = z
  .array(
    z.object({
      mediaId: z.uuid(),
      sortOrder: z.number().int().min(0),
    })
  )
  .superRefine((items, context) => {
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
  })
  .transform((items) =>
    items.map((item, index) => ({ ...item, sortOrder: index }))
  );

const orderedVideosSchema = z
  .array(VideoInputSchema)
  .superRefine((items, context) => {
    const urls = new Set<string>();
    for (const item of items) {
      if (urls.has(item.url)) {
        context.addIssue({
          code: 'custom',
          message: 'Ссылки на видео не должны повторяться',
        });
      }
      urls.add(item.url);
    }
  })
  .transform((items) =>
    items.map((item, index) => ({ ...item, sortOrder: index }))
  );

export { ContentStatusSchema };

export const EventFormSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1, 'Укажите slug')
      .max(160, 'Slug слишком длинный')
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Используйте строчные латинские буквы, цифры и дефисы'
      ),
    status: ContentStatusSchema,
    eventYear: z.number().int().min(1900).max(2200).nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    projectId: nullableUuid,
    coverImageId: nullableUuid,
    sortOrder: z
      .number()
      .int('Порядок должен быть целым числом')
      .min(0, 'Порядок не может быть отрицательным'),
    publishedAt: z.date().nullable(),
    translations: z.object({
      ru: translationSchema.extend({
        title: z.string().trim().min(1, 'Укажите название мероприятия'),
      }),
      en: translationSchema,
    }),
    gallery: orderedMediaSchema,
    videos: orderedVideosSchema,
  })
  .superRefine((values, context) => {
    if (
      values.endDate &&
      values.startDate &&
      values.endDate < values.startDate
    ) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Дата окончания не может быть раньше даты начала',
      });
    }
    if (values.status === 'published' && values.eventYear === null) {
      context.addIssue({
        code: 'custom',
        path: ['eventYear'],
        message: 'Для публикации укажите год мероприятия',
      });
    }
  });

export type EventFormValues = z.infer<typeof EventFormSchema>;
