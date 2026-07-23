import 'server-only';

import { Locale, Prisma, prisma } from '@ak-strannik/database';
import { cacheLife } from 'next/cache';

import type { Locale as AppLocale } from '@/i18n/routing';
import { getLocalizedTranslation } from '@/lib/content/get-localized-translation';
import { createTeamMemberSlug } from './team-member-slug';

const teamCardSelect = {
  id: true,
  image: true,
  translations: {
    where: { locale: { in: [Locale.ru, Locale.en] } },
    select: { locale: true, name: true, role: true },
  },
} satisfies Prisma.TeamMemberSelect;

const teamDetailSelect = {
  id: true,
  image: true,
  links: true,
  achievements: true,
  translations: {
    where: { locale: { in: [Locale.ru, Locale.en] } },
    select: { locale: true, name: true, role: true, bio: true },
  },
} satisfies Prisma.TeamMemberSelect;

type TeamCardRecord = Prisma.TeamMemberGetPayload<{
  select: typeof teamCardSelect;
}>;

type TeamDetailRecord = Prisma.TeamMemberGetPayload<{
  select: typeof teamDetailSelect;
}>;

export type PublicTeamMemberCard = {
  id: string;
  slug: string;
  image: string;
  name: string;
  role: string;
};

export type PublicTeamMemberDetail = PublicTeamMemberCard & {
  bio: string;
  links: string[];
  achievements: string[];
};

export async function getTeamMembers(
  locale: AppLocale
): Promise<PublicTeamMemberCard[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const records = await prisma.teamMember.findMany({
    orderBy: { createdAt: 'asc' },
    select: teamCardSelect,
  });

  const mappedMembers = records
    .map((record) => mapTeamMemberCard(record, locale))
    .filter((member): member is PublicTeamMemberCard => member !== null);

  const slugCounts = new Map<string, number>();
  for (const member of mappedMembers) {
    slugCounts.set(member.slug, (slugCounts.get(member.slug) ?? 0) + 1);
  }

  const duplicateSlugs = new Set(
    [...slugCounts]
      .filter(([, count]) => count > 1)
      .map(([memberSlug]) => memberSlug)
  );

  for (const duplicateSlug of duplicateSlugs) {
    console.error(
      `[team] Duplicate computed team member slug: ${duplicateSlug}`
    );
  }

  return mappedMembers.filter((member) => !duplicateSlugs.has(member.slug));
}

export async function getTeamMemberBySlug(
  slug: string,
  locale: AppLocale
): Promise<PublicTeamMemberDetail | null> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const records = await prisma.teamMember.findMany({
    select: teamDetailSelect,
  });

  const matches = records.filter((record) => {
    const englishTranslation = record.translations.find(
      (translation) => translation.locale === Locale.en
    );
    const computedSlug = englishTranslation
      ? createTeamMemberSlug(englishTranslation.name)
      : '';

    if (!computedSlug) {
      console.error(
        `[team] Team member ${record.id} has no valid English slug`
      );
      return false;
    }

    return computedSlug === slug;
  });

  if (matches.length !== 1) {
    if (matches.length > 1) {
      console.error(`[team] Ambiguous computed team member slug: ${slug}`);
    }
    return null;
  }

  return mapTeamMemberDetail(matches[0]!, locale);
}

function mapTeamMemberCard(
  record: TeamCardRecord,
  locale: AppLocale
): PublicTeamMemberCard | null {
  const englishTranslation = record.translations.find(
    (translation) => translation.locale === Locale.en
  );
  const slug = englishTranslation
    ? createTeamMemberSlug(englishTranslation.name)
    : '';

  if (!slug) {
    console.error(`[team] Team member ${record.id} has no valid English slug`);
    return null;
  }

  const translation = getLocalizedTranslation(
    record.translations,
    toDatabaseLocale(locale)
  );

  if (!translation) {
    console.error(`[team] Team member ${record.id} has no display translation`);
    return null;
  }

  return {
    id: record.id,
    slug,
    image: record.image,
    name: translation.name,
    role: translation.role,
  };
}

function mapTeamMemberDetail(
  record: TeamDetailRecord,
  locale: AppLocale
): PublicTeamMemberDetail | null {
  const card = mapTeamMemberCard(record, locale);
  const translation = getLocalizedTranslation(
    record.translations,
    toDatabaseLocale(locale)
  );

  if (!card || !translation) return null;

  return {
    ...card,
    bio: translation.bio,
    links: record.links,
    achievements: record.achievements,
  };
}

function toDatabaseLocale(locale: AppLocale): Locale {
  return locale === 'en' ? Locale.en : Locale.ru;
}
