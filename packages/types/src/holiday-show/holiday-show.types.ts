import { z } from 'zod';
import {
  holidayShowContentSchema,
  holidayShowContentTranslationSchema,
} from './holiday-show.schemas';
import {
  createHolidayShowContentDtoSchema,
  createHolidayShowContentTranslationDtoSchema,
  updateHolidayShowContentDtoSchema,
  updateHolidayShowContentTranslationDtoSchema,
} from './holiday-show.dto';

export type HolidayShowContent = z.infer<typeof holidayShowContentSchema>;
export type HolidayShowContentTranslation = z.infer<
  typeof holidayShowContentTranslationSchema
>;
export type CreateHolidayShowContentDto = z.infer<
  typeof createHolidayShowContentDtoSchema
>;
export type UpdateHolidayShowContentDto = z.infer<
  typeof updateHolidayShowContentDtoSchema
>;
export type CreateHolidayShowContentTranslationDto = z.infer<
  typeof createHolidayShowContentTranslationDtoSchema
>;
export type UpdateHolidayShowContentTranslationDto = z.infer<
  typeof updateHolidayShowContentTranslationDtoSchema
>;
