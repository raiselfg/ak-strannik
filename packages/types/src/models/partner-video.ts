import { z } from 'zod';
import { IdSchema, SortOrderSchema } from './common';
import { VideoProviderSchema } from './enums';

export const PartnerVideoSchema = z.object({
  id: IdSchema,
  partnerId: IdSchema,
  provider: VideoProviderSchema,
  url: z.string(),
  sortOrder: SortOrderSchema,
});
export const CreatePartnerVideoDtoSchema = PartnerVideoSchema.omit({
  id: true,
});
export const UpdatePartnerVideoDtoSchema =
  CreatePartnerVideoDtoSchema.partial();
export const FindOnePartnerVideoDtoSchema = z.object({ id: IdSchema });
export const DeletePartnerVideoDtoSchema = FindOnePartnerVideoDtoSchema;
export type PartnerVideo = z.infer<typeof PartnerVideoSchema>;
export type CreatePartnerVideoDto = z.infer<typeof CreatePartnerVideoDtoSchema>;
export type UpdatePartnerVideoDto = z.infer<typeof UpdatePartnerVideoDtoSchema>;
export type FindOnePartnerVideoDto = z.infer<
  typeof FindOnePartnerVideoDtoSchema
>;
export type DeletePartnerVideoDto = z.infer<typeof DeletePartnerVideoDtoSchema>;
