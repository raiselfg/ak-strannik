import { z } from 'zod';
import { IdSchema, SortOrderSchema } from './common';

export const ProjectSectionMediaSchema = z.object({
  id: IdSchema,
  sectionId: IdSchema,
  mediaId: IdSchema,
  sortOrder: SortOrderSchema,
});
export const CreateProjectSectionMediaDtoSchema = z.object({
  sectionId: IdSchema,
  mediaId: IdSchema,
  sortOrder: SortOrderSchema.optional(),
});
export const UpdateProjectSectionMediaDtoSchema =
  CreateProjectSectionMediaDtoSchema.partial();
export const FindOneProjectSectionMediaDtoSchema = z.object({ id: IdSchema });
export const DeleteProjectSectionMediaDtoSchema =
  FindOneProjectSectionMediaDtoSchema;
export type ProjectSectionMedia = z.infer<typeof ProjectSectionMediaSchema>;
export type CreateProjectSectionMediaDto = z.infer<
  typeof CreateProjectSectionMediaDtoSchema
>;
export type UpdateProjectSectionMediaDto = z.infer<
  typeof UpdateProjectSectionMediaDtoSchema
>;
export type FindOneProjectSectionMediaDto = z.infer<
  typeof FindOneProjectSectionMediaDtoSchema
>;
export type DeleteProjectSectionMediaDto = z.infer<
  typeof DeleteProjectSectionMediaDtoSchema
>;
