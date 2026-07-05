import type { AdminLoginRequest, AdminMeResponse } from '@ak-strannik/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, type PropsWithChildren } from 'react';

import { authApi } from '../api/auth.api';
import type { AuthActions, AuthState } from './auth-context';
import { AuthActionsContext, AuthStateContext } from './auth-context';
import { AUTH_QUERY_KEY, authSessionQueryOptions } from './auth-session';
import { setCsrfToken, type AuthStatus } from './auth-store';

function toAdminUser(session: AdminMeResponse | null | undefined) {
  if (!session) return null;

  return {
    authenticated: session.authenticated,
    login: session.login,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const sessionQuery = useQuery(authSessionQueryOptions());

  const clearAuth = useCallback(async () => {
    await queryClient.cancelQueries({
      queryKey: AUTH_QUERY_KEY,
      exact: true,
    });
    setCsrfToken(null);
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
  }, [queryClient]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess(response, variables) {
      setCsrfToken(response.csrfToken);
      queryClient.setQueryData<AdminMeResponse>(AUTH_QUERY_KEY, {
        authenticated: true,
        login: variables.login,
        csrfToken: response.csrfToken,
      });
    },
  });
  const loginAsync = loginMutation.mutateAsync;

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: clearAuth,
  });
  const logoutAsync = logoutMutation.mutateAsync;

  const checkSession = useCallback(
    () => queryClient.fetchQuery(authSessionQueryOptions()),
    [queryClient]
  );

  const login = useCallback(
    async (input: AdminLoginRequest) => {
      await loginAsync(input);
    },
    [loginAsync]
  );

  const logout = useCallback(async () => {
    await logoutAsync();
  }, [logoutAsync]);

  const status: AuthStatus = sessionQuery.isPending
    ? 'checking'
    : sessionQuery.data
      ? 'authenticated'
      : 'unauthenticated';

  const state = useMemo<AuthState>(
    () => ({
      user: toAdminUser(sessionQuery.data),
      status,
      bootstrapError: sessionQuery.error,
      isLoginPending: loginMutation.isPending,
      isLogoutPending: logoutMutation.isPending,
    }),
    [
      sessionQuery.data,
      sessionQuery.error,
      status,
      loginMutation.isPending,
      logoutMutation.isPending,
    ]
  );

  const actions = useMemo<AuthActions>(
    () => ({ checkSession, login, logout, clearAuth }),
    [checkSession, login, logout, clearAuth]
  );

  return (
    <AuthActionsContext.Provider value={actions}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthActionsContext.Provider>
  );
}
