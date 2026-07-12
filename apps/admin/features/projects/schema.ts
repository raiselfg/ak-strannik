import { z } from 'zod';
import { ContentStatusSchema } from '../events/schema';

const nullableText = z.union([z.string(), z.null()]).transform((value) => {
  const normalized = value?.trim() ?? '';
  return normalized === '' ? null : normalized;
});

const nullableUuid = z.union([z.literal(''), z.uuid(), z.null()])
  .transform((value) => value === '' ? null : value);

export const ProjectTypeSchema = z.enum([
  'musical', 'singer', 'exhibition', 'newYearShow', 'masterClass',
  'performance', 'artist', 'concertProgram', 'festival', 'charity', 'other',
]);

const translationSchema = z.object({
  title: z.string().trim(),
  subtitle: nullableText,
  excerpt: nullableText,
  seoTitle: nullableText.refine(
    (value) => value === null || value.length <= 70,
    'SEO title не должен превышать 70 символов'
  ),
  seoDescription: nullableText.refine(
    (value) => value === null || value.length <= 170,
    'SEO description не должен превышать 170 символов'
  ),
});

export const ProjectFormSchema = z.object({
  slug: z.string()
    .trim()
    .min(1, 'Укажите slug')
    .max(160, 'Slug слишком длинный')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Используйте строчные латинские буквы, цифры и дефисы'
    ),
  type: ProjectTypeSchema,
  status: ContentStatusSchema,
  coverImageId: nullableUuid,
  sortOrder: z.number()
    .int('Порядок должен быть целым числом')
    .min(0, 'Порядок не может быть отрицательным'),
  publishedAt: z.date().nullable(),
  translations: z.object({
    ru: translationSchema.extend({
      title: z.string().trim().min(1, 'Укажите название проекта'),
    }),
    en: translationSchema,
  }),
});

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;
