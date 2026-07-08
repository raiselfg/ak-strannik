import { z } from 'zod';

import { EntityStatusSchema, TranslationStatusSchema } from './statuses';

const optionalSearchString = z.preprocess(
  (value) => (value === '' || value == null ? undefined : value),
  z.string().trim().optional()
);

const optionalEnum = <T extends z.core.util.EnumLike>(schema: z.ZodEnum<T>) =>
  z.preprocess(
    (value) => (value === '' || value == null ? undefined : value),
    schema.optional()
  );

export const SortOrderSchema = z.enum(['asc', 'desc']);
export type SortOrder = z.infer<typeof SortOrderSchema>;

export const AdminListSearchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1).default(1),
  pageSize: z.coerce.number().int().min(10).max(100).catch(20).default(20),
  search: optionalSearchString,
  sortBy: optionalSearchString,
  sortOrder: optionalEnum(SortOrderSchema),
  status: optionalEnum(EntityStatusSchema),
  locale: optionalSearchString,
  translationStatus: optionalEnum(TranslationStatusSchema),
});

export type AdminListSearch = z.infer<typeof AdminListSearchSchema>;

export function parseAdminListSearch(input: unknown): AdminListSearch {
  return AdminListSearchSchema.parse(input);
}
