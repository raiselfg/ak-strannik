import type { Metadata } from 'next';
import { connection } from 'next/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getEvents } from '@/features/events/queries';
import { getLocale } from '@/i18n/get-locale';
import type { Locale } from '@/i18n/routing';
import { EventsYearFilter } from './events-year-filter';
import { EventsYearSection } from './events-year-section';

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ year?: string | string[] }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'Pages.aboutEvents' });
  return { title: t('title'), description: t('description') };
}

export default async function Page({ params, searchParams }: PageProps) {
  const [{ locale: localeParam }, { year }] = await Promise.all([
    params,
    searchParams,
  ]);
  const locale = getLocale(localeParam);
  const selectedYear = Array.isArray(year) ? year[0] : year;
  setRequestLocale(locale);
  return (
    <article className="content-page">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="content-page__container">
        <Suspense fallback={<ContentPageSkeleton embedded />}>
          <EventsContent locale={locale} selectedYear={selectedYear} />
        </Suspense>
      </div>
    </article>
  );
}

async function EventsContent({
  locale,
  selectedYear,
}: {
  locale: Locale;
  selectedYear?: string;
}) {
  await connection();
  const [groups, t, common] = await Promise.all([
    getEvents(locale),
    getTranslations('Pages.aboutEvents'),
    getTranslations('Pages.common'),
  ]);

  if (groups.length === 0) {
    return <ContentEmptyState message={common('empty')} />;
  }

  const activeYear = groups.some((group) => group.year === selectedYear)
    ? selectedYear
    : undefined;
  const visibleGroups = activeYear
    ? groups.filter((group) => group.year === activeYear)
    : groups;

  return (
    <div className="space-y-8">
      <h2 className="content-page__title">{t('title')}</h2>
      <EventsYearFilter
        years={groups.map((group) => group.year)}
        activeYear={activeYear}
        label={t('filterLabel')}
        allYearsLabel={t('allYears')}
      />
      {visibleGroups.map((group) => (
        <EventsYearSection
          key={group.id}
          group={group}
          emptyMessage={t('yearEmpty')}
          imageAlt={(eventIndex, imageIndex) =>
            t('imageAlt', {
              year: group.year,
              event: eventIndex + 1,
              number: imageIndex + 1,
            })
          }
          videoTitle={(eventIndex, videoIndex) =>
            t('videoTitle', {
              year: group.year,
              event: eventIndex + 1,
              number: videoIndex + 1,
            })
          }
          imageUnavailable={common('imageUnavailable')}
        />
      ))}
    </div>
  );
}
