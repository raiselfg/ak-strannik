import { Locale } from '@ak-strannik/database';
import type { ActionFailure } from './action-utils';

export function validateRequiredLocales(
  translations: readonly { locale?: Locale }[] | undefined
): ActionFailure | null {
  const ruCount =
    translations?.filter((translation) => translation.locale === Locale.ru)
      .length ?? 0;
  const enCount =
    translations?.filter((translation) => translation.locale === Locale.en)
      .length ?? 0;

  if (translations?.length === 2 && ruCount === 1 && enCount === 1) {
    return null;
  }

  return {
    success: false,
    message: 'Добавьте ровно по одному переводу на русском и английском языках',
    fieldErrors: {
      translations: ['Обязательны переводы ru и en без дубликатов'],
    },
  };
}
