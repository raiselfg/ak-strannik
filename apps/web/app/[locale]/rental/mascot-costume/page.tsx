import type { Metadata } from 'next';
import { connection } from 'next/server';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentImage } from '@/app/_components/content/content-image-gallery';
import { ContentPageHero } from '@/app/_components/content/content-page-hero';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getMascotCostumes } from '@/features/mascot-costume/queries';
import { routing, type Locale } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pages.rentalMascotCostume',
  });
  return { title: t('title'), description: t('description') };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <MascotCostumeContent params={params} />
    </Suspense>
  );
}

async function MascotCostumeContent({ params }: PageProps) {
  await connection();
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [records, t, common] = await Promise.all([
    getMascotCostumes(locale),
    getTranslations('Pages.rentalMascotCostume'),
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
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {records.map((record, index) => (
              <li
                key={record.id}
                className="group overflow-hidden rounded-[2rem] border border-border/45 bg-card/55 p-3 shadow-xl shadow-background/25 transition-transform duration-300 hover:-translate-y-1"
              >
                <ContentImage
                  src={record.image}
                  alt={t('imageAlt', { number: index + 1 })}
                  emptyLabel={common('imageUnavailable')}
                />
                {record.text ? (
                  <div className="px-4 pt-6 pb-5">
                    <p className="text-gold/70 text-xs font-semibold tracking-[0.22em] uppercase">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-3 leading-7 whitespace-pre-line text-muted-foreground">
                      {record.text}
                    </p>
                  </div>
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
