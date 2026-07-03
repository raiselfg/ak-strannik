import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Button } from '@ak-strannik/ui/components/button';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

const routePages = [
  { path: 'about/events', messageKey: 'aboutEvents' },
  { path: 'about/partners', messageKey: 'aboutPartners' },
  { path: 'about/charity', messageKey: 'aboutCharity' },
  { path: 'about/thank-you-notes', messageKey: 'aboutThankYouNotes' },
  { path: 'projects/festival', messageKey: 'projectsFestival' },
  { path: 'projects/concerts', messageKey: 'projectsConcerts' },
  { path: 'projects/artists', messageKey: 'projectsArtists' },
  { path: 'projects/performances', messageKey: 'projectsPerformances' },
  { path: 'projects/masterclasses', messageKey: 'projectsMasterclasses' },
  { path: 'projects/holiday-shows', messageKey: 'projectsHolidayShows' },
  { path: 'projects/exhibitions', messageKey: 'projectsExhibitions' },
  { path: 'projects/usta', messageKey: 'projectsUsta' },
  {
    path: 'projects/pryalochka-of-time',
    messageKey: 'projectsPryalochkaOfTime',
  },
  { path: 'rent/requisite', messageKey: 'rentRequisite' },
  { path: 'rent/attraction', messageKey: 'rentAttraction' },
  { path: 'rent/mascot-costume', messageKey: 'rentMascotCostume' },
  { path: 'charter', messageKey: 'charter' },
] as const;

type RoutePage = (typeof routePages)[number];
type RouteMessageKey = RoutePage['messageKey'];

const routePageByPath = new Map<string, RoutePage>(
  routePages.map((page) => [page.path, page])
);

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    routePages.map((page) => ({ locale, slug: page.path.split('/') }))
  );
}

function getRoutePage(slug: string[]) {
  return routePageByPath.get(slug.join('/'));
}

async function getPageTranslations(
  locale: Locale,
  messageKey: RouteMessageKey
) {
  const t = await getTranslations({ locale, namespace: 'Pages' });

  return {
    title: t(`${messageKey}.title`),
    eyebrow: t(`${messageKey}.eyebrow`),
    description: t(`${messageKey}.description`),
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const validLocale: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const page = getRoutePage(slug);

  if (!page) {
    const t = await getTranslations({
      locale: validLocale,
      namespace: 'Pages.common',
    });

    return {
      title: t('notFoundTitle'),
    };
  }

  const pageTranslations = await getPageTranslations(
    validLocale,
    page.messageKey
  );
  const metadata = await getTranslations({
    locale: validLocale,
    namespace: 'Metadata',
  });

  return {
    title: `${pageTranslations.title} — ${metadata('title')}`,
    description: pageTranslations.description,
  };
}

export default async function SectionPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const page = getRoutePage(slug);

  if (!page) notFound();

  setRequestLocale(locale);

  const pageTranslations = await getPageTranslations(locale, page.messageKey);
  const common = await getTranslations({ locale, namespace: 'Pages.common' });

  return (
    <section className="min-h-screen px-4 pt-36 pb-20 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="max-w-4xl rounded-4xl border border-border/50 bg-card/60 p-6 shadow-2xl shadow-background/30 sm:p-10 lg:p-12">
          <p className="text-gold mb-4 text-sm font-semibold tracking-[0.28em] uppercase">
            {pageTranslations.eyebrow}
          </p>
          <h1 className="font-hand text-5xl leading-[0.9] font-bold tracking-[0.5px] sm:text-7xl">
            {pageTranslations.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {pageTranslations.description}
          </p>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            {common('pending')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/#contacts">{common('contactCta')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">{common('homeCta')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
