import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const createMasterclassesContentTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: nonEmptyStringSchema,
    text: z.string().nullable().optional(),
  })
  .strict();
export const updateMasterclassesContentTranslationDtoSchema =
  createMasterclassesContentTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createMasterclassesContentDtoSchema = z
  .object({
    images: stringArraySchema.default([]),
    videos: stringArraySchema.default([]),
    translations: z
      .array(createMasterclassesContentTranslationDtoSchema)
      .default([]),
  })
  .strict();
export const updateMasterclassesContentDtoSchema =
  createMasterclassesContentDtoSchema
    .partial()
    .extend({
      translations: z
        .array(updateMasterclassesContentTranslationDtoSchema)
        .optional(),
    })
    .strict();
