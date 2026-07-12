import { z } from 'zod';

const nullableText = z.union([z.string(), z.null()]).transform((value) => {
  const normalized = value?.trim() ?? '';
  return normalized === '' ? null : normalized;
});

const nullableUuid = z.union([
  z.literal(''),
  z.uuid('Выберите корректное изображение'),
  z.null(),
]).transform((value) => value === '' ? null : value);

export const RentalTypeSchema = z.enum(['mascot', 'attraction', 'props']);

export const RentalItemFormSchema = z.object({
  slug: z.string()
    .trim()
    .min(1, 'Укажите slug')
    .max(160, 'Slug слишком длинный')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Используйте строчные латинские буквы, цифры и дефисы'
    ),
  type: RentalTypeSchema,
  imageId: nullableUuid,
  sortOrder: z.number()
    .int('Порядок должен быть целым числом')
    .min(0, 'Порядок не может быть отрицательным'),
  isActive: z.boolean(),
  translations: z.object({
    ru: z.object({
      title: z.string().trim().min(1, 'Укажите название позиции'),
      description: nullableText,
      priceText: nullableText,
    }),
    en: z.object({
      title: z.string().trim(),
      description: nullableText,
      priceText: nullableText,
    }),
  }),
});

export type RentalItemFormValues = z.infer<typeof RentalItemFormSchema>;
