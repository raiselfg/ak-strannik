import { Locale } from '@ak-strannik/database';

type TranslationWithLocale = {
  locale: Locale;
};

export function getLocalizedTranslation<T extends TranslationWithLocale>(
  translations: readonly T[],
  locale: Locale
): T | null {
  return (
    translations.find((translation) => translation.locale === locale) ??
    translations.find((translation) => translation.locale === Locale.ru) ??
    null
  );
}
