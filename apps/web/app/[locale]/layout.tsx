import type { Metadata } from 'next';
import { connection } from 'next/server';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

import '@/app/globals.css';
import { cn } from '@ak-strannik/ui/lib/utils';
import { routing, type Locale } from '@/i18n/routing';
import { Header } from '../_components/layout/header/header';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

const Contacts = dynamic(
  () => import('@/app/_components/layout/footer/contacts')
);

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({
    locale: validLocale,
    namespace: 'Metadata',
  });

  return {
    title: {
      default: t('title'),
      template: `%s — ${t('title')}`,
    },
    description: t('description'),
    applicationName: t('title'),
    openGraph: {
      type: 'website',
      locale: validLocale === 'ru' ? 'ru_RU' : 'en_US',
      siteName: t('title'),
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  await connection();

  return (
    <html lang={locale} className={cn('font-sans antialiased', inter.variable)}>
      <body className="relative flex flex-col gap-4">
        <NextIntlClientProvider>
          <Header />
          <main>{children}</main>
          <footer>
            <Contacts />
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
