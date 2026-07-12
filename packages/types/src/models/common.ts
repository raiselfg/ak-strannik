import { z } from 'zod';

export const IdSchema = z.uuid();
export const DateTimeSchema = z.date();
export const SortOrderSchema = z.number().int();

export const EntityIdDtoSchema = z.object({ id: IdSchema });
export type EntityIdDto = z.infer<typeof EntityIdDtoSchema>;
