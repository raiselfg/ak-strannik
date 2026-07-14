import {
  ProjectSectionVariantSchema,
  VideoProviderSchema,
  validateVideoUrl,
} from '@ak-strannik/types';
import { z } from 'zod';

const nullableText = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable();

const nullableVideoUrl = z.union([z.string(), z.null()]).transform((value) => {
  const normalized = value?.trim() ?? '';
  return normalized === '' ? null : normalized;
});
export { ProjectSectionVariantSchema };

const translationSchema = z.object({
  title: nullableText,
  subtitle: nullableText,
  body: nullableText,
  author: nullableText,
});

export const ProjectSectionFormSchema = z
  .object({
    variant: ProjectSectionVariantSchema,
    videoProvider: VideoProviderSchema.nullable(),
    videoUrl: nullableVideoUrl,
    sortOrder: z
      .number()
      .int('Порядок должен быть целым числом')
      .min(0, 'Порядок не может быть отрицательным'),
    isActive: z.boolean(),
    translations: z.object({ ru: translationSchema, en: translationSchema }),
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
          if (ids.has(item.mediaId)) {
            context.addIssue({
              code: 'custom',
              message: 'Медиафайлы не должны повторяться',
            });
          }
          ids.add(item.mediaId);
        }
      })
      .transform((items) =>
        items.map((item, index) => ({
          mediaId: item.mediaId,
          sortOrder: index,
        }))
      ),
  })
  .superRefine((values, context) => {
    if (
      (values.variant === 'gallery' || values.variant === 'slider') &&
      values.media.length === 0
    ) {
      context.addIssue({
        code: 'custom',
        path: ['media'],
        message: 'Добавьте хотя бы одно изображение',
      });
    }
    if (values.variant === 'video' && !values.videoProvider) {
      context.addIssue({
        code: 'custom',
        path: ['videoProvider'],
        message: 'Выберите видеопровайдера',
      });
    }
    if (values.variant === 'video' && !values.videoUrl) {
      context.addIssue({
        code: 'custom',
        path: ['videoUrl'],
        message: 'Укажите ссылку на видео',
      });
    }
    if (
      values.variant === 'video' &&
      values.videoProvider &&
      values.videoUrl &&
      !validateVideoUrl(values.videoProvider, values.videoUrl)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['videoUrl'],
        message: 'URL не соответствует выбранному видеопровайдеру',
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

export type ProjectSectionFormValues = z.infer<typeof ProjectSectionFormSchema>;
