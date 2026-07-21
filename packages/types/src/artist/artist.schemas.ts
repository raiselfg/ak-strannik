import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const artistContentTranslationSchema = z
  .object({
    id: idSchema,
    artistContentId: idSchema,
    locale: localeSchema,
    title: z.string().nullable(),
    text: z.string().nullable(),
  })
  .strict();

export const artistContentSchema = z
  .object({
    id: idSchema,
    images: stringArraySchema,
    videos: stringArraySchema,
    translations: z.array(artistContentTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
