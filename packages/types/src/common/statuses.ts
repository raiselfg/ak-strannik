import { z } from 'zod';

export const EntityStatusSchema = z.enum(['active', 'archived']);
export type EntityStatus = z.infer<typeof EntityStatusSchema>;

export const TranslationStatusSchema = z.enum([
  'draft',
  'review',
  'published',
  'archived',
]);
export type TranslationStatus = z.infer<typeof TranslationStatusSchema>;
