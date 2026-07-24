import type { Metadata } from 'next';
import { connection } from 'next/server';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getRequisiteGroups } from '@/features/requisite/queries';
import { routing, type Locale } from '@/i18n/routing';
import { RequisiteGroup } from './requisite-group';

type PageProps = { params: Promise<{ locale: string }> };

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
    <article className="px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="container mx-auto">
        <Suspense fallback={<ContentPageSkeleton embedded />}>
          <RequisiteContent locale={locale} />
        </Suspense>
      </div>
    </article>
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
    </div>
  );
}

function getLocale(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
