import { z } from 'zod';

const nullableText = z.union([z.string(), z.null()]).transform((value) => {
  const normalized = value?.trim() ?? '';
  return normalized || null;
});

const translationSchema = z.object({ alt: nullableText, title: nullableText, caption: nullableText });

export const MediaAssetMetadataFormSchema = z.object({
  translations: z.object({ ru: translationSchema, en: translationSchema }),
});

export type MediaAssetMetadataFormValues = z.infer<typeof MediaAssetMetadataFormSchema>;
