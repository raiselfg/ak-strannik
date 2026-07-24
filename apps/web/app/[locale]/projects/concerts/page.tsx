import type { Metadata } from 'next';
import { connection } from 'next/server';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentMediaSection } from '@/app/_components/content/content-media-section';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getConcerts } from '@/features/concerts/queries';
import { routing, type Locale } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pages.projectsConcerts',
  });
  return { title: t('title'), description: t('description') };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <ConcertsContent params={params} />
    </Suspense>
  );
}

async function ConcertsContent({ params }: PageProps) {
  await connection();
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [records, t, common] = await Promise.all([
    getConcerts(locale),
    getTranslations('Pages.projectsConcerts'),
    getTranslations('Pages.common'),
  ]);

  return (
    <article className="px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="container mx-auto">
        {records.length === 0 ? (
          <ContentEmptyState message={common('empty')} />
        ) : (
          <div className="space-y-8">
            {records.map((record, recordIndex) => {
              const title =
                record.title?.trim() ||
                t('recordFallback', { number: recordIndex + 1 });
              return (
                <ContentMediaSection
                  key={record.id}
                  title={title}
                  text={record.text}
                  images={record.images}
                  videos={record.videos}
                  imageAlt={(index) =>
                    t('imageAlt', { title, number: index + 1 })
                  }
                  videoTitle={(index) =>
                    t('videoTitle', { title, number: index + 1 })
                  }
                  imageUnavailable={common('imageUnavailable')}
                  meta={
                    record.duration?.trim()
                      ? { label: t('durationLabel'), value: record.duration }
                      : null
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

function getLocale(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
