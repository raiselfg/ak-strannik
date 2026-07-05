import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';

import type { AuthActions } from '../features/auth/model/auth-context';

type RouterContext = {
  auth: Pick<AuthActions, 'checkSession'>;
};

function PendingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/30">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <LoaderCircle className="size-5 animate-spin" />
        Проверяем сессию…
      </div>
    </main>
  );
}

function RootErrorScreen({ reset }: ErrorComponentProps) {
  const router = useRouter();

  const retry = async () => {
    reset();
    await router.invalidate();
  };

  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 p-6">
      <div className="max-w-md space-y-3 text-center">
        <h1 className="text-xl font-semibold">Не удалось загрузить страницу</h1>
        <p className="text-sm text-muted-foreground">
          Проверьте подключение и повторите попытку.
        </p>
        <button
          type="button"
          className="text-sm font-medium underline underline-offset-4"
          onClick={retry}
        >
          Повторить
        </button>
      </div>
    </main>
  );
}

function NotFoundScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 p-6">
      <div className="max-w-md space-y-3 text-center">
        <h1 className="text-xl font-semibold">Страница не найдена</h1>
        <p className="text-sm text-muted-foreground">
          Проверьте адрес или вернитесь на главную страницу.
        </p>
        <Link
          className="text-sm font-medium underline underline-offset-4"
          to="/"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
  pendingComponent: PendingScreen,
  errorComponent: RootErrorScreen,
  notFoundComponent: NotFoundScreen,
});
