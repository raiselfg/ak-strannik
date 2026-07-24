import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getFestivalBySlug } from '@/features/festival/queries';
import { routing, type Locale } from '@/i18n/routing';
import { FestivalDetailContent } from './festival-detail-content';

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const [festival, page] = await Promise.all([
    getFestivalBySlug(locale, slug),
    getTranslations({ locale, namespace: 'Pages.projectsFestival' }),
  ]);

  if (!festival) return {};
  return {
    title: festival.title,
    description: truncateDescription(page('detailDescription')),
  };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <FestivalContent params={params} />
    </Suspense>
  );
}

async function FestivalContent({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  setRequestLocale(locale);
  if (!slug) notFound();

  const [festival, t, common] = await Promise.all([
    getFestivalBySlug(locale, slug),
    getTranslations('Pages.projectsFestival'),
    getTranslations('Pages.common'),
  ]);
  if (!festival) notFound();

  return (
    <FestivalDetailContent
      festival={festival}
      labels={{
        logoAlt: t('logoAlt', { title: festival.title }),
        programTitle: t('programTitle'),
        imagesTitle: t('imagesTitle'),
        imageAlt: (index) =>
          t('imageAlt', { title: festival.title, number: index + 1 }),
        achievementsTitle: t('achievementsTitle'),
        achievementAlt: (index) =>
          t('achievementAlt', {
            title: festival.title,
            number: index + 1,
          }),
        videosTitle: t('videosTitle'),
        videoTitle: (index) =>
          t('videoTitle', { title: festival.title, number: index + 1 }),
        socialsTitle: t('socialsTitle'),
        externalLink: t('externalLink'),
        imageUnavailable: common('imageUnavailable'),
      }}
    />
  );
}

function getLocale(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

function truncateDescription(value: string): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized.length <= 160
    ? normalized
    : `${normalized.slice(0, 157).trimEnd()}…`;
}
