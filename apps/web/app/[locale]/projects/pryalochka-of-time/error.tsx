'use client';

import { useTranslations } from 'next-intl';

import { ContentPageError } from '@/app/_components/content/content-page-states';

export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations('Pages.common');
  return (
    <ContentPageError
      title={t('errorTitle')}
      description={t('errorDescription')}
      retry={t('retry')}
      reset={reset}
    />
  );
}
