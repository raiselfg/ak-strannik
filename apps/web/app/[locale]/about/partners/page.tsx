import type { Metadata } from 'next';
import { connection } from 'next/server';
import { ExternalLink } from 'lucide-react';
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
          <ul className="grid gap-5">
            {partners.map((partner, partnerIndex) => (
              <li
                key={partner.id}
                className="group hover:border-gold/30 relative overflow-hidden rounded-4xl border border-border/45 bg-card/55 shadow-xl shadow-background/25 backdrop-blur-sm transition-colors"
              >
                <div>
                  <div className="p-6 sm:p-8 lg:p-10">
                    <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                      {partner.title}
                    </h2>
                    {partner.text ? (
                      <p className="mt-5 max-w-2xl leading-7 whitespace-pre-line text-muted-foreground">
                        {partner.text}
                      </p>
                    ) : null}
                    {partner.link ? (
                      <a
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gold mt-8 inline-flex min-h-11 w-fit items-center gap-2 border-b border-border pb-1 font-medium transition-colors"
                      >
                        {t('website')}
                        <ExternalLink
                          aria-hidden="true"
                          className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    ) : null}
                  </div>

                  <div className="relative border-t border-border/35 bg-muted/20 p-3 sm:p-4">
                    <div className="bg-gold/10 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative">
                      <ContentImageGallery
                        images={partner.images}
                        alt={(index) =>
                          t('imageAlt', {
                            title: partner.title,
                            number: index + 1,
                          })
                        }
                        emptyLabel={common('imageUnavailable')}
                      />
                    </div>
                  </div>
                </div>
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
