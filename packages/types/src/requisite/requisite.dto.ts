import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  idSchema,
  nonEmptyStringSchema,
  positionSchema,
} from '../common/primitives.schema';

export const createRequisiteContentTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: z.string().nullable().optional(),
  })
  .strict();
export const updateRequisiteContentTranslationDtoSchema =
  createRequisiteContentTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createRequisiteItemTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: z.string().nullable().optional(),
  })
  .strict();
export const updateRequisiteItemTranslationDtoSchema =
  createRequisiteItemTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createRequisiteItemDtoSchema = z
  .object({
    position: positionSchema,
    image: nonEmptyStringSchema,
    translations: z.array(createRequisiteItemTranslationDtoSchema).default([]),
  })
  .strict();
export const updateRequisiteItemDtoSchema = createRequisiteItemDtoSchema
  .partial()
  .extend({
    id: idSchema.optional(),
    translations: z.array(updateRequisiteItemTranslationDtoSchema).optional(),
  })
  .strict();

export const createRequisiteContentDtoSchema = z
  .object({
    translations: z
      .array(createRequisiteContentTranslationDtoSchema)
      .default([]),
    requisites: z.array(createRequisiteItemDtoSchema).default([]),
  })
  .strict();
export const updateRequisiteContentDtoSchema = createRequisiteContentDtoSchema
  .partial()
  .extend({
    translations: z
      .array(updateRequisiteContentTranslationDtoSchema)
      .optional(),
    requisites: z.array(updateRequisiteItemDtoSchema).optional(),
  })
  .strict();
