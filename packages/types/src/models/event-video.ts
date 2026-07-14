import { z } from 'zod';
import { IdSchema, SortOrderSchema } from './common';
import { VideoProviderSchema } from './enums';

export const EventVideoSchema = z.object({
  id: IdSchema,
  eventId: IdSchema,
  provider: VideoProviderSchema,
  url: z.string(),
  sortOrder: SortOrderSchema,
});
export const CreateEventVideoDtoSchema = EventVideoSchema.omit({ id: true });
export const UpdateEventVideoDtoSchema = CreateEventVideoDtoSchema.partial();
export const FindOneEventVideoDtoSchema = z.object({ id: IdSchema });
export const DeleteEventVideoDtoSchema = FindOneEventVideoDtoSchema;
export type EventVideo = z.infer<typeof EventVideoSchema>;
export type CreateEventVideoDto = z.infer<typeof CreateEventVideoDtoSchema>;
export type UpdateEventVideoDto = z.infer<typeof UpdateEventVideoDtoSchema>;
export type FindOneEventVideoDto = z.infer<typeof FindOneEventVideoDtoSchema>;
export type DeleteEventVideoDto = z.infer<typeof DeleteEventVideoDtoSchema>;
