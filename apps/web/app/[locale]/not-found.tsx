import { getLocale, getTranslations } from 'next-intl/server';

import { NotFoundScene } from '@/app/_components/page/not-found-scene';

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations('Pages.common');
  const homeHref = locale === 'en' ? '/en' : '/';

  return (
    <NotFoundScene
      title={t('notFoundTitle')}
      description={t('notFoundDescription')}
      eyebrow={t('notFoundEyebrow')}
      homeLabel={t('homeCta')}
      contactLabel={t('contactCta')}
      homeHref={homeHref}
    />
  );
}
