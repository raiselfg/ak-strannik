import 'server-only';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import { cacheLife } from 'next/cache';

import type { Locale as AppLocale } from '@/i18n/routing';
import { getLocalizedTranslation } from '@/lib/content/get-localized-translation';

const select = {
  id: true,
  images: true,
  videos: true,
  achievements: true,
  translations: {
    select: { locale: true, text: true },
  },
} satisfies Prisma.UstaContentSelect;

type UstaRecord = Prisma.UstaContentGetPayload<{ select: typeof select }>;

export type PublicUstaContent = {
  id: string;
  text: string;
  images: string[];
  videos: string[];
  achievements: string[];
};

export async function getUstaContent(
  locale: AppLocale
): Promise<PublicUstaContent | null> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const records = await prisma.ustaContent.findMany({
    orderBy: { createdAt: 'asc' },
    take: 2,
    select: {
      ...select,
      translations: {
        ...select.translations,
        where: { locale: { in: getRequestedLocales(locale) } },
      },
    },
  });

  if (records.length > 1) {
    console.error('[usta] Singleton invariant violation: multiple records');
  }

  const record = records[0];
  return record ? mapUstaContent(record, locale) : null;
}

function mapUstaContent(
  record: UstaRecord,
  locale: AppLocale
): PublicUstaContent | null {
  const translation = getLocalizedTranslation(
    record.translations,
    toDatabaseLocale(locale)
  );
  return translation
    ? {
        id: record.id,
        text: translation.text,
        images: record.images,
        videos: record.videos,
        achievements: record.achievements,
      }
    : null;
}

function getRequestedLocales(locale: AppLocale): Locale[] {
  return locale === 'en' ? [Locale.en, Locale.ru] : [Locale.ru];
}

function toDatabaseLocale(locale: AppLocale): Locale {
  return locale === 'en' ? Locale.en : Locale.ru;
}
