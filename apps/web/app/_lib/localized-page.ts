import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getLocale } from '@/i18n/get-locale';
import type messages from '@/messages/en.json';

export type LocalizedPageProps = {
  params: Promise<{ locale: string }>;
};

type PageNamespace = keyof typeof messages.Pages;

export function createPageMetadata(namespace: `Pages.${PageNamespace}`) {
  return async function generateMetadata({
    params,
  }: LocalizedPageProps): Promise<Metadata> {
    const locale = getLocale((await params).locale);
    const t = await getTranslations({ locale, namespace });

    return {
      title: t('title'),
      description: t('description'),
    };
  };
}
