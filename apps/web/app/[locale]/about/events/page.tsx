import { connection } from 'next/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import {
  createPageMetadata,
  type LocalizedPageProps,
} from '@/app/_lib/localized-page';
import { getEvents, getEventYears } from '@/features/events/queries';
import { getLocale } from '@/i18n/get-locale';
import type { Locale } from '@/i18n/routing';
import { EventsYearFilter } from './events-year-filter';
import { EventsYearSection } from './events-year-section';
import { resolveEventsYearFilter } from './resolve-events-year-filter';

type PageProps = LocalizedPageProps & {
  searchParams: Promise<{ year?: string | string[] }>;
};

export const generateMetadata = createPageMetadata('Pages.aboutEvents');

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
  const [years, t, common] = await Promise.all([
    getEventYears(),
    getTranslations('Pages.aboutEvents'),
    getTranslations('Pages.common'),
  ]);
  const yearFilter = resolveEventsYearFilter(selectedYear, years);
  const groups = await getEvents(locale, yearFilter);

  if (groups.length === 0) {
    return <ContentEmptyState message={common('empty')} />;
  }

  const activeYear = yearFilter === undefined ? undefined : groups[0]?.year;

  return (
    <div className="space-y-8">
      <h2 className="content-page__title">{t('title')}</h2>
      <EventsYearFilter
        years={years}
        activeYear={activeYear}
        label={t('filterLabel')}
        allYearsLabel={t('allYears')}
      />
      {groups.map((group, groupIndex) => (
        <EventsYearSection
          key={group.id}
          group={group}
          eagerFirstGallery={groupIndex === 0}
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
