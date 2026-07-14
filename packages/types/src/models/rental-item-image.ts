import { z } from 'zod';
import { IdSchema, SortOrderSchema } from './common';

export const RentalItemImageSchema = z.object({
  id: IdSchema,
  rentalItemId: IdSchema,
  mediaId: IdSchema,
  sortOrder: SortOrderSchema,
});
export const CreateRentalItemImageDtoSchema = RentalItemImageSchema.omit({
  id: true,
});
export const UpdateRentalItemImageDtoSchema =
  CreateRentalItemImageDtoSchema.partial();
export const FindOneRentalItemImageDtoSchema = z.object({ id: IdSchema });
export const DeleteRentalItemImageDtoSchema = FindOneRentalItemImageDtoSchema;
export type RentalItemImage = z.infer<typeof RentalItemImageSchema>;
export type CreateRentalItemImageDto = z.infer<
  typeof CreateRentalItemImageDtoSchema
>;
export type UpdateRentalItemImageDto = z.infer<
  typeof UpdateRentalItemImageDtoSchema
>;
export type FindOneRentalItemImageDto = z.infer<
  typeof FindOneRentalItemImageDtoSchema
>;
export type DeleteRentalItemImageDto = z.infer<
  typeof DeleteRentalItemImageDtoSchema
>;
