import { z } from 'zod';
import { IdSchema } from './common';
import { LocaleSchema } from './enums';

export const ProjectSectionTranslationSchema = z.object({
  id: IdSchema,
  sectionId: IdSchema,
  locale: LocaleSchema,
  title: z.string().nullable(),
  subtitle: z.string().nullable(),
  body: z.string().nullable(),
  author: z.string().nullable(),
});
export const CreateProjectSectionTranslationDtoSchema =
  ProjectSectionTranslationSchema.pick({
    sectionId: true,
    locale: true,
    title: true,
    subtitle: true,
    body: true,
    author: true,
  }).partial({ title: true, subtitle: true, body: true, author: true });
export const UpdateProjectSectionTranslationDtoSchema =
  CreateProjectSectionTranslationDtoSchema.partial();
export const FindOneProjectSectionTranslationDtoSchema = z.object({
  id: IdSchema,
});
export const DeleteProjectSectionTranslationDtoSchema =
  FindOneProjectSectionTranslationDtoSchema;
export type ProjectSectionTranslation = z.infer<
  typeof ProjectSectionTranslationSchema
>;
export type CreateProjectSectionTranslationDto = z.infer<
  typeof CreateProjectSectionTranslationDtoSchema
>;
export type UpdateProjectSectionTranslationDto = z.infer<
  typeof UpdateProjectSectionTranslationDtoSchema
>;
export type FindOneProjectSectionTranslationDto = z.infer<
  typeof FindOneProjectSectionTranslationDtoSchema
>;
export type DeleteProjectSectionTranslationDto = z.infer<
  typeof DeleteProjectSectionTranslationDtoSchema
>;
