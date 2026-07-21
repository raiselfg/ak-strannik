import { z } from 'zod';
import {
  eventTranslationSchema,
  eventsContentEventSchema,
  eventsContentSchema,
} from './events.schemas';
import {
  createEventTranslationDtoSchema,
  createEventsContentDtoSchema,
  createEventsContentEventDtoSchema,
  updateEventTranslationDtoSchema,
  updateEventsContentDtoSchema,
  updateEventsContentEventDtoSchema,
} from './events.dto';

export type EventTranslation = z.infer<typeof eventTranslationSchema>;
export type EventsContentEvent = z.infer<typeof eventsContentEventSchema>;
export type EventsContent = z.infer<typeof eventsContentSchema>;
export type CreateEventTranslationDto = z.infer<
  typeof createEventTranslationDtoSchema
>;
export type UpdateEventTranslationDto = z.infer<
  typeof updateEventTranslationDtoSchema
>;
export type CreateEventsContentEventDto = z.infer<
  typeof createEventsContentEventDtoSchema
>;
export type UpdateEventsContentEventDto = z.infer<
  typeof updateEventsContentEventDtoSchema
>;
export type CreateEventsContentDto = z.infer<
  typeof createEventsContentDtoSchema
>;
export type UpdateEventsContentDto = z.infer<
  typeof updateEventsContentDtoSchema
>;
