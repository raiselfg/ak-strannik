import { z } from 'zod';
import {
  dateTimeSchema,
  idSchema,
  nonEmptyStringSchema,
} from '../common/primitives.schema';

export const thankYouNoteContentSchema = z
  .object({
    id: idSchema,
    image: nonEmptyStringSchema,
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
  })
  .strict();
