import { z } from 'zod';
import { IdSchema, DateTimeSchema, SortOrderSchema } from './common';
import { RentalTypeSchema } from './enums';

export const RentalItemSchema = z.object({
  id: IdSchema,
  slug: z.string(),
  type: RentalTypeSchema,
  imageId: IdSchema.nullable(),
  sortOrder: SortOrderSchema,
  isActive: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export const CreateRentalItemDtoSchema = z.object({
  slug: z.string(),
  type: RentalTypeSchema,
  imageId: IdSchema.nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: z.boolean().optional(),
});
export const UpdateRentalItemDtoSchema = CreateRentalItemDtoSchema.partial();
export const FindOneRentalItemDtoSchema = z.object({ id: IdSchema });
export const DeleteRentalItemDtoSchema = FindOneRentalItemDtoSchema;
export type RentalItem = z.infer<typeof RentalItemSchema>;
export type CreateRentalItemDto = z.infer<typeof CreateRentalItemDtoSchema>;
export type UpdateRentalItemDto = z.infer<typeof UpdateRentalItemDtoSchema>;
export type FindOneRentalItemDto = z.infer<typeof FindOneRentalItemDtoSchema>;
export type DeleteRentalItemDto = z.infer<typeof DeleteRentalItemDtoSchema>;
