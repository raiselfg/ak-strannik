import { z } from 'zod';
import { thankYouNoteContentSchema } from './thank-you-note.schemas';
import {
  createThankYouNoteContentDtoSchema,
  updateThankYouNoteContentDtoSchema,
} from './thank-you-note.dto';

export type ThankYouNoteContent = z.infer<typeof thankYouNoteContentSchema>;
export type CreateThankYouNoteContentDto = z.infer<
  typeof createThankYouNoteContentDtoSchema
>;
export type UpdateThankYouNoteContentDto = z.infer<
  typeof updateThankYouNoteContentDtoSchema
>;
