import { connection } from 'next/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentMediaSection } from '@/app/_components/content/content-media-section';
import {
  ContentPage,
  ContentPageHeader,
} from '@/app/_components/content/content-page';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import {
  createPageMetadata,
  type LocalizedPageProps as PageProps,
} from '@/app/_lib/localized-page';
import { getCharities } from '@/features/charity/queries';
import { getLocale } from '@/i18n/get-locale';

export const generateMetadata = createPageMetadata('Pages.aboutCharity');

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <CharityContent params={params} />
    </Suspense>
  );
}

async function CharityContent({ params }: PageProps) {
  await connection();
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [records, t, common] = await Promise.all([
    getCharities(locale),
    getTranslations('Pages.aboutCharity'),
    getTranslations('Pages.common'),
  ]);

  return (
    <ContentPage>
      <ContentPageHeader title={t('title')} />
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
    </ContentPage>
  );
}
