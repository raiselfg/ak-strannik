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
} satisfies Prisma.ArtistContentSelect;

export type PublicArtist = {
  id: string;
  images: string[];
  videos: string[];
  title: string | null;
  text: string | null;
};

export async function getArtists(locale: AppLocale): Promise<PublicArtist[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const records = await prisma.artistContent.findMany({
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
    .map((record) => {
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
    })
    .filter((record): record is PublicArtist => record !== null);
}
