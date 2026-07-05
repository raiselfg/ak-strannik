import type { AdminLoginRequest, AdminMeResponse } from '@ak-strannik/types';
import { createContext } from 'react';

import type { AuthStatus } from './auth-store';

export type AdminUser = Omit<AdminMeResponse, 'csrfToken'>;

export type AuthState = {
  user: AdminUser | null;
  status: AuthStatus;
  bootstrapError: Error | null;
  isLoginPending: boolean;
  isLogoutPending: boolean;
};

export type AuthActions = {
  checkSession: () => Promise<AdminMeResponse | null>;
  login: (input: AdminLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => Promise<void>;
};

export const AuthStateContext = createContext<AuthState | null>(null);
export const AuthActionsContext = createContext<AuthActions | null>(null);
