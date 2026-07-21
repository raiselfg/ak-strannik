import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const createUstaContentTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    text: nonEmptyStringSchema,
  })
  .strict();
export const updateUstaContentTranslationDtoSchema =
  createUstaContentTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createUstaContentDtoSchema = z
  .object({
    videos: stringArraySchema.default([]),
    images: stringArraySchema.default([]),
    achievements: stringArraySchema.default([]),
    translations: z.array(createUstaContentTranslationDtoSchema).default([]),
  })
  .strict();
export const updateUstaContentDtoSchema = createUstaContentDtoSchema
  .partial()
  .extend({
    translations: z.array(updateUstaContentTranslationDtoSchema).optional(),
  })
  .strict();
