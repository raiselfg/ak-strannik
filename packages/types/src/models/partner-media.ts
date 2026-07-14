import { z } from 'zod';
import { IdSchema, SortOrderSchema } from './common';

export const PartnerMediaSchema = z.object({
  id: IdSchema,
  partnerId: IdSchema,
  mediaId: IdSchema,
  sortOrder: SortOrderSchema,
});
export const CreatePartnerMediaDtoSchema = PartnerMediaSchema.omit({
  id: true,
});
export const UpdatePartnerMediaDtoSchema =
  CreatePartnerMediaDtoSchema.partial();
export const FindOnePartnerMediaDtoSchema = z.object({ id: IdSchema });
export const DeletePartnerMediaDtoSchema = FindOnePartnerMediaDtoSchema;
export type PartnerMedia = z.infer<typeof PartnerMediaSchema>;
export type CreatePartnerMediaDto = z.infer<typeof CreatePartnerMediaDtoSchema>;
export type UpdatePartnerMediaDto = z.infer<typeof UpdatePartnerMediaDtoSchema>;
export type FindOnePartnerMediaDto = z.infer<
  typeof FindOnePartnerMediaDtoSchema
>;
export type DeletePartnerMediaDto = z.infer<typeof DeletePartnerMediaDtoSchema>;
