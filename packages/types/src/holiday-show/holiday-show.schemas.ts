import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const holidayShowContentTranslationSchema = z
  .object({
    id: idSchema,
    holidayShowContentId: idSchema,
    locale: localeSchema,
    title: nonEmptyStringSchema,
  })
  .strict();

export const holidayShowContentSchema = z
  .object({
    id: idSchema,
    images: stringArraySchema,
    translations: z.array(holidayShowContentTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
