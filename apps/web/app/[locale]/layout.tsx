import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

import '@/app/globals.css';
import { routing, type Locale } from '@/i18n/routing';
import { Header } from '../_components/layout/header/header';

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
  const messages = await getMessages();
  const clientMessages = {
    Metadata: messages.Metadata,
    Navigation: messages.Navigation,
    Map: messages.Map,
    Pages: {
      common: messages.Pages.common,
    },
    TeamDetail: {
      error: messages.TeamDetail.error,
    },
  };

  return (
    <html lang={locale} className="font-sans antialiased">
      <body className="relative flex min-h-dvh min-w-0 flex-col">
        <NextIntlClientProvider messages={clientMessages}>
          <Header />
          <main className="min-w-0 flex-1">{children}</main>
          <footer>
            <Contacts />
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
