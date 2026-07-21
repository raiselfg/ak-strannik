import { z } from 'zod';
import { teamMemberSchema, teamMemberTranslationSchema } from './team.schemas';
import * as dto from './team.dto';

export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamMemberTranslation = z.infer<typeof teamMemberTranslationSchema>;
export type CreateTeamMemberDto = z.infer<typeof dto.createTeamMemberDtoSchema>;
export type UpdateTeamMemberDto = z.infer<typeof dto.updateTeamMemberDtoSchema>;
export type CreateTeamMemberTranslationDto = z.infer<
  typeof dto.createTeamMemberTranslationDtoSchema
>;
export type UpdateTeamMemberTranslationDto = z.infer<
  typeof dto.updateTeamMemberTranslationDtoSchema
>;
