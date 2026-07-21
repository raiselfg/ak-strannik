import { z } from 'zod';
import {
  partnerContentSchema,
  partnerContentTranslationSchema,
} from './partner.schemas';
import {
  createPartnerContentDtoSchema,
  createPartnerContentTranslationDtoSchema,
  updatePartnerContentDtoSchema,
  updatePartnerContentTranslationDtoSchema,
} from './partner.dto';

export type PartnerContent = z.infer<typeof partnerContentSchema>;
export type PartnerContentTranslation = z.infer<
  typeof partnerContentTranslationSchema
>;
export type CreatePartnerContentDto = z.infer<
  typeof createPartnerContentDtoSchema
>;
export type UpdatePartnerContentDto = z.infer<
  typeof updatePartnerContentDtoSchema
>;
export type CreatePartnerContentTranslationDto = z.infer<
  typeof createPartnerContentTranslationDtoSchema
>;
export type UpdatePartnerContentTranslationDto = z.infer<
  typeof updatePartnerContentTranslationDtoSchema
>;
