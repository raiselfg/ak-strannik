import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
  positionSchema,
} from '../common/primitives.schema';

export const requisiteContentTranslationSchema = z
  .object({
    id: idSchema,
    requisiteContentId: idSchema,
    locale: localeSchema,
    title: z.string().nullable(),
  })
  .strict();

export const requisiteItemTranslationSchema = z
  .object({
    id: idSchema,
    requisiteItemId: idSchema,
    locale: localeSchema,
    title: z.string().nullable(),
  })
  .strict();

export const requisiteItemSchema = z
  .object({
    id: idSchema,
    requisiteContentId: idSchema,
    position: positionSchema,
    image: nonEmptyStringSchema,
    translations: z.array(requisiteItemTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();

export const requisiteContentSchema = z
  .object({
    id: idSchema,
    translations: z.array(requisiteContentTranslationSchema),
    requisites: z.array(requisiteItemSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
