import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentImageGallery } from '@/app/_components/content/content-image-gallery';
import { ContentPageHeader } from '@/app/_components/content/content-page-header';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getExhibitions } from '@/features/exhibitions/queries';
import { routing, type Locale } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pages.projectsExhibitions',
  });
  return { title: t('title'), description: t('description') };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <ExhibitionsContent params={params} />
    </Suspense>
  );
}

async function ExhibitionsContent({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [records, t, common] = await Promise.all([
    getExhibitions(locale),
    getTranslations('Pages.projectsExhibitions'),
    getTranslations('Pages.common'),
  ]);

  return (
    <article className="px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="container mx-auto">
        <ContentPageHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />
        {records.length === 0 ? (
          <ContentEmptyState message={common('empty')} />
        ) : (
          <ul className="space-y-8">
            {records.map((record) => (
              <li
                key={record.id}
                className="rounded-4xl border border-border/45 bg-card/45 p-5 shadow-xl shadow-background/25 sm:p-7"
              >
                <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">
                  {record.title}
                </h2>
                <ContentImageGallery
                  images={record.images}
                  alt={(index) =>
                    t('imageAlt', {
                      title: record.title,
                      number: index + 1,
                    })
                  }
                  emptyLabel={common('imageUnavailable')}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function getLocale(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
