import type { Metadata } from 'next';
import { connection } from 'next/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentMediaSection } from '@/app/_components/content/content-media-section';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getArtists } from '@/features/artists/queries';
import { getLocale } from '@/i18n/get-locale';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pages.projectsArtists',
  });
  return { title: t('title'), description: t('description') };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <ArtistsContent params={params} />
    </Suspense>
  );
}

async function ArtistsContent({ params }: PageProps) {
  await connection();
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [records, t, common] = await Promise.all([
    getArtists(locale),
    getTranslations('Pages.projectsArtists'),
    getTranslations('Pages.common'),
  ]);

  return (
    <article className="content-page">
      <div className="content-page__container">
        <h2 className="content-page__title">{t('title')}</h2>
        {records.length === 0 ? (
          <ContentEmptyState message={common('empty')} />
        ) : (
          <div className="space-y-8">
            {records.map((record) => {
              const title = record.title?.trim() || '';
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
                />
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
