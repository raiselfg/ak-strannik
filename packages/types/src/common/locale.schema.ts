import { z } from 'zod';

export const localeSchema = z.enum(['ru', 'en']);

export type Locale = z.infer<typeof localeSchema>;
