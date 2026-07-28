import 'server-only';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import { cacheLife } from 'next/cache';

import type { Locale as AppLocale } from '@/i18n/routing';
import { getLocalizedTranslation } from '@/lib/content/get-localized-translation';

const select = {
  id: true,
  images: true,
  videos: true,
  translations: {
    select: { locale: true, title: true, text: true, duration: true },
  },
} satisfies Prisma.ConcertContentSelect;

type ConcertRecord = Prisma.ConcertContentGetPayload<{
  select: typeof select;
}>;

export type PublicConcert = {
  id: string;
  images: string[];
  videos: string[];
  title: string | null;
  text: string | null;
  duration: string | null;
};

export async function getConcerts(locale: AppLocale): Promise<PublicConcert[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const records = await prisma.concertContent.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      ...select,
      translations: {
        ...select.translations,
        where: {
          locale: {
            in: locale === 'en' ? [Locale.en, Locale.ru] : [Locale.ru],
          },
        },
      },
    },
  });

  return records
    .map((record) => mapConcert(record, locale))
    .filter((record): record is PublicConcert => record !== null);
}

function mapConcert(
  record: ConcertRecord,
  locale: AppLocale
): PublicConcert | null {
  const translation = getLocalizedTranslation(
    record.translations,
    locale === 'en' ? Locale.en : Locale.ru
  );
  return translation
    ? {
        id: record.id,
        images: record.images,
        videos: record.videos,
        title: translation.title,
        text: translation.text,
        duration: translation.duration,
      }
    : null;
}
