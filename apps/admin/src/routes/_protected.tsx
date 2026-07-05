import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { Button } from '@ak-strannik/ui/components/button';
import { toast } from '@ak-strannik/ui/components/sonner';
import { LogOut } from 'lucide-react';

import { useAuthActions, useAuthState } from '../features/auth/hooks/use-auth';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context }) => {
    const user = await context.auth.checkSession();
    if (!user) {
      throw redirect({
        to: '/login',
        replace: true,
      });
    }
  },
  component: ProtectedShell,
});

function ProtectedShell() {
  const { logout } = useAuthActions();
  const { isLogoutPending } = useAuthState();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error('Не удалось завершить сессию на сервере');
    } finally {
      await navigate({ to: '/login', replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="text-lg font-semibold">AK Strannik Admin</span>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={isLogoutPending}
          >
            <LogOut />
            Выйти
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-6">
        <Outlet />
      </main>
    </div>
  );
}
