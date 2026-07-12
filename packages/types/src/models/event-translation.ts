import { z } from 'zod';
import { IdSchema } from './common';
import { LocaleSchema } from './enums';

export const EventTranslationSchema = z.object({
  id: IdSchema,
  eventId: IdSchema,
  locale: LocaleSchema,
  title: z.string(),
  excerpt: z.string().nullable(),
  body: z.string().nullable(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
});
export const CreateEventTranslationDtoSchema = EventTranslationSchema.pick({
  eventId: true,
  locale: true,
  title: true,
  excerpt: true,
  body: true,
  seoTitle: true,
  seoDescription: true,
}).partial({
  excerpt: true,
  body: true,
  seoTitle: true,
  seoDescription: true,
});
export const UpdateEventTranslationDtoSchema =
  CreateEventTranslationDtoSchema.partial();
export const FindOneEventTranslationDtoSchema = z.object({ id: IdSchema });
export const DeleteEventTranslationDtoSchema = FindOneEventTranslationDtoSchema;
export type EventTranslation = z.infer<typeof EventTranslationSchema>;
export type CreateEventTranslationDto = z.infer<
  typeof CreateEventTranslationDtoSchema
>;
export type UpdateEventTranslationDto = z.infer<
  typeof UpdateEventTranslationDtoSchema
>;
export type FindOneEventTranslationDto = z.infer<
  typeof FindOneEventTranslationDtoSchema
>;
export type DeleteEventTranslationDto = z.infer<
  typeof DeleteEventTranslationDtoSchema
>;
