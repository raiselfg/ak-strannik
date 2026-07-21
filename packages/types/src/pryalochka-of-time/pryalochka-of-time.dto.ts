import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  idSchema,
  nonEmptyStringSchema,
  positionSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const createPryalochkaOfTimeEventTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    text: nonEmptyStringSchema,
  })
  .strict();
export const updatePryalochkaOfTimeEventTranslationDtoSchema =
  createPryalochkaOfTimeEventTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createPryalochkaOfTimeEventDtoSchema = z
  .object({
    position: positionSchema,
    image: nonEmptyStringSchema,
    link: z.string().nullable().optional(),
    translations: z
      .array(createPryalochkaOfTimeEventTranslationDtoSchema)
      .default([]),
  })
  .strict();
export const updatePryalochkaOfTimeEventDtoSchema =
  createPryalochkaOfTimeEventDtoSchema
    .partial()
    .extend({
      id: idSchema.optional(),
      translations: z
        .array(updatePryalochkaOfTimeEventTranslationDtoSchema)
        .optional(),
    })
    .strict();

export const createPryalochkaOfTimeActorTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    name: nonEmptyStringSchema,
    text: nonEmptyStringSchema,
  })
  .strict();
export const updatePryalochkaOfTimeActorTranslationDtoSchema =
  createPryalochkaOfTimeActorTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createPryalochkaOfTimeActorDtoSchema = z
  .object({
    position: positionSchema,
    translations: z
      .array(createPryalochkaOfTimeActorTranslationDtoSchema)
      .default([]),
  })
  .strict();
export const updatePryalochkaOfTimeActorDtoSchema =
  createPryalochkaOfTimeActorDtoSchema
    .partial()
    .extend({
      id: idSchema.optional(),
      translations: z
        .array(updatePryalochkaOfTimeActorTranslationDtoSchema)
        .optional(),
    })
    .strict();

export const createPryalochkaOfTimeContentDtoSchema = z
  .object({
    images: stringArraySchema.default([]),
    events: z.array(createPryalochkaOfTimeEventDtoSchema).default([]),
    actors: z.array(createPryalochkaOfTimeActorDtoSchema).default([]),
  })
  .strict();
export const updatePryalochkaOfTimeContentDtoSchema =
  createPryalochkaOfTimeContentDtoSchema
    .partial()
    .extend({
      events: z.array(updatePryalochkaOfTimeEventDtoSchema).optional(),
      actors: z.array(updatePryalochkaOfTimeActorDtoSchema).optional(),
    })
    .strict();
