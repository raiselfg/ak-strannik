import { z } from 'zod';
import * as schemas from './requisite.schemas';
import * as dto from './requisite.dto';

export type RequisiteContent = z.infer<typeof schemas.requisiteContentSchema>;
export type RequisiteContentTranslation = z.infer<
  typeof schemas.requisiteContentTranslationSchema
>;
export type RequisiteItem = z.infer<typeof schemas.requisiteItemSchema>;
export type RequisiteItemTranslation = z.infer<
  typeof schemas.requisiteItemTranslationSchema
>;
export type CreateRequisiteContentDto = z.infer<
  typeof dto.createRequisiteContentDtoSchema
>;
export type UpdateRequisiteContentDto = z.infer<
  typeof dto.updateRequisiteContentDtoSchema
>;
export type CreateRequisiteContentTranslationDto = z.infer<
  typeof dto.createRequisiteContentTranslationDtoSchema
>;
export type UpdateRequisiteContentTranslationDto = z.infer<
  typeof dto.updateRequisiteContentTranslationDtoSchema
>;
export type CreateRequisiteItemDto = z.infer<
  typeof dto.createRequisiteItemDtoSchema
>;
export type UpdateRequisiteItemDto = z.infer<
  typeof dto.updateRequisiteItemDtoSchema
>;
export type CreateRequisiteItemTranslationDto = z.infer<
  typeof dto.createRequisiteItemTranslationDtoSchema
>;
export type UpdateRequisiteItemTranslationDto = z.infer<
  typeof dto.updateRequisiteItemTranslationDtoSchema
>;
