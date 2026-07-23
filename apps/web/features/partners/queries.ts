import 'server-only';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import { cacheLife } from 'next/cache';

import type { Locale as AppLocale } from '@/i18n/routing';
import { getLocalizedTranslation } from '@/lib/content/get-localized-translation';

const select = {
  id: true,
  link: true,
  images: true,
  translations: {
    select: { locale: true, title: true, text: true },
  },
} satisfies Prisma.PartnerContentSelect;

type Record = Prisma.PartnerContentGetPayload<{ select: typeof select }>;

export type PublicPartner = {
  id: string;
  link: string | null;
  images: string[];
  title: string;
  text: string | null;
};

export async function getPartners(locale: AppLocale): Promise<PublicPartner[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const records = await prisma.partnerContent.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      ...select,
      translations: {
        ...select.translations,
        where: {
          locale: { in: requestedLocales(locale) },
        },
      },
    },
  });

  return records
    .map((record) => mapPartner(record, locale))
    .filter((partner): partner is PublicPartner => partner !== null);
}

function mapPartner(record: Record, locale: AppLocale): PublicPartner | null {
  const translation = getLocalizedTranslation(
    record.translations,
    toDatabaseLocale(locale)
  );
  if (!translation) return null;

  return {
    id: record.id,
    link: getSafeExternalUrl(record.link),
    images: record.images,
    title: translation.title,
    text: translation.text,
  };
}

function getSafeExternalUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function requestedLocales(locale: AppLocale): Locale[] {
  return locale === 'en' ? [Locale.en, Locale.ru] : [Locale.ru];
}

function toDatabaseLocale(locale: AppLocale): Locale {
  return locale === 'en' ? Locale.en : Locale.ru;
}
