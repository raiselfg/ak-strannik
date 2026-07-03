import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './language-switcher';
import { MobileNavMenu } from './mobile-nav-menu';
import { NavMenu } from './nav-menu';

export function Header() {
  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4">
      <div className="container mx-auto">
        <div className="mx-auto flex w-full max-w-max items-center justify-between gap-2 rounded-4xl border border-border/40 bg-background/45 px-2 py-2 shadow-xl shadow-background/20 backdrop-blur-3xl sm:gap-4 md:px-3 lg:gap-6">
          <LogoLink />
          <NavMenu />

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <MobileNavMenu />
          </div>
        </div>
      </div>
    </header>
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
        priority
        className="size-12 sm:size-14"
      />
    </Link>
  );
}
