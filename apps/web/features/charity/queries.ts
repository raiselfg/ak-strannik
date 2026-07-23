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
    select: { locale: true, title: true, text: true },
  },
} satisfies Prisma.CharityContentSelect;

type CharityRecord = Prisma.CharityContentGetPayload<{
  select: typeof select;
}>;

export type PublicCharity = {
  id: string;
  images: string[];
  videos: string[];
  title: string;
  text: string | null;
};

export async function getCharities(
  locale: AppLocale
): Promise<PublicCharity[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const records = await prisma.charityContent.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      ...select,
      translations: {
        ...select.translations,
        where: { locale: { in: getRequestedLocales(locale) } },
      },
    },
  });

  return records
    .map((record) => mapCharity(record, locale))
    .filter((record): record is PublicCharity => record !== null);
}

function mapCharity(
  record: CharityRecord,
  locale: AppLocale
): PublicCharity | null {
  const translation = getLocalizedTranslation(
    record.translations,
    toDatabaseLocale(locale)
  );
  return translation
    ? {
        id: record.id,
        images: record.images,
        videos: record.videos,
        title: translation.title,
        text: translation.text,
      }
    : null;
}

function getRequestedLocales(locale: AppLocale): Locale[] {
  return locale === 'en' ? [Locale.en, Locale.ru] : [Locale.ru];
}

function toDatabaseLocale(locale: AppLocale): Locale {
  return locale === 'en' ? Locale.en : Locale.ru;
}
