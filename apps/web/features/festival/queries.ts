import 'server-only';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import { cacheLife } from 'next/cache';

import type { Locale as AppLocale } from '@/i18n/routing';
import { getLocalizedTranslation } from '@/lib/content/get-localized-translation';

const listSelect = {
  id: true,
  slug: true,
  logo: true,
  images: true,
  translations: {
    select: { locale: true, title: true },
  },
} satisfies Prisma.FestivalContentSelect;

const detailSelect = {
  id: true,
  slug: true,
  logo: true,
  images: true,
  videos: true,
  achievements: true,
  socials: true,
  translations: {
    select: { locale: true, title: true },
  },
  events: {
    orderBy: { position: 'asc' as const },
    select: {
      id: true,
      position: true,
      translations: {
        select: { locale: true, title: true, text: true },
      },
    },
  },
  nominations: {
    select: {
      translations: {
        select: { locale: true, title: true, text: true },
      },
    },
  },
  jury: {
    select: {
      translations: {
        select: { locale: true, title: true },
      },
      persons: {
        orderBy: { position: 'asc' as const },
        select: {
          id: true,
          image: true,
          position: true,
          translations: {
            select: { locale: true, name: true, position: true },
          },
        },
      },
    },
  },
  organizations: {
    select: {
      translations: {
        select: { locale: true, title: true },
      },
      organizations: {
        orderBy: { position: 'asc' as const },
        select: {
          id: true,
          position: true,
          value: true,
          translations: {
            select: { locale: true, name: true },
          },
        },
      },
    },
  },
} satisfies Prisma.FestivalContentSelect;

type FestivalListRecord = Prisma.FestivalContentGetPayload<{
  select: typeof listSelect;
}>;
type FestivalDetailRecord = Prisma.FestivalContentGetPayload<{
  select: typeof detailSelect;
}>;

export type PublicFestivalCard = {
  id: string;
  slug: string;
  title: string;
  cover: string;
};

export type PublicFestivalDetail = {
  id: string;
  slug: string;
  logo: string;
  title: string;
  images: string[];
  videos: string[];
  achievements: string[];
  socials: string[];
  events: Array<{ id: string; position: number; title: string; text: string }>;
  nominations: { title: string; text: string } | null;
  jury: {
    title: string;
    persons: Array<{
      id: string;
      position: number;
      image: string;
      name: string;
      role: string;
    }>;
  } | null;
  organizations: {
    title: string;
    items: Array<{
      id: string;
      position: number;
      name: string;
      value: string;
    }>;
  } | null;
};

export async function getFestivals(
  locale: AppLocale
): Promise<PublicFestivalCard[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const records = await prisma.festivalContent.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      ...listSelect,
      translations: {
        ...listSelect.translations,
        where: { locale: { in: getRequestedLocales(locale) } },
      },
    },
  });

  return records
    .map((record) => mapFestivalCard(record, locale))
    .filter((record): record is PublicFestivalCard => record !== null);
}

export async function getFestivalBySlug(
  locale: AppLocale,
  slug: string
): Promise<PublicFestivalDetail | null> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  if (!slug) return null;

  const localeFilter = { locale: { in: getRequestedLocales(locale) } };
  const record = await prisma.festivalContent.findUnique({
    where: { slug },
    select: {
      ...detailSelect,
      translations: { ...detailSelect.translations, where: localeFilter },
      events: {
        ...detailSelect.events,
        select: {
          ...detailSelect.events.select,
          translations: {
            ...detailSelect.events.select.translations,
            where: localeFilter,
          },
        },
      },
      nominations: {
        select: {
          translations: {
            ...detailSelect.nominations.select.translations,
            where: localeFilter,
          },
        },
      },
      jury: {
        select: {
          translations: {
            ...detailSelect.jury.select.translations,
            where: localeFilter,
          },
          persons: {
            ...detailSelect.jury.select.persons,
            select: {
              ...detailSelect.jury.select.persons.select,
              translations: {
                ...detailSelect.jury.select.persons.select.translations,
                where: localeFilter,
              },
            },
          },
        },
      },
      organizations: {
        select: {
          translations: {
            ...detailSelect.organizations.select.translations,
            where: localeFilter,
          },
          organizations: {
            ...detailSelect.organizations.select.organizations,
            select: {
              ...detailSelect.organizations.select.organizations.select,
              translations: {
                ...detailSelect.organizations.select.organizations.select
                  .translations,
                where: localeFilter,
              },
            },
          },
        },
      },
    },
  });

  return record ? mapFestivalDetail(record, locale) : null;
}

function mapFestivalCard(
  record: FestivalListRecord,
  locale: AppLocale
): PublicFestivalCard | null {
  if (!record.slug.trim()) {
    console.error('[festival] Ignoring record with an empty slug');
    return null;
  }
  const translation = localize(record.translations, locale);
  return translation
    ? {
        id: record.id,
        slug: record.slug,
        title: translation.title,
        cover: record.images[0] || record.logo,
      }
    : null;
}

function mapFestivalDetail(
  record: FestivalDetailRecord,
  locale: AppLocale
): PublicFestivalDetail | null {
  const translation = localize(record.translations, locale);
  if (!translation) return null;

  const nominationsTranslation = record.nominations
    ? localize(record.nominations.translations, locale)
    : null;
  const juryTranslation = record.jury
    ? localize(record.jury.translations, locale)
    : null;
  const organizationsTranslation = record.organizations
    ? localize(record.organizations.translations, locale)
    : null;

  return {
    id: record.id,
    slug: record.slug,
    logo: record.logo,
    title: translation.title,
    images: record.images,
    videos: record.videos,
    achievements: record.achievements,
    socials: record.socials,
    events: record.events.flatMap((event) => {
      const item = localize(event.translations, locale);
      return item
        ? [
            {
              id: event.id,
              position: event.position,
              title: item.title,
              text: item.text,
            },
          ]
        : [];
    }),
    nominations:
      record.nominations && nominationsTranslation
        ? {
            title: nominationsTranslation.title,
            text: nominationsTranslation.text,
          }
        : null,
    jury:
      record.jury && juryTranslation
        ? {
            title: juryTranslation.title,
            persons: record.jury.persons.flatMap((person) => {
              const item = localize(person.translations, locale);
              return item
                ? [
                    {
                      id: person.id,
                      position: person.position,
                      image: person.image,
                      name: item.name,
                      role: item.position,
                    },
                  ]
                : [];
            }),
          }
        : null,
    organizations:
      record.organizations && organizationsTranslation
        ? {
            title: organizationsTranslation.title,
            items: record.organizations.organizations.flatMap(
              (organization) => {
                const item = localize(organization.translations, locale);
                return item
                  ? [
                      {
                        id: organization.id,
                        position: organization.position,
                        name: item.name,
                        value: organization.value,
                      },
                    ]
                  : [];
              }
            ),
          }
        : null,
  };
}

function localize<T extends { locale: Locale }>(
  translations: readonly T[],
  locale: AppLocale
): T | null {
  return getLocalizedTranslation(
    translations,
    locale === 'en' ? Locale.en : Locale.ru
  );
}

function getRequestedLocales(locale: AppLocale): Locale[] {
  return locale === 'en' ? [Locale.en, Locale.ru] : [Locale.ru];
}
