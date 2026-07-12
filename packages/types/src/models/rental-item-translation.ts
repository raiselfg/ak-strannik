import { z } from 'zod';
import { IdSchema } from './common';
import { LocaleSchema } from './enums';

export const RentalItemTranslationSchema = z.object({
  id: IdSchema,
  rentalItemId: IdSchema,
  locale: LocaleSchema,
  title: z.string(),
  description: z.string().nullable(),
  priceText: z.string().nullable(),
});
export const CreateRentalItemTranslationDtoSchema =
  RentalItemTranslationSchema.pick({
    rentalItemId: true,
    locale: true,
    title: true,
    description: true,
    priceText: true,
  }).partial({ description: true, priceText: true });
export const UpdateRentalItemTranslationDtoSchema =
  CreateRentalItemTranslationDtoSchema.partial();
export const FindOneRentalItemTranslationDtoSchema = z.object({ id: IdSchema });
export const DeleteRentalItemTranslationDtoSchema =
  FindOneRentalItemTranslationDtoSchema;
export type RentalItemTranslation = z.infer<typeof RentalItemTranslationSchema>;
export type CreateRentalItemTranslationDto = z.infer<
  typeof CreateRentalItemTranslationDtoSchema
>;
export type UpdateRentalItemTranslationDto = z.infer<
  typeof UpdateRentalItemTranslationDtoSchema
>;
export type FindOneRentalItemTranslationDto = z.infer<
  typeof FindOneRentalItemTranslationDtoSchema
>;
export type DeleteRentalItemTranslationDto = z.infer<
  typeof DeleteRentalItemTranslationDtoSchema
>;
