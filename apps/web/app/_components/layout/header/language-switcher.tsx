'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@ak-strannik/ui/lib/utils';

const languages = [
  { locale: 'ru', label: 'RU' },
  { locale: 'en', label: 'EN' },
] as const;

interface LanguageSwitcherProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function LanguageSwitcher({
  mobile = false,
  onNavigate,
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  return (
    <nav
      className={cn(
        'items-center gap-1 rounded-full border border-border/50 bg-background/30 px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase',
        mobile ? 'flex min-h-11 justify-center' : 'hidden sm:flex'
      )}
      aria-label={t('languageLabel')}
    >
      {languages.map((language, index) => (
        <span key={language.locale} className="contents">
          {index > 0 && <span aria-hidden="true">/</span>}
          <Link
            href={pathname}
            locale={language.locale}
            aria-current={locale === language.locale ? 'page' : undefined}
            onClick={onNavigate}
            className={cn(
              'rounded-sm transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
              locale === language.locale && 'text-foreground'
            )}
          >
            {language.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
