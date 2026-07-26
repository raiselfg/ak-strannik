import type { Metadata } from 'next';
import { connection } from 'next/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getFestivals } from '@/features/festival/queries';
import { getLocale } from '@/i18n/get-locale';
import type { Locale } from '@/i18n/routing';
import { FestivalListCard } from './festival-list-card';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pages.projectsFestival',
  });
  return { title: t('title'), description: t('description') };
}

export default async function Page({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('Pages.projectsFestival');
  return (
    <article className="content-page">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="content-page__container">
        <h2 className="content-page__title">{t('title')}</h2>
        <Suspense fallback={<ContentPageSkeleton embedded />}>
          <FestivalListContent locale={locale} />
        </Suspense>
      </div>
    </article>
  );
}

async function FestivalListContent({ locale }: { locale: Locale }) {
  await connection();
  const [festivals, t, common] = await Promise.all([
    getFestivals(locale),
    getTranslations('Pages.projectsFestival'),
    getTranslations('Pages.common'),
  ]);

  if (festivals.length === 0) {
    return <ContentEmptyState message={t('empty')} />;
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {festivals.map((festival) => (
        <FestivalListCard
          key={festival.id}
          festival={festival}
          imageAlt={t('cardImageAlt', { title: festival.title })}
          imageUnavailable={common('imageUnavailable')}
          readMore={t('readMore')}
        />
      ))}
    </ul>
  );
}
