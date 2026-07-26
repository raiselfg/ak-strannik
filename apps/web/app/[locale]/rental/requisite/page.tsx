import type { Metadata } from 'next';
import { connection } from 'next/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import {
  ContentContactNotice,
  ContentPage,
  ContentPageHeader,
  type ContentPageProps as PageProps,
} from '@/app/_components/content/content-page';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getRequisiteGroups } from '@/features/requisite/queries';
import { getLocale } from '@/i18n/get-locale';
import type { Locale } from '@/i18n/routing';
import { RequisiteGroup } from './requisite-group';

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pages.rentalRequisite',
  });
  return { title: t('title'), description: t('description') };
}

export default async function Page({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('Pages.rentalRequisite');
  return (
    <ContentPage>
      <ContentPageHeader title={t('title')} />
      <Suspense fallback={<ContentPageSkeleton embedded />}>
        <RequisiteContent locale={locale} />
      </Suspense>
    </ContentPage>
  );
}

async function RequisiteContent({ locale }: { locale: Locale }) {
  await connection();
  const [groups, t, common] = await Promise.all([
    getRequisiteGroups(locale),
    getTranslations('Pages.rentalRequisite'),
    getTranslations('Pages.common'),
  ]);

  if (groups.length === 0) {
    return <ContentEmptyState message={common('empty')} />;
  }

  return (
    <div className="space-y-8">
      {groups.map((group, groupIndex) => {
        const groupTitle =
          group.title?.trim() || t('groupFallback', { number: groupIndex + 1 });
        return (
          <RequisiteGroup
            key={group.id}
            group={group}
            groupTitle={groupTitle}
            itemTitle={(index) => t('itemFallback', { number: index + 1 })}
            emptyMessage={t('groupEmpty')}
            imageAlt={(title, index) =>
              t('imageAlt', {
                group: groupTitle,
                item: title,
                number: index + 1,
              })
            }
            imageUnavailable={common('imageUnavailable')}
          />
        );
      })}
      <ContentContactNotice>{t('contactNotice')}</ContentContactNotice>
    </div>
  );
}
