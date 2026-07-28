import 'server-only';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import { cacheLife } from 'next/cache';

import type { Locale as AppLocale } from '@/i18n/routing';
import { getLocalizedTranslation } from '@/lib/content/get-localized-translation';

const select = {
  id: true,
  image: true,
  translations: { select: { locale: true, text: true } },
} satisfies Prisma.AttractionContentSelect;

type Record = Prisma.AttractionContentGetPayload<{ select: typeof select }>;

export type PublicAttraction = { id: string; image: string; text: string };

export async function getAttractions(
  locale: AppLocale
): Promise<PublicAttraction[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const records = await prisma.attractionContent.findMany({
    orderBy: { createdAt: 'asc' },
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
    .filter((record): record is PublicAttraction => record !== null);
}

function mapRecord(record: Record, locale: AppLocale): PublicAttraction | null {
  const translation = getLocalizedTranslation(
    record.translations,
    locale === 'en' ? Locale.en : Locale.ru
  );
  return translation
    ? { id: record.id, image: record.image, text: translation.text }
    : null;
}
