import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@ak-strannik/ui/components/sonner';
import type { PropsWithChildren } from 'react';

import { AuthProvider } from '../../features/auth/model/auth-provider';
import { queryClient } from './query-client';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}
