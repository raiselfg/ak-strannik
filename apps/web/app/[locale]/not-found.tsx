import { getTranslations } from 'next-intl/server';

import { Button } from '@ak-strannik/ui/components/button';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('Pages.common');

  return (
    <section className="px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl rounded-4xl border border-border/45 bg-card/45 p-8 text-center shadow-xl shadow-background/25 backdrop-blur-sm">
          <p className="text-gold text-sm font-semibold tracking-[0.28em] uppercase">
            404
          </p>
          <h1 className="font-hand mt-3 text-4xl font-bold sm:text-5xl">
            {t('notFoundTitle')}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t('notFoundDescription')}
          </p>
          <Button asChild className="mt-7">
            <Link href="/">{t('homeCta')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
