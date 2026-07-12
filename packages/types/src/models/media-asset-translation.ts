import { z } from 'zod';
import { IdSchema } from './common';
import { LocaleSchema } from './enums';

export const MediaAssetTranslationSchema = z.object({
  id: IdSchema,
  mediaAssetId: IdSchema,
  locale: LocaleSchema,
  alt: z.string().nullable(),
  title: z.string().nullable(),
  caption: z.string().nullable(),
});
export const CreateMediaAssetTranslationDtoSchema =
  MediaAssetTranslationSchema.pick({
    mediaAssetId: true,
    locale: true,
    alt: true,
    title: true,
    caption: true,
  }).partial({ alt: true, title: true, caption: true });
export const UpdateMediaAssetTranslationDtoSchema =
  CreateMediaAssetTranslationDtoSchema.partial();
export const FindOneMediaAssetTranslationDtoSchema = z.object({ id: IdSchema });
export const DeleteMediaAssetTranslationDtoSchema =
  FindOneMediaAssetTranslationDtoSchema;
export type MediaAssetTranslation = z.infer<typeof MediaAssetTranslationSchema>;
export type CreateMediaAssetTranslationDto = z.infer<
  typeof CreateMediaAssetTranslationDtoSchema
>;
export type UpdateMediaAssetTranslationDto = z.infer<
  typeof UpdateMediaAssetTranslationDtoSchema
>;
export type FindOneMediaAssetTranslationDto = z.infer<
  typeof FindOneMediaAssetTranslationDtoSchema
>;
export type DeleteMediaAssetTranslationDto = z.infer<
  typeof DeleteMediaAssetTranslationDtoSchema
>;
