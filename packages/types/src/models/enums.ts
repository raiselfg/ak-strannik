import { z } from 'zod';

export const LocaleSchema = z.enum(['ru', 'en']);
export const ContentStatusSchema = z.enum(['draft', 'published', 'archived']);
export const RentalTypeSchema = z.enum(['mascot', 'attraction', 'props']);
export const ProjectTypeSchema = z.enum([
  'musical',
  'singer',
  'exhibition',
  'newYearShow',
  'masterClass',
  'performance',
  'artist',
  'concertProgram',
  'festival',
  'charity',
  'other',
]);
export const ProjectSectionVariantSchema = z.enum([
  'content',
  'split',
  'gallery',
  'slider',
  'youtube',
  'quote',
]);

export type Locale = z.infer<typeof LocaleSchema>;
export type ContentStatus = z.infer<typeof ContentStatusSchema>;
export type RentalType = z.infer<typeof RentalTypeSchema>;
export type ProjectType = z.infer<typeof ProjectTypeSchema>;
export type ProjectSectionVariant = z.infer<typeof ProjectSectionVariantSchema>;
