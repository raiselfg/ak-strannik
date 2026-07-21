import { z } from 'zod';
import {
  mascotCostumeContentSchema,
  mascotCostumeContentTranslationSchema,
} from './mascot-costume.schemas';
import * as dto from './mascot-costume.dto';

export type MascotCostumeContent = z.infer<typeof mascotCostumeContentSchema>;
export type MascotCostumeContentTranslation = z.infer<
  typeof mascotCostumeContentTranslationSchema
>;
export type CreateMascotCostumeContentDto = z.infer<
  typeof dto.createMascotCostumeContentDtoSchema
>;
export type UpdateMascotCostumeContentDto = z.infer<
  typeof dto.updateMascotCostumeContentDtoSchema
>;
export type CreateMascotCostumeContentTranslationDto = z.infer<
  typeof dto.createMascotCostumeContentTranslationDtoSchema
>;
export type UpdateMascotCostumeContentTranslationDto = z.infer<
  typeof dto.updateMascotCostumeContentTranslationDtoSchema
>;
