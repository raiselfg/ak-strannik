import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const createExhibitionContentTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: nonEmptyStringSchema,
  })
  .strict();

export const updateExhibitionContentTranslationDtoSchema =
  createExhibitionContentTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createExhibitionContentDtoSchema = z
  .object({
    images: stringArraySchema.default([]),
    translations: z
      .array(createExhibitionContentTranslationDtoSchema)
      .default([]),
  })
  .strict();

export const updateExhibitionContentDtoSchema = createExhibitionContentDtoSchema
  .partial()
  .extend({
    translations: z
      .array(updateExhibitionContentTranslationDtoSchema)
      .optional(),
  })
  .strict();
