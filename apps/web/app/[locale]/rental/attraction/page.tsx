import type { Metadata } from 'next';
import { connection } from 'next/server';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentImage } from '@/app/_components/content/content-image-gallery';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getAttractions } from '@/features/attraction/queries';
import { routing, type Locale } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pages.rentalAttraction',
  });
  return { title: t('title'), description: t('description') };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <AttractionContent params={params} />
    </Suspense>
  );
}

async function AttractionContent({ params }: PageProps) {
  await connection();
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [records, t, common] = await Promise.all([
    getAttractions(locale),
    getTranslations('Pages.rentalAttraction'),
    getTranslations('Pages.common'),
  ]);

  return (
    <article className="px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="container mx-auto">
        {records.length === 0 ? (
          <ContentEmptyState message={common('empty')} />
        ) : (
          <ul className="space-y-7">
            {records.map((record, index) => (
              <li
                key={record.id}
                className="grid gap-6 rounded-4xl border border-border/45 bg-card/45 p-4 shadow-xl shadow-background/25 sm:p-6 md:grid-cols-[minmax(16rem,0.85fr)_1.15fr] md:items-center"
              >
                <ContentImage
                  src={record.image}
                  alt={t('imageAlt', { number: index + 1 })}
                  emptyLabel={common('imageUnavailable')}
                />
                {record.text ? (
                  <p className="text-lg leading-8 whitespace-pre-line text-muted-foreground md:px-3">
                    {record.text}
                  </p>
                ) : null}
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
