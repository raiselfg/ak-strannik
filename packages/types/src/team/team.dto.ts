import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const createTeamMemberTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    name: nonEmptyStringSchema,
    role: nonEmptyStringSchema,
    bio: nonEmptyStringSchema,
  })
  .strict();
export const updateTeamMemberTranslationDtoSchema =
  createTeamMemberTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createTeamMemberDtoSchema = z
  .object({
    image: nonEmptyStringSchema,
    links: stringArraySchema.default([]),
    achievements: stringArraySchema.default([]),
    translations: z.array(createTeamMemberTranslationDtoSchema).default([]),
  })
  .strict();
export const updateTeamMemberDtoSchema = createTeamMemberDtoSchema
  .partial()
  .extend({
    translations: z.array(updateTeamMemberTranslationDtoSchema).optional(),
  })
  .strict();
