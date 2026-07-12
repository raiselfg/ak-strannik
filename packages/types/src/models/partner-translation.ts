import { z } from 'zod';
import { IdSchema } from './common';
import { LocaleSchema } from './enums';

export const PartnerTranslationSchema = z.object({
  id: IdSchema,
  partnerId: IdSchema,
  locale: LocaleSchema,
  name: z.string(),
  description: z.string().nullable(),
});
export const CreatePartnerTranslationDtoSchema = PartnerTranslationSchema.pick({
  partnerId: true,
  locale: true,
  name: true,
  description: true,
}).partial({ description: true });
export const UpdatePartnerTranslationDtoSchema =
  CreatePartnerTranslationDtoSchema.partial();
export const FindOnePartnerTranslationDtoSchema = z.object({ id: IdSchema });
export const DeletePartnerTranslationDtoSchema =
  FindOnePartnerTranslationDtoSchema;
export type PartnerTranslation = z.infer<typeof PartnerTranslationSchema>;
export type CreatePartnerTranslationDto = z.infer<
  typeof CreatePartnerTranslationDtoSchema
>;
export type UpdatePartnerTranslationDto = z.infer<
  typeof UpdatePartnerTranslationDtoSchema
>;
export type FindOnePartnerTranslationDto = z.infer<
  typeof FindOnePartnerTranslationDtoSchema
>;
export type DeletePartnerTranslationDto = z.infer<
  typeof DeletePartnerTranslationDtoSchema
>;
