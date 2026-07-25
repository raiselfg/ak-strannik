import type { Metadata } from 'next';
import { connection } from 'next/server';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentImage } from '@/app/_components/content/content-image-gallery';
import { ContentPageHero } from '@/app/_components/content/content-page-hero';
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
    <article className="relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 sm:pt-40 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="container mx-auto">
        <ContentPageHero
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />
        {records.length === 0 ? (
          <ContentEmptyState message={common('empty')} />
        ) : (
          <ol className="space-y-8">
            {records.map((record, index) => (
              <li
                key={record.id}
                className="grid overflow-hidden rounded-[2.5rem] border border-border/45 bg-card/55 shadow-2xl shadow-background/25 lg:grid-cols-2 lg:items-stretch"
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : undefined}>
                  <ContentImage
                    src={record.image}
                    alt={t('imageAlt', { number: index + 1 })}
                    emptyLabel={common('imageUnavailable')}
                  />
                </div>
                <div className="flex min-h-64 flex-col justify-between p-7 sm:p-10 lg:p-12">
                  <span className="text-gold/65 font-hand text-6xl leading-none font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {record.text ? (
                    <p className="mt-10 text-lg leading-8 whitespace-pre-line text-muted-foreground">
                      {record.text}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  );
}

function getLocale(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
