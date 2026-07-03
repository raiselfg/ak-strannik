import { setRequestLocale } from 'next-intl/server';

import { Hero } from '../_components/page/hero/hero';

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <Hero />;
}
