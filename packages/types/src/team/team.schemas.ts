import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const teamMemberTranslationSchema = z
  .object({
    id: idSchema,
    teamMemberId: idSchema,
    locale: localeSchema,
    name: nonEmptyStringSchema,
    role: nonEmptyStringSchema,
    bio: nonEmptyStringSchema,
  })
  .strict();

export const teamMemberSchema = z
  .object({
    id: idSchema,
    image: nonEmptyStringSchema,
    links: stringArraySchema,
    achievements: stringArraySchema,
    translations: z.array(teamMemberTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
