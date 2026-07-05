import type { AdminMeResponse } from '@ak-strannik/types';
import { queryOptions } from '@tanstack/react-query';

import { ApiError } from '../../../shared/api/api-error';
import { authApi } from '../api/auth.api';
import { setCsrfToken } from './auth-store';

export const AUTH_QUERY_KEY = ['admin', 'auth', 'session'] as const;

export async function getSession(
  signal?: AbortSignal
): Promise<AdminMeResponse | null> {
  try {
    const session = await authApi.me(signal);
    setCsrfToken(session.csrfToken);
    return session;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      setCsrfToken(null);
      return null;
    }

    throw error;
  }
}

export function authSessionQueryOptions() {
  return queryOptions({
    queryKey: AUTH_QUERY_KEY,
    queryFn: ({ signal }) => getSession(signal),
    // Authentication is volatile and must be checked at every route boundary.
    staleTime: 0,
    retry: false,
  });
}
