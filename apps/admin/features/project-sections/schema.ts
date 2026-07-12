import { z } from 'zod';
import { isValidYoutubeUrl } from '../events/schema';

const nullableText = z.union([z.string(), z.null()]).transform((value) => {
  const normalized = value?.trim() ?? '';
  return normalized === '' ? null : normalized;
});

const nullableYoutubeUrl = z.union([z.string(), z.null()])
  .transform((value) => {
    const normalized = value?.trim() ?? '';
    return normalized === '' ? null : normalized;
  })
  .refine(
    (value) => value === null || isValidYoutubeUrl(value),
    'Укажите корректную ссылку YouTube'
  );

export const ProjectSectionVariantSchema = z.enum([
  'content', 'split', 'gallery', 'slider', 'youtube', 'quote',
]);

const translationSchema = z.object({
  title: nullableText,
  subtitle: nullableText,
  body: nullableText,
  author: nullableText,
});

export const ProjectSectionFormSchema = z.object({
  variant: ProjectSectionVariantSchema,
  youtubeUrl: nullableYoutubeUrl,
  sortOrder: z.number()
    .int('Порядок должен быть целым числом')
    .min(0, 'Порядок не может быть отрицательным'),
  isActive: z.boolean(),
  translations: z.object({ ru: translationSchema, en: translationSchema }),
  media: z.array(z.object({
    mediaId: z.uuid(),
    sortOrder: z.number().int().min(0),
  })).superRefine((items, context) => {
    const ids = new Set<string>();
    for (const item of items) {
      if (ids.has(item.mediaId)) {
        context.addIssue({ code: 'custom', message: 'Медиафайлы не должны повторяться' });
      }
      ids.add(item.mediaId);
    }
  }).transform((items) => items.map((item, index) => ({
    mediaId: item.mediaId,
    sortOrder: index,
  }))),
}).superRefine((values, context) => {
  if ((values.variant === 'gallery' || values.variant === 'slider')
    && values.media.length === 0) {
    context.addIssue({
      code: 'custom',
      path: ['media'],
      message: 'Добавьте хотя бы одно изображение',
    });
  }
  if (values.variant === 'youtube' && !values.youtubeUrl) {
    context.addIssue({
      code: 'custom',
      path: ['youtubeUrl'],
      message: 'Укажите ссылку на YouTube',
    });
  }
  if (values.variant === 'quote' && !values.translations.ru.body) {
    context.addIssue({
      code: 'custom',
      path: ['translations', 'ru', 'body'],
      message: 'Укажите текст цитаты',
    });
  }
  if (values.variant === 'split') {
    const ru = values.translations.ru;
    if (!ru.title && !ru.subtitle && !ru.body && values.media.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['media'],
        message: 'Добавьте текст или изображение',
      });
    }
  }
});

export type ProjectSectionFormValues = z.infer<
  typeof ProjectSectionFormSchema
>;
