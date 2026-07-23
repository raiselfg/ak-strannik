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
    select: { locale: true, title: true },
  },
  persons: {
    orderBy: { position: 'asc' as const },
    select: {
      id: true,
      position: true,
      translations: {
        select: { locale: true, name: true },
      },
    },
  },
} satisfies Prisma.PerformancesContentSelect;

type PerformanceRecord = Prisma.PerformancesContentGetPayload<{
  select: typeof select;
}>;

export type PublicPerformancePerson = {
  id: string;
  position: number;
  name: string;
};

export type PublicPerformance = {
  id: string;
  images: string[];
  videos: string[];
  title: string;
  persons: PublicPerformancePerson[];
};

export async function getPerformances(
  locale: AppLocale
): Promise<PublicPerformance[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const localeFilter = { locale: { in: getRequestedLocales(locale) } };
  const records = await prisma.performancesContent.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      ...select,
      translations: { ...select.translations, where: localeFilter },
      persons: {
        ...select.persons,
        select: {
          ...select.persons.select,
          translations: {
            ...select.persons.select.translations,
            where: localeFilter,
          },
        },
      },
    },
  });

  return records
    .map((record) => mapPerformance(record, locale))
    .filter((record): record is PublicPerformance => record !== null);
}

function mapPerformance(
  record: PerformanceRecord,
  locale: AppLocale
): PublicPerformance | null {
  const translation = getLocalizedTranslation(
    record.translations,
    toDatabaseLocale(locale)
  );
  if (!translation) return null;

  return {
    id: record.id,
    images: record.images,
    videos: record.videos,
    title: translation.title,
    persons: record.persons
      .map((person) => {
        const personTranslation = getLocalizedTranslation(
          person.translations,
          toDatabaseLocale(locale)
        );
        return personTranslation
          ? {
              id: person.id,
              position: person.position,
              name: personTranslation.name,
            }
          : null;
      })
      .filter((person): person is PublicPerformancePerson => person !== null),
  };
}

function getRequestedLocales(locale: AppLocale): Locale[] {
  return locale === 'en' ? [Locale.en, Locale.ru] : [Locale.ru];
}

function toDatabaseLocale(locale: AppLocale): Locale {
  return locale === 'en' ? Locale.en : Locale.ru;
}
