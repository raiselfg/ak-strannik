import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentMediaSection } from '@/app/_components/content/content-media-section';
import { ContentPageHeader } from '@/app/_components/content/content-page-header';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getMasterclasses } from '@/features/masterclasses/queries';
import { routing, type Locale } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pages.projectsMasterclasses',
  });
  return { title: t('title'), description: t('description') };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <MasterclassesContent params={params} />
    </Suspense>
  );
}

async function MasterclassesContent({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [records, t, common] = await Promise.all([
    getMasterclasses(locale),
    getTranslations('Pages.projectsMasterclasses'),
    getTranslations('Pages.common'),
  ]);

  return (
    <article className="px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="container mx-auto">
        <ContentPageHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />
        {records.length === 0 ? (
          <ContentEmptyState message={common('empty')} />
        ) : (
          <div className="space-y-8">
            {records.map((record) => (
              <ContentMediaSection
                key={record.id}
                title={record.title}
                text={record.text}
                images={record.images}
                videos={record.videos}
                imageAlt={(index) =>
                  t('imageAlt', {
                    title: record.title,
                    number: index + 1,
                  })
                }
                videoTitle={(index) =>
                  t('videoTitle', {
                    title: record.title,
                    number: index + 1,
                  })
                }
                imageUnavailable={common('imageUnavailable')}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function getLocale(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
