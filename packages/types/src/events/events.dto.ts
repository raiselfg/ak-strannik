import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  idSchema,
  nonEmptyStringSchema,
  positionSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const createEventTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    text: nonEmptyStringSchema,
  })
  .strict();

export const updateEventTranslationDtoSchema = createEventTranslationDtoSchema
  .partial()
  .extend({ id: idSchema.optional() })
  .strict();

export const createEventsContentEventDtoSchema = z
  .object({
    position: positionSchema,
    images: stringArraySchema.default([]),
    videos: stringArraySchema.default([]),
    translations: z.array(createEventTranslationDtoSchema).default([]),
  })
  .strict();

export const updateEventsContentEventDtoSchema =
  createEventsContentEventDtoSchema
    .partial()
    .extend({
      id: idSchema.optional(),
      translations: z.array(updateEventTranslationDtoSchema).optional(),
    })
    .strict();

export const createEventsContentDtoSchema = z
  .object({
    year: nonEmptyStringSchema,
    events: z.array(createEventsContentEventDtoSchema).default([]),
  })
  .strict();

export const updateEventsContentDtoSchema = createEventsContentDtoSchema
  .partial()
  .extend({ events: z.array(updateEventsContentEventDtoSchema).optional() })
  .strict();
