import { z } from 'zod';
import {
  attractionContentSchema,
  attractionContentTranslationSchema,
} from './attraction.schemas';
import * as dto from './attraction.dto';

export type AttractionContent = z.infer<typeof attractionContentSchema>;
export type AttractionContentTranslation = z.infer<
  typeof attractionContentTranslationSchema
>;
export type CreateAttractionContentDto = z.infer<
  typeof dto.createAttractionContentDtoSchema
>;
export type UpdateAttractionContentDto = z.infer<
  typeof dto.updateAttractionContentDtoSchema
>;
export type CreateAttractionContentTranslationDto = z.infer<
  typeof dto.createAttractionContentTranslationDtoSchema
>;
export type UpdateAttractionContentTranslationDto = z.infer<
  typeof dto.updateAttractionContentTranslationDtoSchema
>;
