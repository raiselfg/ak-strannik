import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';

import { AboutSections } from '../_components/page/about-sections/about-sections';
import { Hero } from '../_components/page/hero/hero';
import { TeamSection } from '../_components/page/team-section/team-section';
import { routing, type Locale } from '@/i18n/routing';

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = routing.locales.includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : routing.defaultLocale;

  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <Suspense fallback={null}>
        <TeamSection locale={locale} />
      </Suspense>
      <AboutSections />
    </>
  );
}
