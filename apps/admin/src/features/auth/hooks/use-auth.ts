import { useContext } from 'react';

import { AuthActionsContext, AuthStateContext } from '../model/auth-context';

export function useAuthState() {
  const context = useContext(AuthStateContext);

  if (!context) {
    throw new Error('useAuthState must be used inside AuthProvider');
  }

  return context;
}

export function useAuthActions() {
  const context = useContext(AuthActionsContext);

  if (!context) {
    throw new Error('useAuthActions must be used inside AuthProvider');
  }

  return context;
}
