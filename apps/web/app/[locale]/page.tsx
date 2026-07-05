import { setRequestLocale } from 'next-intl/server';

import { AboutSections } from '../_components/page/about-sections/about-sections';
import { Hero } from '../_components/page/hero/hero';

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <AboutSections />
    </>
  );
}
