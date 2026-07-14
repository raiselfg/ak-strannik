import { z } from 'zod';

const nullableText = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable();

const nullableUuid = z
  .union([z.literal(''), z.uuid('Выберите корректное изображение'), z.null()])
  .transform((value) => (value === '' ? null : value));

export const TeamMemberFormSchema = z.object({
  imageId: nullableUuid,
  sortOrder: z
    .number()
    .int('Укажите целое число')
    .min(0, 'Порядок не может быть отрицательным'),
  isActive: z.boolean(),
  translations: z.object({
    ru: z.object({
      name: z.string().trim().min(1, 'Укажите имя'),
      role: nullableText,
      description: nullableText,
    }),
    en: z.object({
      name: z.string().trim(),
      role: nullableText,
      description: nullableText,
    }),
  }),
});

export type TeamMemberFormValues = z.infer<typeof TeamMemberFormSchema>;
