import { z } from 'zod'

export const AuthenticatedSchema = z.literal(true)

export const ApiFieldErrorsSchema = z.record(z.string(), z.array(z.string()))

export type ApiFieldErrors = z.infer<typeof ApiFieldErrorsSchema>
