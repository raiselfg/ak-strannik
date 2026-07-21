import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const createHolidayShowContentTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: nonEmptyStringSchema,
  })
  .strict();
export const updateHolidayShowContentTranslationDtoSchema =
  createHolidayShowContentTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createHolidayShowContentDtoSchema = z
  .object({
    images: stringArraySchema.default([]),
    translations: z
      .array(createHolidayShowContentTranslationDtoSchema)
      .default([]),
  })
  .strict();
export const updateHolidayShowContentDtoSchema =
  createHolidayShowContentDtoSchema
    .partial()
    .extend({
      translations: z
        .array(updateHolidayShowContentTranslationDtoSchema)
        .optional(),
    })
    .strict();
