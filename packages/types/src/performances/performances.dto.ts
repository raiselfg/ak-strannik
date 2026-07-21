import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  idSchema,
  nonEmptyStringSchema,
  positionSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const createPerformancesContentTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: nonEmptyStringSchema,
  })
  .strict();
export const updatePerformancesContentTranslationDtoSchema =
  createPerformancesContentTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createPerformancePersonTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    name: nonEmptyStringSchema,
  })
  .strict();
export const updatePerformancePersonTranslationDtoSchema =
  createPerformancePersonTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createPerformancePersonDtoSchema = z
  .object({
    position: positionSchema,
    translations: z
      .array(createPerformancePersonTranslationDtoSchema)
      .default([]),
  })
  .strict();
export const updatePerformancePersonDtoSchema = createPerformancePersonDtoSchema
  .partial()
  .extend({
    id: idSchema.optional(),
    translations: z
      .array(updatePerformancePersonTranslationDtoSchema)
      .optional(),
  })
  .strict();

export const createPerformancesContentDtoSchema = z
  .object({
    images: stringArraySchema.default([]),
    videos: stringArraySchema.default([]),
    translations: z
      .array(createPerformancesContentTranslationDtoSchema)
      .default([]),
    persons: z.array(createPerformancePersonDtoSchema).default([]),
  })
  .strict();
export const updatePerformancesContentDtoSchema =
  createPerformancesContentDtoSchema
    .partial()
    .extend({
      translations: z
        .array(updatePerformancesContentTranslationDtoSchema)
        .optional(),
      persons: z.array(updatePerformancePersonDtoSchema).optional(),
    })
    .strict();
