import { z } from 'zod';
import { IdSchema, DateTimeSchema, SortOrderSchema } from './common';
import { ContentStatusSchema, ProjectTypeSchema } from './enums';

export const ProjectSchema = z.object({
  id: IdSchema,
  slug: z.string(),
  type: ProjectTypeSchema,
  status: ContentStatusSchema,
  coverImageId: IdSchema.nullable(),
  sortOrder: SortOrderSchema,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
  publishedAt: DateTimeSchema.nullable(),
});
export const CreateProjectDtoSchema = z.object({
  slug: z.string(),
  type: ProjectTypeSchema,
  status: ContentStatusSchema.optional(),
  coverImageId: IdSchema.nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  publishedAt: DateTimeSchema.nullable().optional(),
});
export const UpdateProjectDtoSchema = CreateProjectDtoSchema.partial();
export const FindOneProjectDtoSchema = z.object({ id: IdSchema });
export const DeleteProjectDtoSchema = FindOneProjectDtoSchema;
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProjectDto = z.infer<typeof CreateProjectDtoSchema>;
export type UpdateProjectDto = z.infer<typeof UpdateProjectDtoSchema>;
export type FindOneProjectDto = z.infer<typeof FindOneProjectDtoSchema>;
export type DeleteProjectDto = z.infer<typeof DeleteProjectDtoSchema>;
