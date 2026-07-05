import { AdminMeResponseSchema } from '@ak-strannik/types';
import { QueryClient } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '../../../shared/api/api-error';
import { authApi } from '../api/auth.api';
import { getCsrfToken, setCsrfToken } from './auth-store';
import {
  AUTH_QUERY_KEY,
  authSessionQueryOptions,
  getSession,
} from './auth-session';

vi.mock('../api/auth.api', () => ({
  authApi: {
    me: vi.fn(),
  },
}));

const meMock = vi.mocked(authApi.me);

afterEach(() => {
  meMock.mockReset();
  setCsrfToken(null);
});

describe('admin session lifecycle', () => {
  it('restores the CSRF token from the session response after reload', async () => {
    const controller = new AbortController();
    meMock.mockResolvedValue({
      authenticated: true,
      login: 'admin@example.com',
      csrfToken: 'fresh-token',
    });

    const session = await getSession(controller.signal);

    expect(meMock).toHaveBeenCalledWith(controller.signal);
    expect(session?.login).toBe('admin@example.com');
    expect(getCsrfToken()).toBe('fresh-token');
  });

  it('clears the CSRF token when the server reports an expired session', async () => {
    setCsrfToken('stale-token');
    meMock.mockRejectedValue(
      new ApiError({
        status: 401,
        code: 'unauthorized',
        message: 'Unauthorized',
      })
    );

    await expect(getSession()).resolves.toBeNull();
    expect(getCsrfToken()).toBeNull();
  });

  it('requires /me to provide a CSRF token', () => {
    expect(() =>
      AdminMeResponseSchema.parse({
        authenticated: true,
        login: 'admin@example.com',
      })
    ).toThrow();
  });

  it('keeps session data immediately stale for protected-route checks', () => {
    expect(authSessionQueryOptions().staleTime).toBe(0);
  });

  it('does not restore stale session data after cancellation', async () => {
    const queryClient = new QueryClient();
    let completeRequest: (() => void) | undefined;

    meMock.mockImplementation(
      (signal) =>
        new Promise((resolve, reject) => {
          completeRequest = () =>
            resolve({
              authenticated: true,
              login: 'admin@example.com',
              csrfToken: 'stale-token',
            });
          signal?.addEventListener('abort', () => reject(signal.reason), {
            once: true,
          });
        })
    );

    const request = queryClient
      .fetchQuery(authSessionQueryOptions())
      .catch(() => null);
    await vi.waitFor(() => expect(meMock).toHaveBeenCalledOnce());

    await queryClient.cancelQueries({ queryKey: AUTH_QUERY_KEY, exact: true });
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    completeRequest?.();
    await request;

    expect(queryClient.getQueryData(AUTH_QUERY_KEY)).toBeNull();
    expect(getCsrfToken()).toBeNull();
  });
});
