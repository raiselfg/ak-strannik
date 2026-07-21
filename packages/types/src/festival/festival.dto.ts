import { z } from 'zod';
import { localeSchema } from '../common/locale.schema';
import {
  idSchema,
  nonEmptyStringSchema,
  positionSchema,
  slugSchema,
  stringArraySchema,
} from '../common/primitives.schema';

export const createFestivalContentTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: nonEmptyStringSchema,
  })
  .strict();
export const updateFestivalContentTranslationDtoSchema =
  createFestivalContentTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createFestivalEventTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: nonEmptyStringSchema,
    text: nonEmptyStringSchema,
  })
  .strict();
export const updateFestivalEventTranslationDtoSchema =
  createFestivalEventTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createFestivalEventDtoSchema = z
  .object({
    position: positionSchema,
    translations: z.array(createFestivalEventTranslationDtoSchema).default([]),
  })
  .strict();
export const updateFestivalEventDtoSchema = createFestivalEventDtoSchema
  .partial()
  .extend({
    id: idSchema.optional(),
    translations: z.array(updateFestivalEventTranslationDtoSchema).optional(),
  })
  .strict();

export const createFestivalNominationsTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: nonEmptyStringSchema,
    text: nonEmptyStringSchema,
  })
  .strict();
export const updateFestivalNominationsTranslationDtoSchema =
  createFestivalNominationsTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createFestivalNominationsDtoSchema = z
  .object({
    translations: z
      .array(createFestivalNominationsTranslationDtoSchema)
      .default([]),
  })
  .strict();
export const updateFestivalNominationsDtoSchema =
  createFestivalNominationsDtoSchema
    .partial()
    .extend({
      id: idSchema.optional(),
      translations: z
        .array(updateFestivalNominationsTranslationDtoSchema)
        .optional(),
    })
    .strict();

export const createFestivalJuryTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: nonEmptyStringSchema,
  })
  .strict();
export const updateFestivalJuryTranslationDtoSchema =
  createFestivalJuryTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createFestivalJuryPersonTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    name: nonEmptyStringSchema,
    position: nonEmptyStringSchema,
  })
  .strict();
export const updateFestivalJuryPersonTranslationDtoSchema =
  createFestivalJuryPersonTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createFestivalJuryPersonDtoSchema = z
  .object({
    position: positionSchema,
    image: nonEmptyStringSchema,
    translations: z
      .array(createFestivalJuryPersonTranslationDtoSchema)
      .default([]),
  })
  .strict();
export const updateFestivalJuryPersonDtoSchema =
  createFestivalJuryPersonDtoSchema
    .partial()
    .extend({
      id: idSchema.optional(),
      translations: z
        .array(updateFestivalJuryPersonTranslationDtoSchema)
        .optional(),
    })
    .strict();

export const createFestivalJuryDtoSchema = z
  .object({
    translations: z.array(createFestivalJuryTranslationDtoSchema).default([]),
    persons: z.array(createFestivalJuryPersonDtoSchema).default([]),
  })
  .strict();
export const updateFestivalJuryDtoSchema = createFestivalJuryDtoSchema
  .partial()
  .extend({
    id: idSchema.optional(),
    translations: z.array(updateFestivalJuryTranslationDtoSchema).optional(),
    persons: z.array(updateFestivalJuryPersonDtoSchema).optional(),
  })
  .strict();

export const createFestivalOrganizationsTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    title: nonEmptyStringSchema,
  })
  .strict();
export const updateFestivalOrganizationsTranslationDtoSchema =
  createFestivalOrganizationsTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createFestivalOrganizationTranslationDtoSchema = z
  .object({
    locale: localeSchema,
    name: nonEmptyStringSchema,
  })
  .strict();
export const updateFestivalOrganizationTranslationDtoSchema =
  createFestivalOrganizationTranslationDtoSchema
    .partial()
    .extend({ id: idSchema.optional() })
    .strict();

export const createFestivalOrganizationDtoSchema = z
  .object({
    position: positionSchema,
    value: nonEmptyStringSchema,
    translations: z
      .array(createFestivalOrganizationTranslationDtoSchema)
      .default([]),
  })
  .strict();
export const updateFestivalOrganizationDtoSchema =
  createFestivalOrganizationDtoSchema
    .partial()
    .extend({
      id: idSchema.optional(),
      translations: z
        .array(updateFestivalOrganizationTranslationDtoSchema)
        .optional(),
    })
    .strict();

export const createFestivalOrganizationsDtoSchema = z
  .object({
    translations: z
      .array(createFestivalOrganizationsTranslationDtoSchema)
      .default([]),
    organizations: z.array(createFestivalOrganizationDtoSchema).default([]),
  })
  .strict();
export const updateFestivalOrganizationsDtoSchema =
  createFestivalOrganizationsDtoSchema
    .partial()
    .extend({
      id: idSchema.optional(),
      translations: z
        .array(updateFestivalOrganizationsTranslationDtoSchema)
        .optional(),
      organizations: z.array(updateFestivalOrganizationDtoSchema).optional(),
    })
    .strict();

export const createFestivalContentDtoSchema = z
  .object({
    logo: nonEmptyStringSchema,
    slug: slugSchema,
    images: stringArraySchema.default([]),
    videos: stringArraySchema.default([]),
    achievements: stringArraySchema.default([]),
    socials: stringArraySchema.default([]),
    translations: z
      .array(createFestivalContentTranslationDtoSchema)
      .default([]),
    events: z.array(createFestivalEventDtoSchema).default([]),
    nominations: createFestivalNominationsDtoSchema.nullable().optional(),
    jury: createFestivalJuryDtoSchema.nullable().optional(),
    organizations: createFestivalOrganizationsDtoSchema.nullable().optional(),
  })
  .strict();

export const updateFestivalContentDtoSchema = createFestivalContentDtoSchema
  .partial()
  .extend({
    translations: z.array(updateFestivalContentTranslationDtoSchema).optional(),
    events: z.array(updateFestivalEventDtoSchema).optional(),
    nominations: updateFestivalNominationsDtoSchema.nullable().optional(),
    jury: updateFestivalJuryDtoSchema.nullable().optional(),
    organizations: updateFestivalOrganizationsDtoSchema.nullable().optional(),
  })
  .strict();
