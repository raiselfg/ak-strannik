import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
  positionSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const pryalochkaOfTimeEventTranslationSchema = z
  .object({
    id: idSchema,
    pryalochkaOfTimeEventId: idSchema,
    locale: localeSchema,
    text: nonEmptyStringSchema,
  })
  .strict();

export const pryalochkaOfTimeEventSchema = z
  .object({
    id: idSchema,
    pryalochkaOfTimeContentId: idSchema,
    position: positionSchema,
    image: nonEmptyStringSchema,
    link: z.string().nullable(),
    translations: z.array(pryalochkaOfTimeEventTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();

export const pryalochkaOfTimeActorTranslationSchema = z
  .object({
    id: idSchema,
    pryalochkaOfTimeActorId: idSchema,
    locale: localeSchema,
    name: nonEmptyStringSchema,
    text: nonEmptyStringSchema,
  })
  .strict();

export const pryalochkaOfTimeActorSchema = z
  .object({
    id: idSchema,
    pryalochkaOfTimeContentId: idSchema,
    position: positionSchema,
    translations: z.array(pryalochkaOfTimeActorTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();

export const pryalochkaOfTimeContentSchema = z
  .object({
    id: idSchema,
    images: stringArraySchema,
    events: z.array(pryalochkaOfTimeEventSchema),
    actors: z.array(pryalochkaOfTimeActorSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
