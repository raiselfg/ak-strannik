import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentImageGallery } from '@/app/_components/content/content-image-gallery';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { ContentVideoGallery } from '@/app/_components/content/content-video-gallery';
import { getPerformances } from '@/features/performances/queries';
import { routing, type Locale } from '@/i18n/routing';
import { PerformancePersonList } from './performance-person-list';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pages.projectsPerformances',
  });
  return { title: t('title'), description: t('description') };
}

export default async function Page({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('Pages.projectsPerformances');

  return (
    <article className="px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="container mx-auto">
        <Suspense fallback={<ContentPageSkeleton embedded />}>
          <PerformancesContent locale={locale} />
        </Suspense>
      </div>
    </article>
  );
}

async function PerformancesContent({ locale }: { locale: Locale }) {
  const [records, t, common] = await Promise.all([
    getPerformances(locale),
    getTranslations('Pages.projectsPerformances'),
    getTranslations('Pages.common'),
  ]);

  if (records.length === 0) {
    return <ContentEmptyState message={common('empty')} />;
  }

  return (
    <div className="space-y-8">
      {records.map((record) => (
        <section
          key={record.id}
          className="rounded-4xl border border-border/45 bg-card/45 p-5 shadow-xl shadow-background/25 sm:p-7"
        >
          <h2 className="text-2xl font-semibold sm:text-3xl">{record.title}</h2>
          <div className="mt-6 space-y-5">
            {record.images.length > 0 ? (
              <ContentImageGallery
                images={record.images}
                alt={(index) =>
                  t('imageAlt', {
                    title: record.title,
                    number: index + 1,
                  })
                }
                emptyLabel={common('imageUnavailable')}
              />
            ) : null}
            <ContentVideoGallery
              videos={record.videos}
              title={(index) =>
                t('videoTitle', {
                  title: record.title,
                  number: index + 1,
                })
              }
            />
          </div>
          <PerformancePersonList
            persons={record.persons}
            title={t('personsTitle')}
          />
        </section>
      ))}
    </div>
  );
}

function getLocale(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
