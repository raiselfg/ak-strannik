import { z } from 'zod';

export const idSchema = z.uuid();
export const dateTimeSchema = z.date();
export const nonEmptyStringSchema = z.string().trim().min(1);
export const stringArraySchema = z.array(nonEmptyStringSchema);
export const positionSchema = z.number().int().nonnegative();
export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug');
