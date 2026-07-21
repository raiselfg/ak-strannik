import { z } from 'zod';
import {
  ustaContentSchema,
  ustaContentTranslationSchema,
} from './usta.schemas';
import * as dto from './usta.dto';

export type UstaContent = z.infer<typeof ustaContentSchema>;
export type UstaContentTranslation = z.infer<
  typeof ustaContentTranslationSchema
>;
export type CreateUstaContentDto = z.infer<
  typeof dto.createUstaContentDtoSchema
>;
export type UpdateUstaContentDto = z.infer<
  typeof dto.updateUstaContentDtoSchema
>;
export type CreateUstaContentTranslationDto = z.infer<
  typeof dto.createUstaContentTranslationDtoSchema
>;
export type UpdateUstaContentTranslationDto = z.infer<
  typeof dto.updateUstaContentTranslationDtoSchema
>;
