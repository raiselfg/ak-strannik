import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
} from '../common/primitives.schema';

export const mascotCostumeContentTranslationSchema = z
  .object({
    id: idSchema,
    mascotCostumeContentId: idSchema,
    locale: localeSchema,
    text: nonEmptyStringSchema,
  })
  .strict();

export const mascotCostumeContentSchema = z
  .object({
    id: idSchema,
    image: nonEmptyStringSchema,
    translations: z.array(mascotCostumeContentTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
