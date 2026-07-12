import { z } from 'zod';
import { IdSchema, SortOrderSchema } from './common';

export const EventImageSchema = z.object({
  id: IdSchema,
  eventId: IdSchema,
  mediaId: IdSchema,
  sortOrder: SortOrderSchema,
});
export const CreateEventImageDtoSchema = z.object({
  eventId: IdSchema,
  mediaId: IdSchema,
  sortOrder: SortOrderSchema.optional(),
});
export const UpdateEventImageDtoSchema = CreateEventImageDtoSchema.partial();
export const FindOneEventImageDtoSchema = z.object({ id: IdSchema });
export const DeleteEventImageDtoSchema = FindOneEventImageDtoSchema;
export type EventImage = z.infer<typeof EventImageSchema>;
export type CreateEventImageDto = z.infer<typeof CreateEventImageDtoSchema>;
export type UpdateEventImageDto = z.infer<typeof UpdateEventImageDtoSchema>;
export type FindOneEventImageDto = z.infer<typeof FindOneEventImageDtoSchema>;
export type DeleteEventImageDto = z.infer<typeof DeleteEventImageDtoSchema>;
