import { z } from 'zod';
import { IdSchema } from './common';
import { LocaleSchema } from './enums';

export const TeamMemberTranslationSchema = z.object({
  id: IdSchema,
  teamMemberId: IdSchema,
  locale: LocaleSchema,
  name: z.string(),
  role: z.string().nullable(),
  description: z.string().nullable(),
});
export const CreateTeamMemberTranslationDtoSchema =
  TeamMemberTranslationSchema.pick({
    teamMemberId: true,
    locale: true,
    name: true,
    role: true,
    description: true,
  }).partial({ role: true, description: true });
export const UpdateTeamMemberTranslationDtoSchema =
  CreateTeamMemberTranslationDtoSchema.partial();
export const FindOneTeamMemberTranslationDtoSchema = z.object({ id: IdSchema });
export const DeleteTeamMemberTranslationDtoSchema =
  FindOneTeamMemberTranslationDtoSchema;
export type TeamMemberTranslation = z.infer<typeof TeamMemberTranslationSchema>;
export type CreateTeamMemberTranslationDto = z.infer<
  typeof CreateTeamMemberTranslationDtoSchema
>;
export type UpdateTeamMemberTranslationDto = z.infer<
  typeof UpdateTeamMemberTranslationDtoSchema
>;
export type FindOneTeamMemberTranslationDto = z.infer<
  typeof FindOneTeamMemberTranslationDtoSchema
>;
export type DeleteTeamMemberTranslationDto = z.infer<
  typeof DeleteTeamMemberTranslationDtoSchema
>;
