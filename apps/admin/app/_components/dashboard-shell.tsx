'use client';

import { Button } from '@ak-strannik/ui/components/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@ak-strannik/ui/components/sheet';
import {
  FolderKanban,
  Handshake,
  LogOut,
  Menu,
  PackageOpen,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Suspense, type ReactNode } from 'react';
import { authClient } from '../../lib/auth-client';

const navigation = [
  { href: '/about', label: 'О нас', icon: Handshake },
  { href: '/projects', label: 'Проекты', icon: FolderKanban },
  { href: '/rental', label: 'Аренда', icon: PackageOpen },
  { href: '/team', label: 'Команда', icon: Users },
] as const;

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Основная навигация" className="grid gap-1">
      {navigation.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);

        return (
          <Link
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'
            }`}
            href={href}
            key={href}
            onClick={onNavigate}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function NavigationFallback() {
  return (
    <div aria-hidden="true" className="grid gap-1">
      {navigation.map(({ href }) => (
        <div className="h-10 animate-pulse rounded-lg bg-muted" key={href} />
      ))}
    </div>
  );
}

function Brand() {
  return (
    <Link className="flex items-center gap-3" href="/">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
        AK
      </span>
      <span>
        <span className="block text-sm font-semibold">AK Strannik</span>
        <span className="block text-xs text-muted-foreground">
          Панель управления
        </span>
      </span>
    </Link>
  );
}

function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    void authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
          router.refresh();
        },
      },
    });
  }

  return (
    <Button
      className="w-full justify-start"
      onClick={handleLogout}
      variant="ghost"
    >
      <LogOut />
      Выйти
    </Button>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar p-4 lg:flex">
        <div className="px-2 py-2">
          <Brand />
        </div>
        <div className="mt-7 flex-1">
          <Suspense fallback={<NavigationFallback />}>
            <Navigation />
          </Suspense>
        </div>
        <LogoutButton />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label="Открыть меню"
                className="lg:hidden"
                size="icon"
                variant="outline"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-72" side="left">
              <SheetHeader className="border-b">
                <SheetTitle>
                  <Brand />
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Навигация панели управления
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-1 flex-col px-3">
                <Suspense fallback={<NavigationFallback />}>
                  <Navigation />
                </Suspense>
                <div className="mt-auto border-t py-3">
                  <LogoutButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div>
            <p className="text-sm font-medium">Административная панель</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Управление содержимым сайта
            </p>
          </div>
        </header>

        <main className="mx-auto w-full max-w-360 p-4 sm:p-6 lg:p-8">
          <Suspense
            fallback={
              <div className="h-48 animate-pulse rounded-xl border bg-card" />
            }
          >
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
