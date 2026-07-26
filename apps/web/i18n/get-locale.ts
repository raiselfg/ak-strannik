import { hasLocale } from 'next-intl';

import { routing, type Locale } from './routing';

export function getLocale(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
