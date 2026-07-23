import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentImageGallery } from '@/app/_components/content/content-image-gallery';
import { ContentPageHeader } from '@/app/_components/content/content-page-header';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getPryalochkaContent } from '@/features/pryalochka-of-time/queries';
import { routing, type Locale } from '@/i18n/routing';
import { PryalochkaActorList } from './pryalochka-actor-list';
import { PryalochkaEventList } from './pryalochka-event-list';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pages.projectsPryalochkaOfTime',
  });
  return { title: t('title'), description: t('description') };
}

export default async function Page({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('Pages.projectsPryalochkaOfTime');

  return (
    <article className="px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="container mx-auto">
        <ContentPageHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />
        <Suspense fallback={<ContentPageSkeleton embedded />}>
          <PryalochkaContent locale={locale} />
        </Suspense>
      </div>
    </article>
  );
}

async function PryalochkaContent({ locale }: { locale: Locale }) {
  const [content, t, common] = await Promise.all([
    getPryalochkaContent(locale),
    getTranslations('Pages.projectsPryalochkaOfTime'),
    getTranslations('Pages.common'),
  ]);

  if (!content) {
    return <ContentEmptyState message={t('empty')} />;
  }

  return (
    <div className="space-y-16">
      {content.images.length > 0 ? (
        <ContentImageGallery
          images={content.images}
          alt={(index) => t('imageAlt', { number: index + 1 })}
          emptyLabel={common('imageUnavailable')}
        />
      ) : null}
      <PryalochkaEventList
        events={content.events}
        title={t('eventsTitle')}
        eventLabel={(index) => t('eventLabel', { number: index + 1 })}
        imageAlt={(index) => t('eventImageAlt', { number: index + 1 })}
        linkLabel={t('eventLinkLabel')}
        imageUnavailable={common('imageUnavailable')}
      />
      <PryalochkaActorList actors={content.actors} title={t('actorsTitle')} />
    </div>
  );
}

function getLocale(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
