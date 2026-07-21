import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
  positionSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const eventTranslationSchema = z
  .object({
    id: idSchema,
    eventId: idSchema,
    locale: localeSchema,
    text: nonEmptyStringSchema,
  })
  .strict();

export const eventsContentEventSchema = z
  .object({
    id: idSchema,
    eventsContentId: idSchema,
    position: positionSchema,
    images: stringArraySchema,
    videos: stringArraySchema,
    translations: z.array(eventTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();

export const eventsContentSchema = z
  .object({
    id: idSchema,
    year: nonEmptyStringSchema,
    events: z.array(eventsContentEventSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
