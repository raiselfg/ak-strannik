import { z } from 'zod';

const nullableText = z.union([z.string(), z.null()]).transform((value) => {
  const normalized = value?.trim() ?? '';
  return normalized === '' ? null : normalized;
});

export const CertificateFormSchema = z.object({
  imageId: z.uuid('Выберите изображение сертификата'),
  year: z.number()
    .int('Год должен быть целым числом')
    .min(1900, 'Укажите корректный год')
    .max(2100, 'Укажите корректный год')
    .nullable(),
  sortOrder: z.number()
    .int('Порядок должен быть целым числом')
    .min(0, 'Порядок не может быть отрицательным'),
  isActive: z.boolean(),
  translations: z.object({
    ru: z.object({
      title: z.string().trim().min(1, 'Укажите название сертификата'),
      issuer: nullableText,
      description: nullableText,
    }),
    en: z.object({
      title: nullableText,
      issuer: nullableText,
      description: nullableText,
    }),
  }),
});

export type CertificateFormValues = z.infer<typeof CertificateFormSchema>;
