import { z } from 'zod';
import { IdSchema, DateTimeSchema, SortOrderSchema } from './common';
import { ProjectSectionVariantSchema, VideoProviderSchema } from './enums';

export const ProjectSectionSchema = z.object({
  id: IdSchema,
  projectId: IdSchema,
  variant: ProjectSectionVariantSchema,
  videoProvider: VideoProviderSchema.nullable(),
  videoUrl: z.string().nullable(),
  sortOrder: SortOrderSchema,
  isActive: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export const CreateProjectSectionDtoSchema = z.object({
  projectId: IdSchema,
  variant: ProjectSectionVariantSchema.optional(),
  videoProvider: VideoProviderSchema.nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: z.boolean().optional(),
});
export const UpdateProjectSectionDtoSchema =
  CreateProjectSectionDtoSchema.partial();
export const FindOneProjectSectionDtoSchema = z.object({ id: IdSchema });
export const DeleteProjectSectionDtoSchema = FindOneProjectSectionDtoSchema;
export type ProjectSection = z.infer<typeof ProjectSectionSchema>;
export type CreateProjectSectionDto = z.infer<
  typeof CreateProjectSectionDtoSchema
>;
export type UpdateProjectSectionDto = z.infer<
  typeof UpdateProjectSectionDtoSchema
>;
export type FindOneProjectSectionDto = z.infer<
  typeof FindOneProjectSectionDtoSchema
>;
export type DeleteProjectSectionDto = z.infer<
  typeof DeleteProjectSectionDtoSchema
>;
