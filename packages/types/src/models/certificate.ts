import { z } from 'zod';
import { IdSchema, DateTimeSchema, SortOrderSchema } from './common';

export const CertificateSchema = z.object({
  id: IdSchema,
  imageId: IdSchema,
  year: z.number().int().nullable(),
  sortOrder: SortOrderSchema,
  isActive: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export const CreateCertificateDtoSchema = z.object({
  imageId: IdSchema,
  year: z.number().int().nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: z.boolean().optional(),
});
export const UpdateCertificateDtoSchema = CreateCertificateDtoSchema.partial();
export const FindOneCertificateDtoSchema = z.object({ id: IdSchema });
export const DeleteCertificateDtoSchema = FindOneCertificateDtoSchema;
export type Certificate = z.infer<typeof CertificateSchema>;
export type CreateCertificateDto = z.infer<typeof CreateCertificateDtoSchema>;
export type UpdateCertificateDto = z.infer<typeof UpdateCertificateDtoSchema>;
export type FindOneCertificateDto = z.infer<typeof FindOneCertificateDtoSchema>;
export type DeleteCertificateDto = z.infer<typeof DeleteCertificateDtoSchema>;
