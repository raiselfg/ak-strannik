'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@ak-strannik/ui/components/button';

export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations('TeamDetail.error');

  return (
    <section className="px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl rounded-4xl border border-border/45 bg-card/45 p-8 text-center shadow-xl shadow-background/25 backdrop-blur-sm">
          <h1 className="font-hand text-4xl font-bold sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-muted-foreground">{t('description')}</p>
          <Button className="mt-7" onClick={reset}>
            {t('retry')}
          </Button>
        </div>
      </div>
    </section>
  );
}
