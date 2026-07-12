import { z } from 'zod';
import { IdSchema, DateTimeSchema, SortOrderSchema } from './common';

export const TeamMemberSchema = z.object({
  id: IdSchema,
  imageId: IdSchema.nullable(),
  sortOrder: SortOrderSchema,
  isActive: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export const CreateTeamMemberDtoSchema = z.object({
  imageId: IdSchema.nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: z.boolean().optional(),
});
export const UpdateTeamMemberDtoSchema = CreateTeamMemberDtoSchema.partial();
export const FindOneTeamMemberDtoSchema = z.object({ id: IdSchema });
export const DeleteTeamMemberDtoSchema = FindOneTeamMemberDtoSchema;
export type TeamMember = z.infer<typeof TeamMemberSchema>;
export type CreateTeamMemberDto = z.infer<typeof CreateTeamMemberDtoSchema>;
export type UpdateTeamMemberDto = z.infer<typeof UpdateTeamMemberDtoSchema>;
export type FindOneTeamMemberDto = z.infer<typeof FindOneTeamMemberDtoSchema>;
export type DeleteTeamMemberDto = z.infer<typeof DeleteTeamMemberDtoSchema>;
