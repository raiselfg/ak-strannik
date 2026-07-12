import { z } from 'zod';
import { IdSchema, DateTimeSchema, SortOrderSchema } from './common';
import { ContentStatusSchema } from './enums';

export const EventSchema = z.object({
  id: IdSchema,
  slug: z.string(),
  status: ContentStatusSchema,
  eventDate: DateTimeSchema.nullable(),
  coverImageId: IdSchema.nullable(),
  youtubeUrl: z.string().nullable(),
  sortOrder: SortOrderSchema,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
  publishedAt: DateTimeSchema.nullable(),
});
export const CreateEventDtoSchema = z.object({
  slug: z.string(),
  status: ContentStatusSchema.optional(),
  eventDate: DateTimeSchema.nullable().optional(),
  coverImageId: IdSchema.nullable().optional(),
  youtubeUrl: z.string().nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  publishedAt: DateTimeSchema.nullable().optional(),
});
export const UpdateEventDtoSchema = CreateEventDtoSchema.partial();
export const FindOneEventDtoSchema = z.object({ id: IdSchema });
export const DeleteEventDtoSchema = FindOneEventDtoSchema;
export type Event = z.infer<typeof EventSchema>;
export type CreateEventDto = z.infer<typeof CreateEventDtoSchema>;
export type UpdateEventDto = z.infer<typeof UpdateEventDtoSchema>;
export type FindOneEventDto = z.infer<typeof FindOneEventDtoSchema>;
export type DeleteEventDto = z.infer<typeof DeleteEventDtoSchema>;
