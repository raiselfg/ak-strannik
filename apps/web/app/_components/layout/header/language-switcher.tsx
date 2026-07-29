'use client';

import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@ak-strannik/ui/lib/utils';

const languages = ['ru', 'en'] as const;

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
  const router = useRouter();
  const t = useTranslations('Navigation');
  const nextLocale = locale === 'ru' ? 'en' : 'ru';

  function switchLanguage() {
    router.replace(pathname, { locale: nextLocale });
    onNavigate?.();
  }

  return (
    <button
      type="button"
      onClick={switchLanguage}
      className={cn(
        'h-9 items-center justify-center gap-1 rounded-full border border-border/50 bg-background/30 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:border-border hover:bg-background/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
        mobile ? 'flex' : 'hidden sm:flex'
      )}
      aria-label={t('languageLabel')}
    >
      {languages.map((language, index) => (
        <span key={language} className="contents">
          {index > 0 && <span aria-hidden="true">/</span>}
          <span
            className={cn(
              'transition-colors',
              locale === language && 'text-foreground'
            )}
          >
            {language.toUpperCase()}
          </span>
        </span>
      ))}
    </button>
  );
}
