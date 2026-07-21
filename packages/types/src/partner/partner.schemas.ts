import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const partnerContentTranslationSchema = z
  .object({
    id: idSchema,
    partnerContentId: idSchema,
    locale: localeSchema,
    title: nonEmptyStringSchema,
    text: z.string().nullable(),
  })
  .strict();

export const partnerContentSchema = z
  .object({
    id: idSchema,
    link: z.string().nullable(),
    images: stringArraySchema,
    translations: z.array(partnerContentTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
