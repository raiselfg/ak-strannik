import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const masterclassesContentTranslationSchema = z
  .object({
    id: idSchema,
    masterclassesContentId: idSchema,
    locale: localeSchema,
    title: nonEmptyStringSchema,
    text: z.string().nullable(),
  })
  .strict();

export const masterclassesContentSchema = z
  .object({
    id: idSchema,
    images: stringArraySchema,
    videos: stringArraySchema,
    translations: z.array(masterclassesContentTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
