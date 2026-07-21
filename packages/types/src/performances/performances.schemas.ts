import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
  positionSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const performancesContentTranslationSchema = z
  .object({
    id: idSchema,
    performancesContentId: idSchema,
    locale: localeSchema,
    title: nonEmptyStringSchema,
  })
  .strict();

export const performancePersonTranslationSchema = z
  .object({
    id: idSchema,
    performancePersonId: idSchema,
    locale: localeSchema,
    name: nonEmptyStringSchema,
  })
  .strict();

export const performancePersonSchema = z
  .object({
    id: idSchema,
    performancesContentId: idSchema,
    position: positionSchema,
    translations: z.array(performancePersonTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();

export const performancesContentSchema = z
  .object({
    id: idSchema,
    images: stringArraySchema,
    videos: stringArraySchema,
    translations: z.array(performancesContentTranslationSchema),
    persons: z.array(performancePersonSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
