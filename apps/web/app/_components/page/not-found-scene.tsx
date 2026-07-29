import Image from 'next/image';
import NextLink from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

import { Button } from '@ak-strannik/ui/components/button';

type NotFoundSceneProps = {
  contactLabel: string;
  description: string;
  eyebrow: string;
  homeHref: string;
  homeLabel: string;
  title: string;
};

export function NotFoundScene({
  contactLabel,
  description,
  eyebrow,
  homeHref,
  homeLabel,
  title,
}: NotFoundSceneProps) {
  const contactHref = `${homeHref === '/' ? '' : homeHref}/#contacts`;

  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
      <Image
        src="/ship-crop.avif"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-30 object-cover object-center opacity-45"
      />
      <div className="absolute inset-0 -z-20 bg-linear-to-b from-background/75 via-background/90 to-background" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_50%_42%,transparent_0%,var(--color-background)/0.35_45%,var(--color-background)_82%)]" />

      <div
        aria-hidden="true"
        className="bg-gold/20 absolute -top-48 -right-32 -z-10 size-[34rem] rounded-full blur-3xl will-change-transform motion-safe:animate-ambient-drift"
      />
      <div
        aria-hidden="true"
        className="bg-ink-3/80 absolute -bottom-48 -left-36 -z-10 size-[38rem] rounded-full blur-3xl will-change-transform motion-safe:animate-ambient-drift-reverse"
      />
      <div
        aria-hidden="true"
        className="bg-gold/10 absolute top-1/2 left-1/2 -z-10 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl will-change-transform motion-safe:animate-soft-pulse"
      />

      <div className="container mx-auto">
        <div className="relative mx-auto max-w-4xl">
          <p
            aria-hidden="true"
            className="text-gold/8 pointer-events-none absolute -top-32 left-1/2 -z-10 -translate-x-1/2 text-[clamp(13rem,36vw,30rem)] leading-none font-black tracking-[-0.12em] select-none"
          >
            404
          </p>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/20 bg-background/55 px-6 py-10 text-center shadow-[0_40px_120px_color-mix(in_oklab,var(--ink)_72%,transparent)] backdrop-blur-2xl sm:px-12 sm:py-14 lg:px-20 lg:py-16">
            <div
              aria-hidden="true"
              className="via-gold/60 absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent to-transparent"
            />

            <div className="border-gold/30 bg-gold/10 text-gold mx-auto flex size-14 items-center justify-center rounded-full border shadow-[0_0_40px_color-mix(in_oklab,var(--gold)_20%,transparent)] motion-safe:animate-float">
              <Compass className="size-6" strokeWidth={1.5} />
            </div>

            <p className="text-gold mt-7 text-xs font-semibold tracking-[0.34em] uppercase sm:text-sm">
              {eyebrow}
            </p>
            <h1 className="font-hand mt-4 text-5xl leading-[0.9] font-bold tracking-[0.5px] text-balance sm:text-7xl lg:text-8xl">
              {title}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-pretty text-muted-foreground sm:text-lg sm:leading-8">
              {description}
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <NextLink href={homeHref}>
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  {homeLabel}
                </NextLink>
              </Button>
              <Button asChild variant="outline" size="lg">
                <NextLink href={contactHref}>{contactLabel}</NextLink>
              </Button>
            </div>

            <div
              aria-hidden="true"
              className="mx-auto mt-10 flex max-w-sm items-center gap-3"
            >
              <span className="bg-gold/70 size-1.5 rounded-full shadow-[0_0_14px_var(--color-gold)]" />
              <span className="via-gold/35 h-px flex-1 bg-linear-to-r from-transparent to-transparent" />
              <span className="border-gold/50 size-2.5 rotate-45 border" />
              <span className="via-gold/35 h-px flex-1 bg-linear-to-r from-transparent to-transparent" />
              <span className="bg-gold/70 size-1.5 rounded-full shadow-[0_0_14px_var(--color-gold)]" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
