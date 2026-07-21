import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
  positionSchema,
  slugSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const festivalContentTranslationSchema = z
  .object({
    id: idSchema,
    festivalContentId: idSchema,
    locale: localeSchema,
    title: nonEmptyStringSchema,
  })
  .strict();

export const festivalEventTranslationSchema = z
  .object({
    id: idSchema,
    festivalEventId: idSchema,
    locale: localeSchema,
    title: nonEmptyStringSchema,
    text: nonEmptyStringSchema,
  })
  .strict();

export const festivalEventSchema = z
  .object({
    id: idSchema,
    festivalContentId: idSchema,
    position: positionSchema,
    translations: z.array(festivalEventTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();

export const festivalNominationsTranslationSchema = z
  .object({
    id: idSchema,
    festivalNominationsId: idSchema,
    locale: localeSchema,
    title: nonEmptyStringSchema,
    text: nonEmptyStringSchema,
  })
  .strict();

export const festivalNominationsSchema = z
  .object({
    id: idSchema,
    festivalContentId: idSchema,
    translations: z.array(festivalNominationsTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();

export const festivalJuryTranslationSchema = z
  .object({
    id: idSchema,
    festivalJuryId: idSchema,
    locale: localeSchema,
    title: nonEmptyStringSchema,
  })
  .strict();

export const festivalJuryPersonTranslationSchema = z
  .object({
    id: idSchema,
    festivalJuryPersonId: idSchema,
    locale: localeSchema,
    name: nonEmptyStringSchema,
    position: nonEmptyStringSchema,
  })
  .strict();

export const festivalJuryPersonSchema = z
  .object({
    id: idSchema,
    festivalJuryId: idSchema,
    position: positionSchema,
    image: nonEmptyStringSchema,
    translations: z.array(festivalJuryPersonTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();

export const festivalJurySchema = z
  .object({
    id: idSchema,
    festivalContentId: idSchema,
    translations: z.array(festivalJuryTranslationSchema),
    persons: z.array(festivalJuryPersonSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();

export const festivalOrganizationsTranslationSchema = z
  .object({
    id: idSchema,
    festivalOrganizationsId: idSchema,
    locale: localeSchema,
    title: nonEmptyStringSchema,
  })
  .strict();

export const festivalOrganizationTranslationSchema = z
  .object({
    id: idSchema,
    festivalOrganizationId: idSchema,
    locale: localeSchema,
    name: nonEmptyStringSchema,
  })
  .strict();

export const festivalOrganizationSchema = z
  .object({
    id: idSchema,
    festivalOrganizationsId: idSchema,
    position: positionSchema,
    value: nonEmptyStringSchema,
    translations: z.array(festivalOrganizationTranslationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();

export const festivalOrganizationsSchema = z
  .object({
    id: idSchema,
    festivalContentId: idSchema,
    translations: z.array(festivalOrganizationsTranslationSchema),
    organizations: z.array(festivalOrganizationSchema),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();

export const festivalContentSchema = z
  .object({
    id: idSchema,
    logo: nonEmptyStringSchema,
    slug: slugSchema,
    images: stringArraySchema,
    videos: stringArraySchema,
    achievements: stringArraySchema,
    socials: stringArraySchema,
    translations: z.array(festivalContentTranslationSchema),
    events: z.array(festivalEventSchema),
    nominations: festivalNominationsSchema.nullable(),
    jury: festivalJurySchema.nullable(),
    organizations: festivalOrganizationsSchema.nullable(),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
