'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import { Suspense, useState } from 'react';

import { Button } from '@ak-strannik/ui/components/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@ak-strannik/ui/components/sheet';
import { cn } from '@ak-strannik/ui/lib/utils';
import { Link } from '@/i18n/navigation';

import { MobileNavigationList } from './nav-menu';
import { LanguageSwitcher } from './language-switcher';

interface Props {
  className?: string;
}

export function MobileNavMenu({ className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const navigation = useTranslations('Navigation');
  const metadata = useTranslations('Metadata');

  return (
    <div className={cn('md:hidden', className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon-lg"
            className="border border-border/60 bg-background/40 text-foreground hover:bg-muted/70"
            aria-label={navigation('openMenu')}
            aria-expanded={isOpen}
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>

        <SheetContent className="max-h-dvh w-[min(88vw,24rem)] gap-6 overflow-y-auto border-border/50 bg-background/95 px-5 py-6 backdrop-blur-xl sm:max-w-sm">
          <SheetHeader className="p-0 pr-10 text-left">
            <Link
              href="/"
              className="mb-2 flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <Image
                src="/logo.png"
                alt=""
                height={48}
                width={48}
                className="size-12"
              />
              <span className="font-hand text-xl leading-none font-bold text-foreground">
                {metadata('title')}
              </span>
            </Link>
            <SheetTitle>{navigation('sheetTitle')}</SheetTitle>
            <SheetDescription>
              {navigation('sheetDescription')}
            </SheetDescription>
          </SheetHeader>

          <Suspense
            fallback={
              <div aria-hidden="true" className="min-h-96 animate-pulse" />
            }
          >
            <MobileNavigationList onItemClick={() => setIsOpen(false)} />
          </Suspense>

          <div className="mt-auto grid gap-3 rounded-3xl border border-border/50 bg-muted/30 p-3 text-sm text-muted-foreground">
            <span>
              {navigation('siteLanguage')}:{' '}
              <span className="font-medium text-foreground">
                {locale.toUpperCase()}
              </span>
            </span>
            <Suspense
              fallback={
                <div
                  aria-hidden="true"
                  className="h-11 rounded-full border border-border/50 bg-background/30"
                />
              }
            >
              <LanguageSwitcher mobile onNavigate={() => setIsOpen(false)} />
            </Suspense>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
