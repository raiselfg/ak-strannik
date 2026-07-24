import type { Metadata } from 'next';
import { connection } from 'next/server';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentMediaSection } from '@/app/_components/content/content-media-section';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getCharities } from '@/features/charity/queries';
import { routing, type Locale } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'Pages.aboutCharity' });
  return { title: t('title'), description: t('description') };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <CharityContent params={params} />
    </Suspense>
  );
}

async function CharityContent({ params }: PageProps) {
  await connection();
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [records, t, common] = await Promise.all([
    getCharities(locale),
    getTranslations('Pages.aboutCharity'),
    getTranslations('Pages.common'),
  ]);

  return (
    <article className="relative overflow-hidden px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="container mx-auto">
        {records.length === 0 ? (
          <ContentEmptyState message={common('empty')} />
        ) : (
          <div className="space-y-8">
            {records.map((record) => (
              <ContentMediaSection
                key={record.id}
                title={record.title}
                text={record.text}
                images={record.images}
                videos={record.videos}
                imageAlt={(index) =>
                  t('imageAlt', {
                    title: record.title,
                    number: index + 1,
                  })
                }
                videoTitle={(index) =>
                  t('videoTitle', {
                    title: record.title,
                    number: index + 1,
                  })
                }
                imageUnavailable={common('imageUnavailable')}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function getLocale(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
