import { ApiErrorSchema, type ApiFieldErrors } from '@ak-strannik/types'

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fields?: ApiFieldErrors

  constructor(options: {
    status: number
    code: string
    message: string
    fields?: ApiFieldErrors
    cause?: unknown
  }) {
    super(options.message, { cause: options.cause })
    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
    this.fields = options.fields
  }
}

type FetchLikeError = {
  data?: unknown
  response?: {
    status?: number
    _data?: unknown
  }
}

export function normalizeApiError(error: unknown, fallbackStatus = 0): ApiError {
  if (error instanceof ApiError) return error

  const fetchError = error as FetchLikeError
  const status = fetchError.response?.status ?? fallbackStatus
  const payload = fetchError.data ?? fetchError.response?._data
  const parsed = ApiErrorSchema.safeParse(payload)

  if (parsed.success) {
    return new ApiError({
      status,
      code: parsed.data.error,
      message: parsed.data.message,
      fields: parsed.data.fields,
      cause: error,
    })
  }

  return new ApiError({
    status,
    code: status === 0 ? 'network_error' : 'unexpected_error',
    message:
      status === 0
        ? 'Не удалось связаться с сервером'
        : 'Сервер вернул неожиданный ответ',
    cause: error,
  })
}
