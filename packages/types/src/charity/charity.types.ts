import { z } from 'zod';
import {
  charityContentSchema,
  charityContentTranslationSchema,
} from './charity.schemas';
import {
  createCharityContentDtoSchema,
  createCharityContentTranslationDtoSchema,
  updateCharityContentDtoSchema,
  updateCharityContentTranslationDtoSchema,
} from './charity.dto';

export type CharityContent = z.infer<typeof charityContentSchema>;
export type CharityContentTranslation = z.infer<
  typeof charityContentTranslationSchema
>;
export type CreateCharityContentDto = z.infer<
  typeof createCharityContentDtoSchema
>;
export type UpdateCharityContentDto = z.infer<
  typeof updateCharityContentDtoSchema
>;
export type CreateCharityContentTranslationDto = z.infer<
  typeof createCharityContentTranslationDtoSchema
>;
export type UpdateCharityContentTranslationDto = z.infer<
  typeof updateCharityContentTranslationDtoSchema
>;
