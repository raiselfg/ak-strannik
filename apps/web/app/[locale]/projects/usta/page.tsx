import type { Metadata } from 'next';
import { connection } from 'next/server';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentImageGallery } from '@/app/_components/content/content-image-gallery';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { ContentVideoGallery } from '@/app/_components/content/content-video-gallery';
import { getUstaContent } from '@/features/usta/queries';
import { routing, type Locale } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'Pages.projectsUsta' });
  return { title: t('title'), description: t('description') };
}

export default async function Page({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('Pages.projectsUsta');

  return (
    <article className="relative overflow-hidden px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="container mx-auto">
        <Suspense fallback={<ContentPageSkeleton embedded />}>
          <UstaContent locale={locale} />
        </Suspense>
      </div>
    </article>
  );
}

async function UstaContent({ locale }: { locale: Locale }) {
  await connection();
  const [content, t, common] = await Promise.all([
    getUstaContent(locale),
    getTranslations('Pages.projectsUsta'),
    getTranslations('Pages.common'),
  ]);

  if (!content) {
    return <ContentEmptyState message={t('empty')} />;
  }

  return (
    <div className="space-y-12">
      <p className="max-w-4xl text-lg leading-8 whitespace-pre-line text-muted-foreground">
        {content.text}
      </p>

      {content.images.length > 0 ? (
        <ContentImageGallery
          images={content.images}
          alt={(index) => t('imageAlt', { number: index + 1 })}
          emptyLabel={common('imageUnavailable')}
        />
      ) : null}

      {content.achievements.length > 0 ? (
        <section>
          <h2 className="font-hand text-4xl font-bold sm:text-5xl">
            {t('achievementsTitle')}
          </h2>
          <div className="mt-7">
            <ContentImageGallery
              images={content.achievements}
              alt={(index) => t('achievementAlt', { number: index + 1 })}
              emptyLabel={common('imageUnavailable')}
            />
          </div>
        </section>
      ) : null}

      <ContentVideoGallery
        videos={content.videos}
        title={(index) => t('videoTitle', { number: index + 1 })}
      />
    </div>
  );
}

function getLocale(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
