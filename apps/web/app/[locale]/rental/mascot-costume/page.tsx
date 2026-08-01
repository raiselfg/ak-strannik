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
import { getMascotCostumes } from '@/features/mascot-costume/queries';
import { getLocale } from '@/i18n/get-locale';
import { RentalMasonry } from '../_components/rental-masonry';

export const generateMetadata = createPageMetadata('Pages.rentalMascotCostume');

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <MascotCostumeContent params={params} />
    </Suspense>
  );
}

async function MascotCostumeContent({ params }: PageProps) {
  await connection();
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [records, t, common] = await Promise.all([
    getMascotCostumes(locale),
    getTranslations('Pages.rentalMascotCostume'),
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
