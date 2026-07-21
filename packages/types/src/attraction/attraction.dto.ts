import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import { idSchema, nonEmptyStringSchema } from '../common/primitives.schema';

export const createAttractionContentTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    text: nonEmptyStringSchema,
  })
  .strict();
export const updateAttractionContentTranslationDtoSchema =
  createAttractionContentTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createAttractionContentDtoSchema = z
  .object({
    image: nonEmptyStringSchema,
    translations: z
      .array(createAttractionContentTranslationDtoSchema)
      .default([]),
  })
  .strict();
export const updateAttractionContentDtoSchema = createAttractionContentDtoSchema
  .partial()
  .extend({
    translations: z
      .array(updateAttractionContentTranslationDtoSchema)
      .optional(),
  })
  .strict();
