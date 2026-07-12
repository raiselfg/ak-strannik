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

const nullableHttpUrl = z.union([z.string(), z.null()])
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
  sortOrder: z.number()
    .int('Порядок должен быть целым числом')
    .min(0, 'Порядок не может быть отрицательным'),
  isActive: z.boolean(),
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
