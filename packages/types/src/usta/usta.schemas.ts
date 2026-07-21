import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const ustaContentTranslationSchema = z
  .object({
    id: idSchema,
    ustaContentId: idSchema,
    locale: localeSchema,
    text: nonEmptyStringSchema,
  })
  .strict();

export const ustaContentSchema = z
  .object({
    id: idSchema,
    videos: stringArraySchema,
    images: stringArraySchema,
    achievements: stringArraySchema,
    translations: z.array(ustaContentTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
