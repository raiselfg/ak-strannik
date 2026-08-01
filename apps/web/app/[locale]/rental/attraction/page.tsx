import { connection } from 'next/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import {
  ContentContactNotice,
  ContentPage,
  type ContentPageProps as PageProps,
} from '@/app/_components/content/content-page';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { createPageMetadata } from '@/app/_lib/localized-page';
import { getAttractions } from '@/features/attraction/queries';
import { getLocale } from '@/i18n/get-locale';
import { RentalMasonry } from '../_components/rental-masonry';

export const generateMetadata = createPageMetadata('Pages.rentalAttraction');

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <AttractionContent params={params} />
    </Suspense>
  );
}

async function AttractionContent({ params }: PageProps) {
  await connection();
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [records, t, common] = await Promise.all([
    getAttractions(locale),
    getTranslations('Pages.rentalAttraction'),
    getTranslations('Pages.common'),
  ]);

  return (
    <ContentPage>
      <h1 className="content-page__title">{t('title')}</h1>
      {records.length === 0 ? (
        <ContentEmptyState message={common('empty')} />
      ) : (
        <RentalMasonry
          items={records.map((record, index) => ({
            id: record.id,
            image: record.image,
            imageAlt: t('imageAlt', { number: index + 1 }),
            imageUnavailable: common('imageUnavailable'),
            caption: record.text,
            captionKind: 'text',
          }))}
        />
      )}
      <ContentContactNotice>{t('contactNotice')}</ContentContactNotice>
    </ContentPage>
  );
}
