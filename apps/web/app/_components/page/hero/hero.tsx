import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@ak-strannik/ui/components/button';
import { Link } from '@/i18n/navigation';

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative isolate flex min-h-svh items-end overflow-hidden px-4 pt-28 pb-8 sm:px-6 sm:pt-36 sm:pb-14 lg:min-h-screen lg:px-8 lg:pb-20">
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
        className="bg-gold/18 motion-safe:animate-ambient-drift absolute -top-28 -right-32 -z-10 size-96 rounded-full blur-3xl will-change-transform sm:size-[34rem]"
      />
      <div
        aria-hidden="true"
        className="bg-ink-3/75 motion-safe:animate-ambient-drift-reverse absolute top-1/4 -left-40 -z-10 size-96 rounded-full blur-3xl will-change-transform"
      />
      <div
        aria-hidden="true"
        className="bg-gold/10 motion-safe:animate-soft-pulse absolute right-1/4 bottom-16 -z-10 size-72 rounded-full blur-3xl will-change-transform"
      />
      <div
        aria-hidden="true"
        className="bg-ink-3/60 motion-safe:animate-ambient-drift absolute top-10 left-1/3 -z-10 size-64 rounded-full blur-3xl will-change-transform"
      />

      <div className="container mx-auto">
        <div
          data-reveal
          data-reveal-state="pending"
          className="landing-card max-w-4xl rounded-3xl border border-border/40 bg-background/45 p-4 shadow-2xl shadow-background/40 backdrop-blur-md sm:rounded-4xl sm:p-8 lg:p-10"
        >
          <p className="text-gold mb-3 text-xs font-semibold tracking-[0.2em] uppercase sm:mb-4 sm:text-sm sm:tracking-[0.28em]">
            {t('eyebrow')}
          </p>
          <h1 className="font-hand text-[clamp(2.5rem,13vw,4.5rem)] leading-[0.92] font-bold tracking-[0.5px] text-balance text-foreground lg:text-8xl">
            {t('title')}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:mt-6 sm:text-xl sm:leading-8">
            {t('description')}
          </p>

          <div className="mt-6 flex flex-col gap-3 min-[420px]:flex-row sm:mt-8">
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
