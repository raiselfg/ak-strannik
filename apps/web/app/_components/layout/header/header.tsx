import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './language-switcher';
import { MobileNavMenu } from './mobile-nav-menu';
import { CompactNavMenu, NavMenu } from './nav-menu';

export function Header() {
  return (
    <header className="fixed inset-x-0 top-2 z-40 px-2 sm:top-4 sm:px-4">
      <div className="container mx-auto">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 rounded-3xl border border-border/40 bg-background/60 px-2 py-2 shadow-xl shadow-background/20 backdrop-blur-3xl sm:gap-4 sm:rounded-4xl xl:px-3 2xl:gap-6">
          <Suspense fallback={<LogoLinkFallback />}>
            <LogoLink />
          </Suspense>
          <Suspense fallback={<NavMenuFallback />}>
            <NavMenu />
          </Suspense>
          <Suspense fallback={<CompactNavMenuFallback />}>
            <CompactNavMenu />
          </Suspense>

          <div className="flex items-center gap-2">
            <Suspense fallback={<LanguageSwitcherFallback />}>
              <LanguageSwitcher />
            </Suspense>
            <Suspense fallback={<MobileNavMenuFallback />}>
              <MobileNavMenu />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavMenuFallback() {
  return (
    <div
      aria-hidden="true"
      className="hidden h-10 w-xl max-w-[65vw] rounded-full bg-background/20 xl:block"
    />
  );
}

function CompactNavMenuFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-10 w-20 shrink-0 rounded-full border border-border/50 bg-background/30 sm:w-48 xl:hidden"
    />
  );
}

function MobileNavMenuFallback() {
  return (
    <div
      aria-hidden="true"
      className="size-10 shrink-0 rounded-full border border-border/60 bg-background/40 xl:hidden"
    />
  );
}

function LanguageSwitcherFallback() {
  return (
    <div
      aria-hidden="true"
      className="hidden h-9 w-20 shrink-0 rounded-full border border-border/50 bg-background/30 sm:block"
    />
  );
}

function LogoLinkFallback() {
  return (
    <div
      aria-hidden="true"
      className="size-12 shrink-0 rounded-full bg-background/30 sm:size-14"
    />
  );
}

function LogoLink() {
  const t = useTranslations('Navigation');

  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 rounded-full focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
      aria-label={t('logoLabel')}
    >
      <Image
        src="/logo.png"
        alt=""
        height={56}
        width={56}
        loading="eager"
        className="size-12 sm:size-14"
      />
    </Link>
  );
}
