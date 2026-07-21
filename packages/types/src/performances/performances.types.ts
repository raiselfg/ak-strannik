import { z } from 'zod';
import {
  performancePersonSchema,
  performancePersonTranslationSchema,
  performancesContentSchema,
  performancesContentTranslationSchema,
} from './performances.schemas';
import * as dto from './performances.dto';

export type PerformancesContent = z.infer<typeof performancesContentSchema>;
export type PerformancesContentTranslation = z.infer<
  typeof performancesContentTranslationSchema
>;
export type PerformancePerson = z.infer<typeof performancePersonSchema>;
export type PerformancePersonTranslation = z.infer<
  typeof performancePersonTranslationSchema
>;
export type CreatePerformancesContentDto = z.infer<
  typeof dto.createPerformancesContentDtoSchema
>;
export type UpdatePerformancesContentDto = z.infer<
  typeof dto.updatePerformancesContentDtoSchema
>;
export type CreatePerformancesContentTranslationDto = z.infer<
  typeof dto.createPerformancesContentTranslationDtoSchema
>;
export type UpdatePerformancesContentTranslationDto = z.infer<
  typeof dto.updatePerformancesContentTranslationDtoSchema
>;
export type CreatePerformancePersonDto = z.infer<
  typeof dto.createPerformancePersonDtoSchema
>;
export type UpdatePerformancePersonDto = z.infer<
  typeof dto.updatePerformancePersonDtoSchema
>;
export type CreatePerformancePersonTranslationDto = z.infer<
  typeof dto.createPerformancePersonTranslationDtoSchema
>;
export type UpdatePerformancePersonTranslationDto = z.infer<
  typeof dto.updatePerformancePersonTranslationDtoSchema
>;
