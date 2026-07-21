import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
} from '../common/primitives.schema';

export const attractionContentTranslationSchema = z
  .object({
    id: idSchema,
    attractionContentId: idSchema,
    locale: localeSchema,
    text: nonEmptyStringSchema,
  })
  .strict();

export const attractionContentSchema = z
  .object({
    id: idSchema,
    image: nonEmptyStringSchema,
    translations: z.array(attractionContentTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
