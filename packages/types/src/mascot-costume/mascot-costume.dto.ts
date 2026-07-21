import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import { idSchema, nonEmptyStringSchema } from '../common/primitives.schema';

export const createMascotCostumeContentTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    text: nonEmptyStringSchema,
  })
  .strict();
export const updateMascotCostumeContentTranslationDtoSchema =
  createMascotCostumeContentTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createMascotCostumeContentDtoSchema = z
  .object({
    image: nonEmptyStringSchema,
    translations: z
      .array(createMascotCostumeContentTranslationDtoSchema)
      .default([]),
  })
  .strict();
export const updateMascotCostumeContentDtoSchema =
  createMascotCostumeContentDtoSchema
    .partial()
    .extend({
      translations: z
        .array(updateMascotCostumeContentTranslationDtoSchema)
        .optional(),
    })
    .strict();
