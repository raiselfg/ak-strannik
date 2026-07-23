import 'server-only';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import { cacheLife } from 'next/cache';

import type { Locale as AppLocale } from '@/i18n/routing';
import { getLocalizedTranslation } from '@/lib/content/get-localized-translation';

const select = {
  id: true,
  images: true,
  translations: { select: { locale: true, title: true } },
} satisfies Prisma.ExhibitionContentSelect;

type Record = Prisma.ExhibitionContentGetPayload<{ select: typeof select }>;

export type PublicExhibition = {
  id: string;
  images: string[];
  title: string;
};

export async function getExhibitions(
  locale: AppLocale
): Promise<PublicExhibition[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const records = await prisma.exhibitionContent.findMany({
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
    .map((record) => mapRecord(record, locale))
    .filter((record): record is PublicExhibition => record !== null);
}

function mapRecord(record: Record, locale: AppLocale): PublicExhibition | null {
  const translation = getLocalizedTranslation(
    record.translations,
    locale === 'en' ? Locale.en : Locale.ru
  );
  return translation
    ? { id: record.id, images: record.images, title: translation.title }
    : null;
}
