import { z } from 'zod';
import { nonEmptyStringSchema } from '../common/primitives.schema';

export const createThankYouNoteContentDtoSchema = z
  .object({
    image: nonEmptyStringSchema,
  })
  .strict();

export const updateThankYouNoteContentDtoSchema =
  createThankYouNoteContentDtoSchema.partial().strict();
