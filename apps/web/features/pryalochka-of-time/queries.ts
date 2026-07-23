import 'server-only';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import { cacheLife } from 'next/cache';

import type { Locale as AppLocale } from '@/i18n/routing';
import { getLocalizedTranslation } from '@/lib/content/get-localized-translation';

const select = {
  id: true,
  images: true,
  events: {
    orderBy: { position: 'asc' as const },
    select: {
      id: true,
      image: true,
      link: true,
      position: true,
      translations: {
        select: { locale: true, text: true },
      },
    },
  },
  actors: {
    orderBy: { position: 'asc' as const },
    select: {
      id: true,
      position: true,
      translations: {
        select: { locale: true, name: true, text: true },
      },
    },
  },
} satisfies Prisma.PryalochkaOfTimeContentSelect;

type PryalochkaRecord = Prisma.PryalochkaOfTimeContentGetPayload<{
  select: typeof select;
}>;

export type PublicPryalochkaEvent = {
  id: string;
  image: string;
  link: string | null;
  position: number;
  text: string;
};

export type PublicPryalochkaActor = {
  id: string;
  position: number;
  name: string;
  text: string;
};

export type PublicPryalochkaContent = {
  id: string;
  images: string[];
  events: PublicPryalochkaEvent[];
  actors: PublicPryalochkaActor[];
};

export async function getPryalochkaContent(
  locale: AppLocale
): Promise<PublicPryalochkaContent | null> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const localeFilter = { locale: { in: getRequestedLocales(locale) } };
  const records = await prisma.pryalochkaOfTimeContent.findMany({
    orderBy: { createdAt: 'asc' },
    take: 2,
    select: {
      ...select,
      events: {
        ...select.events,
        select: {
          ...select.events.select,
          translations: {
            ...select.events.select.translations,
            where: localeFilter,
          },
        },
      },
      actors: {
        ...select.actors,
        select: {
          ...select.actors.select,
          translations: {
            ...select.actors.select.translations,
            where: localeFilter,
          },
        },
      },
    },
  });

  if (records.length > 1) {
    console.error(
      '[pryalochka-of-time] Singleton invariant violation: multiple records'
    );
  }

  const record = records[0];
  return record ? mapPryalochkaContent(record, locale) : null;
}

function mapPryalochkaContent(
  record: PryalochkaRecord,
  locale: AppLocale
): PublicPryalochkaContent {
  const databaseLocale = toDatabaseLocale(locale);
  return {
    id: record.id,
    images: record.images,
    events: record.events
      .map((event) => {
        const translation = getLocalizedTranslation(
          event.translations,
          databaseLocale
        );
        return translation
          ? {
              id: event.id,
              image: event.image,
              link: event.link,
              position: event.position,
              text: translation.text,
            }
          : null;
      })
      .filter((event): event is PublicPryalochkaEvent => event !== null),
    actors: record.actors
      .map((actor) => {
        const translation = getLocalizedTranslation(
          actor.translations,
          databaseLocale
        );
        return translation
          ? {
              id: actor.id,
              position: actor.position,
              name: translation.name,
              text: translation.text,
            }
          : null;
      })
      .filter((actor): actor is PublicPryalochkaActor => actor !== null),
  };
}

function getRequestedLocales(locale: AppLocale): Locale[] {
  return locale === 'en' ? [Locale.en, Locale.ru] : [Locale.ru];
}

function toDatabaseLocale(locale: AppLocale): Locale {
  return locale === 'en' ? Locale.en : Locale.ru;
}
