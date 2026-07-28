import 'server-only';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import { cacheLife } from 'next/cache';

import type { Locale as AppLocale } from '@/i18n/routing';
import { getLocalizedTranslation } from '@/lib/content/get-localized-translation';

const select = {
  id: true,
  translations: {
    select: { locale: true, title: true },
  },
  requisites: {
    orderBy: { position: 'asc' as const },
    select: {
      id: true,
      position: true,
      image: true,
      translations: {
        select: { locale: true, title: true },
      },
    },
  },
} satisfies Prisma.RequisiteContentSelect;

type RequisiteRecord = Prisma.RequisiteContentGetPayload<{
  select: typeof select;
}>;

export type PublicRequisiteItem = {
  id: string;
  position: number;
  image: string;
  title: string | null;
};

export type PublicRequisiteGroup = {
  id: string;
  title: string | null;
  requisites: PublicRequisiteItem[];
};

export async function getRequisiteGroups(
  locale: AppLocale
): Promise<PublicRequisiteGroup[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const localeFilter = { locale: { in: getRequestedLocales(locale) } };
  const records = await prisma.requisiteContent.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      ...select,
      translations: { ...select.translations, where: localeFilter },
      requisites: {
        ...select.requisites,
        select: {
          ...select.requisites.select,
          translations: {
            ...select.requisites.select.translations,
            where: localeFilter,
          },
        },
      },
    },
  });

  return records
    .map((record) => mapRequisiteGroup(record, locale))
    .filter((record): record is PublicRequisiteGroup => record !== null);
}

function mapRequisiteGroup(
  record: RequisiteRecord,
  locale: AppLocale
): PublicRequisiteGroup | null {
  const translation = getLocalizedTranslation(
    record.translations,
    toDatabaseLocale(locale)
  );
  if (!translation) return null;

  return {
    id: record.id,
    title: translation.title,
    requisites: record.requisites
      .map((item) => {
        const itemTranslation = getLocalizedTranslation(
          item.translations,
          toDatabaseLocale(locale)
        );
        return itemTranslation
          ? {
              id: item.id,
              position: item.position,
              image: item.image,
              title: itemTranslation.title,
            }
          : null;
      })
      .filter((item): item is PublicRequisiteItem => item !== null),
  };
}

function getRequestedLocales(locale: AppLocale): Locale[] {
  return locale === 'en' ? [Locale.en, Locale.ru] : [Locale.ru];
}

function toDatabaseLocale(locale: AppLocale): Locale {
  return locale === 'en' ? Locale.en : Locale.ru;
}
