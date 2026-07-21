import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const charityContentTranslationSchema = z
  .object({
    id: idSchema,
    charityContentId: idSchema,
    locale: localeSchema,
    title: nonEmptyStringSchema,
    text: z.string().nullable(),
  })
  .strict();

export const charityContentSchema = z
  .object({
    id: idSchema,
    images: stringArraySchema,
    videos: stringArraySchema,
    translations: z.array(charityContentTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
