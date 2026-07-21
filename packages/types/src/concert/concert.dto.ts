import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import { idSchema, stringArraySchema } from '../common/primitives.schema';

export const createConcertContentTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: z.string().nullable().optional(),
    text: z.string().nullable().optional(),
    duration: z.string().nullable().optional(),
  })
  .strict();

export const updateConcertContentTranslationDtoSchema =
  createConcertContentTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createConcertContentDtoSchema = z
  .object({
    images: stringArraySchema.default([]),
    videos: stringArraySchema.default([]),
    translations: z.array(createConcertContentTranslationDtoSchema).default([]),
  })
  .strict();

export const updateConcertContentDtoSchema = createConcertContentDtoSchema
  .partial()
  .extend({
    translations: z.array(updateConcertContentTranslationDtoSchema).optional(),
  })
  .strict();
