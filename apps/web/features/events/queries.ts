import 'server-only';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import { cacheLife, cacheTag } from 'next/cache';

import type { Locale as AppLocale } from '@/i18n/routing';
import { getLocalizedTranslation } from '@/lib/content/get-localized-translation';

const select = {
  id: true,
  year: true,
  events: {
    orderBy: { position: 'asc' as const },
    select: {
      id: true,
      position: true,
      images: true,
      videos: true,
      translations: {
        select: { locale: true, text: true },
      },
    },
  },
} satisfies Prisma.EventsContentSelect;

type EventsRecord = Prisma.EventsContentGetPayload<{ select: typeof select }>;

export type PublicEvent = {
  id: string;
  position: number;
  images: string[];
  videos: string[];
  text: string;
};

export type PublicEventsYear = {
  id: string;
  year: string;
  events: PublicEvent[];
};

export async function getEvents(
  locale: AppLocale,
  year: string | null | undefined
): Promise<PublicEventsYear[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  cacheTag('events', `events:${locale}`, `events:${year ?? 'latest'}`);

  const records = await prisma.eventsContent.findMany({
    where: year ? { year } : undefined,
    orderBy: year === null ? { year: 'desc' } : undefined,
    take: year === null ? 1 : undefined,
    select: {
      ...select,
      events: {
        ...select.events,
        select: {
          ...select.events.select,
          translations: {
            ...select.events.select.translations,
            where: { locale: { in: getRequestedLocales(locale) } },
          },
        },
      },
    },
  });

  return records
    .map((record) => mapEventsYear(record, locale))
    .sort(compareEventsYears);
}

export async function getEventYears(): Promise<string[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  cacheTag('events', 'event-years');

  const records = await prisma.eventsContent.findMany({
    select: { year: true },
  });

  return records.map(({ year }) => year).sort(compareYearValues);
}

function compareEventsYears(
  first: PublicEventsYear,
  second: PublicEventsYear
): number {
  return compareYearValues(first.year, second.year);
}

function compareYearValues(first: string, second: string): number {
  const firstYear = Number(first);
  const secondYear = Number(second);
  const firstIsYear = Number.isInteger(firstYear);
  const secondIsYear = Number.isInteger(secondYear);

  if (firstIsYear && secondIsYear) {
    return secondYear - firstYear;
  }

  if (firstIsYear !== secondIsYear) {
    return firstIsYear ? -1 : 1;
  }

  return first.localeCompare(second);
}

function mapEventsYear(
  record: EventsRecord,
  locale: AppLocale
): PublicEventsYear {
  return {
    id: record.id,
    year: record.year,
    events: record.events
      .map((event) => {
        const translation = getLocalizedTranslation(
          event.translations,
          toDatabaseLocale(locale)
        );
        return translation
          ? {
              id: event.id,
              position: event.position,
              images: event.images,
              videos: event.videos,
              text: translation.text,
            }
          : null;
      })
      .filter((event): event is PublicEvent => event !== null),
  };
}

function getRequestedLocales(locale: AppLocale): Locale[] {
  return locale === 'en' ? [Locale.en, Locale.ru] : [Locale.ru];
}

function toDatabaseLocale(locale: AppLocale): Locale {
  return locale === 'en' ? Locale.en : Locale.ru;
}
