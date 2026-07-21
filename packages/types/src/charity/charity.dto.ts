import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const createCharityContentTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: nonEmptyStringSchema,
    text: z.string().nullable().optional(),
  })
  .strict();

export const updateCharityContentTranslationDtoSchema =
  createCharityContentTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createCharityContentDtoSchema = z
  .object({
    images: stringArraySchema.default([]),
    videos: stringArraySchema.default([]),
    translations: z.array(createCharityContentTranslationDtoSchema).default([]),
  })
  .strict();

export const updateCharityContentDtoSchema = createCharityContentDtoSchema
  .partial()
  .extend({
    translations: z.array(updateCharityContentTranslationDtoSchema).optional(),
  })
  .strict();
