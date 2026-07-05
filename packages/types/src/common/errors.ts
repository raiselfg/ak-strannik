import { z } from 'zod'

import { ApiFieldErrorsSchema } from './primitives'

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  fields: ApiFieldErrorsSchema.optional(),
})

export type ApiErrorResponse = z.infer<typeof ApiErrorSchema>

export const ValidationErrorSchema = ApiErrorSchema.extend({
  error: z.literal('validation_error'),
  fields: ApiFieldErrorsSchema,
})

export type ValidationErrorResponse = z.infer<typeof ValidationErrorSchema>
