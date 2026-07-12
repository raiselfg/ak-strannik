import { z } from 'zod';
import { IdSchema, DateTimeSchema, SortOrderSchema } from './common';

export const PartnerSchema = z.object({
  id: IdSchema,
  logoId: IdSchema.nullable(),
  websiteUrl: z.string().nullable(),
  sortOrder: SortOrderSchema,
  isActive: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export const CreatePartnerDtoSchema = z.object({
  logoId: IdSchema.nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: z.boolean().optional(),
});
export const UpdatePartnerDtoSchema = CreatePartnerDtoSchema.partial();
export const FindOnePartnerDtoSchema = z.object({ id: IdSchema });
export const DeletePartnerDtoSchema = FindOnePartnerDtoSchema;
export type Partner = z.infer<typeof PartnerSchema>;
export type CreatePartnerDto = z.infer<typeof CreatePartnerDtoSchema>;
export type UpdatePartnerDto = z.infer<typeof UpdatePartnerDtoSchema>;
export type FindOnePartnerDto = z.infer<typeof FindOnePartnerDtoSchema>;
export type DeletePartnerDto = z.infer<typeof DeletePartnerDtoSchema>;
