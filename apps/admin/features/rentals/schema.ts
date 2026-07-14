import { z } from 'zod';

const nullableText = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable();

const nullableUuid = z
  .union([z.literal(''), z.uuid('Выберите корректное изображение'), z.null()])
  .transform((value) => (value === '' ? null : value));

export const RentalTypeSchema = z.enum(['mascot', 'attraction', 'props']);

export const RentalItemFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Укажите slug')
    .max(160, 'Slug слишком длинный')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Используйте строчные латинские буквы, цифры и дефисы'
    ),
  type: RentalTypeSchema,
  imageId: nullableUuid,
  sortOrder: z
    .number()
    .int('Порядок должен быть целым числом')
    .min(0, 'Порядок не может быть отрицательным'),
  isActive: z.boolean(),
  gallery: z
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
            message: 'Изображения галереи не должны повторяться',
          });
        ids.add(item.mediaId);
      }
    })
    .transform((items) =>
      items.map((item, index) => ({ ...item, sortOrder: index }))
    ),
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
