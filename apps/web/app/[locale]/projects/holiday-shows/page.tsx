import type { Metadata } from 'next';
import { connection } from 'next/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentImageGallery } from '@/app/_components/content/content-image-gallery';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getHolidayShows } from '@/features/holiday-shows/queries';
import { getLocale } from '@/i18n/get-locale';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pages.projectsHolidayShows',
  });
  return { title: t('title'), description: t('description') };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <HolidayShowsContent params={params} />
    </Suspense>
  );
}

async function HolidayShowsContent({ params }: PageProps) {
  await connection();
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [records, t, common] = await Promise.all([
    getHolidayShows(locale),
    getTranslations('Pages.projectsHolidayShows'),
    getTranslations('Pages.common'),
  ]);

  return (
    <article className="content-page">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="content-page__container">
        <h2 className="content-page__title">{t('title')}</h2>
        {records.length === 0 ? (
          <ContentEmptyState message={common('empty')} />
        ) : (
          <ul className="flex flex-col gap-6">
            {records.map((record) => (
              <li
                key={record.id}
                className="group overflow-hidden rounded-[2rem] border border-border/45 bg-card/55 p-3 shadow-xl shadow-background/25 transition-transform duration-300 hover:-translate-y-1"
              >
                <h2 className="mb-4 text-2xl leading-tight font-semibold sm:text-3xl">
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
                  compact
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
