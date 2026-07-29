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

export const createTeamMemberLinkTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    label: nonEmptyStringSchema,
  })
  .strict();

export const createTeamMemberLinkDtoSchema = z
  .object({
    href: z.url(),
    translations: z
      .array(createTeamMemberLinkTranslationDtoSchema)
      .length(2)
      .refine(
        (translations) =>
          new Set(translations.map(({ locale }) => locale)).size === 2,
        { message: 'Добавьте подписи на русском и английском языках' }
      ),
  })
  .strict();

export const createTeamMemberDtoSchema = z
  .object({
    image: nonEmptyStringSchema,
    links: z.array(createTeamMemberLinkDtoSchema).default([]),
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
