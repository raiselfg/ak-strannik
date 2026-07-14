import 'server-only';

import type { Locale } from '@/i18n/routing';
import { getMediaPublicUrl } from './media';
import type { PublicTeamMember } from './types';

type Translation = {
  locale: 'ru' | 'en';
  name: string;
  role: string | null;
  description: string | null;
};

type MediaTranslation = {
  locale: 'ru' | 'en';
  alt: string | null;
  title: string | null;
};

export type TeamMemberRecord = {
  id: string;
  translations: Translation[];
  image: {
    objectKey: string;
    width: number | null;
    height: number | null;
    translations: MediaTranslation[];
  } | null;
};

function selectTranslation<T extends { locale: 'ru' | 'en' }>(
  translations: T[],
  locale: Locale
) {
  return (
    translations.find((translation) => translation.locale === locale) ??
    (locale === 'en'
      ? translations.find((translation) => translation.locale === 'ru')
      : undefined)
  );
}

export function mapTeamMember(
  record: TeamMemberRecord,
  locale: Locale
): PublicTeamMember | null {
  const translation = selectTranslation(record.translations, locale);

  if (!translation?.name.trim()) {
    console.error(
      `[team] Active team member ${record.id} has no usable ${locale} or ru name`
    );
    return null;
  }

  const name = translation.name.trim();
  const mediaTranslation = record.image
    ? selectTranslation(record.image.translations, locale)
    : undefined;

  return {
    id: record.id,
    name,
    role: translation.role?.trim() || null,
    description: translation.description?.trim() || null,
    image: record.image
      ? {
          url: getMediaPublicUrl(record.image.objectKey),
          alt: mediaTranslation?.alt?.trim() || name,
          title: mediaTranslation?.title?.trim() || null,
          width: record.image.width,
          height: record.image.height,
        }
      : null,
  };
}
