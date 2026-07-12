import { z } from 'zod';
import { IdSchema } from './common';
import { LocaleSchema } from './enums';

export const CertificateTranslationSchema = z.object({
  id: IdSchema,
  certificateId: IdSchema,
  locale: LocaleSchema,
  title: z.string().nullable(),
  issuer: z.string().nullable(),
  description: z.string().nullable(),
});
export const CreateCertificateTranslationDtoSchema =
  CertificateTranslationSchema.pick({
    certificateId: true,
    locale: true,
    title: true,
    issuer: true,
    description: true,
  }).partial({ title: true, issuer: true, description: true });
export const UpdateCertificateTranslationDtoSchema =
  CreateCertificateTranslationDtoSchema.partial();
export const FindOneCertificateTranslationDtoSchema = z.object({
  id: IdSchema,
});
export const DeleteCertificateTranslationDtoSchema =
  FindOneCertificateTranslationDtoSchema;
export type CertificateTranslation = z.infer<
  typeof CertificateTranslationSchema
>;
export type CreateCertificateTranslationDto = z.infer<
  typeof CreateCertificateTranslationDtoSchema
>;
export type UpdateCertificateTranslationDto = z.infer<
  typeof UpdateCertificateTranslationDtoSchema
>;
export type FindOneCertificateTranslationDto = z.infer<
  typeof FindOneCertificateTranslationDtoSchema
>;
export type DeleteCertificateTranslationDto = z.infer<
  typeof DeleteCertificateTranslationDtoSchema
>;
