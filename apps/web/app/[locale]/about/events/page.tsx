import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentPageHeader } from '@/app/_components/content/content-page-header';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getEvents } from '@/features/events/queries';
import { routing, type Locale } from '@/i18n/routing';
import { EventsYearSection } from './events-year-section';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'Pages.aboutEvents' });
  return { title: t('title'), description: t('description') };
}

export default async function Page({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('Pages.aboutEvents');

  return (
    <article className="relative overflow-hidden px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="container mx-auto">
        <ContentPageHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />
        <Suspense fallback={<ContentPageSkeleton embedded />}>
          <EventsContent locale={locale} />
        </Suspense>
      </div>
    </article>
  );
}

async function EventsContent({ locale }: { locale: Locale }) {
  const [groups, t, common] = await Promise.all([
    getEvents(locale),
    getTranslations('Pages.aboutEvents'),
    getTranslations('Pages.common'),
  ]);

  if (groups.length === 0) {
    return <ContentEmptyState message={common('empty')} />;
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <EventsYearSection
          key={group.id}
          group={group}
          eventLabel={(index) => t('eventLabel', { number: index + 1 })}
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

function getLocale(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
