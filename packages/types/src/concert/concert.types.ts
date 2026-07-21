import { z } from 'zod';
import {
  concertContentSchema,
  concertContentTranslationSchema,
} from './concert.schemas';
import {
  createConcertContentDtoSchema,
  createConcertContentTranslationDtoSchema,
  updateConcertContentDtoSchema,
  updateConcertContentTranslationDtoSchema,
} from './concert.dto';

export type ConcertContent = z.infer<typeof concertContentSchema>;
export type ConcertContentTranslation = z.infer<
  typeof concertContentTranslationSchema
>;
export type CreateConcertContentDto = z.infer<
  typeof createConcertContentDtoSchema
>;
export type UpdateConcertContentDto = z.infer<
  typeof updateConcertContentDtoSchema
>;
export type CreateConcertContentTranslationDto = z.infer<
  typeof createConcertContentTranslationDtoSchema
>;
export type UpdateConcertContentTranslationDto = z.infer<
  typeof updateConcertContentTranslationDtoSchema
>;
