import type { Metadata } from 'next';
import { connection } from 'next/server';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentImageGallery } from '@/app/_components/content/content-image-gallery';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getPartners } from '@/features/partners/queries';
import { routing, type Locale } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'Pages.aboutPartners' });
  return { title: t('title'), description: t('description') };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <PartnersContent params={params} />
    </Suspense>
  );
}

async function PartnersContent({ params }: PageProps) {
  await connection();
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [partners, t, common] = await Promise.all([
    getPartners(locale),
    getTranslations('Pages.aboutPartners'),
    getTranslations('Pages.common'),
  ]);

  return (
    <article className="relative overflow-hidden px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_85%_36%,var(--color-ink-3),transparent_34%)]" />
      <div className="container mx-auto">
        {partners.length === 0 ? (
          <ContentEmptyState message={common('empty')} />
        ) : (
          <ul className="grid gap-6 lg:grid-cols-2">
            {partners.map((partner) => (
              <li
                key={partner.id}
                className="rounded-4xl border border-border/45 bg-card/45 p-4 shadow-xl shadow-background/25 backdrop-blur-sm sm:p-6"
              >
                <ContentImageGallery
                  images={partner.images}
                  alt={(index) =>
                    t('imageAlt', {
                      title: partner.title,
                      number: index + 1,
                    })
                  }
                  emptyLabel={common('imageUnavailable')}
                  compact
                />
                <h2 className="mt-6 text-2xl font-semibold">{partner.title}</h2>
                {partner.text ? (
                  <p className="mt-4 leading-7 whitespace-pre-line text-muted-foreground">
                    {partner.text}
                  </p>
                ) : null}
                {partner.link ? (
                  <a
                    href={partner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold border-gold/30 hover:bg-gold/10 mt-6 inline-flex min-h-11 items-center rounded-full border px-5 py-2 font-medium transition-colors"
                  >
                    {t('website')}
                  </a>
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
