import { z } from 'zod';
import {
  exhibitionContentSchema,
  exhibitionContentTranslationSchema,
} from './exhibition.schemas';
import {
  createExhibitionContentDtoSchema,
  createExhibitionContentTranslationDtoSchema,
  updateExhibitionContentDtoSchema,
  updateExhibitionContentTranslationDtoSchema,
} from './exhibition.dto';

export type ExhibitionContent = z.infer<typeof exhibitionContentSchema>;
export type ExhibitionContentTranslation = z.infer<
  typeof exhibitionContentTranslationSchema
>;
export type CreateExhibitionContentDto = z.infer<
  typeof createExhibitionContentDtoSchema
>;
export type UpdateExhibitionContentDto = z.infer<
  typeof updateExhibitionContentDtoSchema
>;
export type CreateExhibitionContentTranslationDto = z.infer<
  typeof createExhibitionContentTranslationDtoSchema
>;
export type UpdateExhibitionContentTranslationDto = z.infer<
  typeof updateExhibitionContentTranslationDtoSchema
>;
