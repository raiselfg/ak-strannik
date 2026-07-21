import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const exhibitionContentTranslationSchema = z
  .object({
    id: idSchema,
    exhibitionContentId: idSchema,
    locale: localeSchema,
    title: nonEmptyStringSchema,
  })
  .strict();

export const exhibitionContentSchema = z
  .object({
    id: idSchema,
    images: stringArraySchema,
    translations: z.array(exhibitionContentTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
