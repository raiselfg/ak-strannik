import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@ak-strannik/ui/components/button';
import { Link } from '@/i18n/navigation';

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative isolate flex min-h-screen items-end overflow-hidden px-4 pt-32 pb-16 sm:px-6 sm:pb-20 lg:px-8">
      <Image
        src="/ship-crop.avif"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/55 to-background/15" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(ellipse_at_bottom,var(--color-gold)/0.18,transparent_62%)]" />
      <div
        aria-hidden="true"
        className="bg-gold/18 absolute -top-28 -right-32 -z-10 size-96 rounded-full blur-3xl will-change-transform motion-safe:animate-ambient-drift sm:size-[34rem]"
      />
      <div
        aria-hidden="true"
        className="bg-ink-3/75 absolute top-1/4 -left-40 -z-10 size-96 rounded-full blur-3xl will-change-transform motion-safe:animate-ambient-drift-reverse"
      />
      <div
        aria-hidden="true"
        className="bg-gold/10 absolute right-1/4 bottom-16 -z-10 size-72 rounded-full blur-3xl will-change-transform motion-safe:animate-soft-pulse"
      />
      <div
        aria-hidden="true"
        className="bg-ink-3/60 absolute top-10 left-1/3 -z-10 size-64 rounded-full blur-3xl will-change-transform motion-safe:animate-ambient-drift"
      />

      <div className="container mx-auto">
        <div
          data-reveal
          className="landing-card max-w-4xl rounded-4xl border border-border/40 bg-background/35 p-5 shadow-2xl shadow-background/40 backdrop-blur-md sm:p-8 lg:p-10"
        >
          <p className="text-gold mb-4 text-sm font-semibold tracking-[0.28em] uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="font-hand text-5xl leading-[0.9] font-bold tracking-[0.5px] text-foreground sm:text-7xl lg:text-8xl">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            {t('description')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/#contacts">{t('contactCta')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects/festival">{t('projectsCta')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
