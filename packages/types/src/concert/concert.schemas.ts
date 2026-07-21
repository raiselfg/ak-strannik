import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const concertContentTranslationSchema = z
  .object({
    id: idSchema,
    concertContentId: idSchema,
    locale: localeSchema,
    title: z.string().nullable(),
    text: z.string().nullable(),
    duration: z.string().nullable(),
  })
  .strict();

export const concertContentSchema = z
  .object({
    id: idSchema,
    images: stringArraySchema,
    videos: stringArraySchema,
    translations: z.array(concertContentTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
