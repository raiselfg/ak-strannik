import { z } from 'zod';
import {
  masterclassesContentSchema,
  masterclassesContentTranslationSchema,
} from './masterclasses.schemas';
import {
  createMasterclassesContentDtoSchema,
  createMasterclassesContentTranslationDtoSchema,
  updateMasterclassesContentDtoSchema,
  updateMasterclassesContentTranslationDtoSchema,
} from './masterclasses.dto';

export type MasterclassesContent = z.infer<typeof masterclassesContentSchema>;
export type MasterclassesContentTranslation = z.infer<
  typeof masterclassesContentTranslationSchema
>;
export type CreateMasterclassesContentDto = z.infer<
  typeof createMasterclassesContentDtoSchema
>;
export type UpdateMasterclassesContentDto = z.infer<
  typeof updateMasterclassesContentDtoSchema
>;
export type CreateMasterclassesContentTranslationDto = z.infer<
  typeof createMasterclassesContentTranslationDtoSchema
>;
export type UpdateMasterclassesContentTranslationDto = z.infer<
  typeof updateMasterclassesContentTranslationDtoSchema
>;
