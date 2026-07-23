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
} satisfies Prisma.MasterclassesContentSelect;

type MasterclassRecord = Prisma.MasterclassesContentGetPayload<{
  select: typeof select;
}>;

export type PublicMasterclass = {
  id: string;
  images: string[];
  videos: string[];
  title: string;
  text: string | null;
};

export async function getMasterclasses(
  locale: AppLocale
): Promise<PublicMasterclass[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const records = await prisma.masterclassesContent.findMany({
    orderBy: { createdAt: 'desc' },
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
    .map((record) => mapMasterclass(record, locale))
    .filter((record): record is PublicMasterclass => record !== null);
}

function mapMasterclass(
  record: MasterclassRecord,
  locale: AppLocale
): PublicMasterclass | null {
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
      }
    : null;
}
