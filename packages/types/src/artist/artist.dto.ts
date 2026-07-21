import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import { idSchema, stringArraySchema } from '../common/primitives.schema';

export const createArtistContentTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: z.string().nullable().optional(),
    text: z.string().nullable().optional(),
  })
  .strict();

export const updateArtistContentTranslationDtoSchema =
  createArtistContentTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createArtistContentDtoSchema = z
  .object({
    images: stringArraySchema.default([]),
    videos: stringArraySchema.default([]),
    translations: z.array(createArtistContentTranslationDtoSchema).default([]),
  })
  .strict();

export const updateArtistContentDtoSchema = createArtistContentDtoSchema
  .partial()
  .extend({
    translations: z.array(updateArtistContentTranslationDtoSchema).optional(),
  })
  .strict();
