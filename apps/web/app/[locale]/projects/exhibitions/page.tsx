import { connection } from 'next/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentImageGallery } from '@/app/_components/content/content-image-gallery';
import {
  ContentPage,
  ContentPageHeader,
} from '@/app/_components/content/content-page';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import {
  createPageMetadata,
  type LocalizedPageProps as PageProps,
} from '@/app/_lib/localized-page';
import { getExhibitions } from '@/features/exhibitions/queries';
import { getLocale } from '@/i18n/get-locale';

export const generateMetadata = createPageMetadata('Pages.projectsExhibitions');

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <ExhibitionsContent params={params} />
    </Suspense>
  );
}

async function ExhibitionsContent({ params }: PageProps) {
  await connection();
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [records, t, common] = await Promise.all([
    getExhibitions(locale),
    getTranslations('Pages.projectsExhibitions'),
    getTranslations('Pages.common'),
  ]);

  return (
    <ContentPage>
      <ContentPageHeader title={t('title')} />
      {records.length === 0 ? (
        <ContentEmptyState message={common('empty')} />
      ) : (
        <ul className="space-y-8">
          {records.map((record) => (
            <li
              key={record.id}
              className="rounded-4xl border border-border/45 bg-card/45 p-5 shadow-xl shadow-background/25 sm:p-7"
            >
              <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">
                {record.title}
              </h2>
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
            </li>
          ))}
        </ul>
      )}
    </ContentPage>
  );
}
