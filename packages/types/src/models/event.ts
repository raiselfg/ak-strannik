import { z } from 'zod';
import { IdSchema, DateTimeSchema, SortOrderSchema } from './common';
import { ContentStatusSchema } from './enums';

export const EventSchema = z.object({
  id: IdSchema,
  slug: z.string(),
  status: ContentStatusSchema,
  eventYear: z.number().int().nullable(),
  startDate: DateTimeSchema.nullable(),
  endDate: DateTimeSchema.nullable(),
  projectId: IdSchema.nullable(),
  coverImageId: IdSchema.nullable(),
  sortOrder: SortOrderSchema,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
  publishedAt: DateTimeSchema.nullable(),
});
export const CreateEventDtoSchema = z.object({
  slug: z.string(),
  status: ContentStatusSchema.optional(),
  eventYear: z.number().int().nullable().optional(),
  startDate: DateTimeSchema.nullable().optional(),
  endDate: DateTimeSchema.nullable().optional(),
  projectId: IdSchema.nullable().optional(),
  coverImageId: IdSchema.nullable().optional(),
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
