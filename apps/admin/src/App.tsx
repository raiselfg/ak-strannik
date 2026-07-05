import { createRouter, RouterProvider } from '@tanstack/react-router';
import { useEffect } from 'react';

import { useAuthActions } from './features/auth/hooks/use-auth';
import { setUnauthorizedHandler } from './features/auth/model/auth-store';
import { routeTree } from './routeTree.gen';

const router = createRouter({
  routeTree,
  context: { auth: undefined! },
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const auth = useAuthActions();
  const { clearAuth } = auth;

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await clearAuth();
      await router.navigate({ to: '/login', replace: true });
    });

    return () => setUnauthorizedHandler(null);
  }, [clearAuth]);

  return <RouterProvider router={router} context={{ auth }} />;
}
