import { z } from 'zod';
import { IdSchema } from './common';
import { LocaleSchema } from './enums';

export const ProjectTranslationSchema = z.object({
  id: IdSchema,
  projectId: IdSchema,
  locale: LocaleSchema,
  title: z.string(),
  subtitle: z.string().nullable(),
  excerpt: z.string().nullable(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
});
export const CreateProjectTranslationDtoSchema = ProjectTranslationSchema.pick({
  projectId: true,
  locale: true,
  title: true,
  subtitle: true,
  excerpt: true,
  seoTitle: true,
  seoDescription: true,
}).partial({
  subtitle: true,
  excerpt: true,
  seoTitle: true,
  seoDescription: true,
});
export const UpdateProjectTranslationDtoSchema =
  CreateProjectTranslationDtoSchema.partial();
export const FindOneProjectTranslationDtoSchema = z.object({ id: IdSchema });
export const DeleteProjectTranslationDtoSchema =
  FindOneProjectTranslationDtoSchema;
export type ProjectTranslation = z.infer<typeof ProjectTranslationSchema>;
export type CreateProjectTranslationDto = z.infer<
  typeof CreateProjectTranslationDtoSchema
>;
export type UpdateProjectTranslationDto = z.infer<
  typeof UpdateProjectTranslationDtoSchema
>;
export type FindOneProjectTranslationDto = z.infer<
  typeof FindOneProjectTranslationDtoSchema
>;
export type DeleteProjectTranslationDto = z.infer<
  typeof DeleteProjectTranslationDtoSchema
>;
