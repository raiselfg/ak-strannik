import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const createPartnerContentTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: nonEmptyStringSchema,
    text: z.string().nullable().optional(),
  })
  .strict();

export const updatePartnerContentTranslationDtoSchema =
  createPartnerContentTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createPartnerContentDtoSchema = z
  .object({
    link: z.string().nullable().optional(),
    images: stringArraySchema.default([]),
    translations: z.array(createPartnerContentTranslationDtoSchema).default([]),
  })
  .strict();

export const updatePartnerContentDtoSchema = createPartnerContentDtoSchema
  .partial()
  .extend({
    translations: z.array(updatePartnerContentTranslationDtoSchema).optional(),
  })
  .strict();
