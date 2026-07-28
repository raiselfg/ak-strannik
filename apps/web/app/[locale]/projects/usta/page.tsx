import { connection } from 'next/server';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import {
  ContentImage,
  ContentImageGallery,
} from '@/app/_components/content/content-image-gallery';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { ContentVideoGallery } from '@/app/_components/content/content-video-gallery';
import {
  createPageMetadata,
  type LocalizedPageProps as PageProps,
} from '@/app/_lib/localized-page';
import { getUstaContent } from '@/features/usta/queries';
import { getLocale } from '@/i18n/get-locale';
import type { Locale } from '@/i18n/routing';

export const generateMetadata = createPageMetadata('Pages.projectsUsta');

export default async function Page({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  return (
    <article className="content-page">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="content-page__container">
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
      <h2 className="content-page__title">{t('title')}</h2>
      <p className="mx-auto text-lg leading-8 whitespace-pre-line text-muted-foreground">
        {content.text}
      </p>
      <Link
        href="https://vk.com/ustiamuza"
        target="_blank"
        rel="noopener noreferrer"
        className="group hover:border-gold/45 hover:bg-gold/10 hover:text-gold inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-border/50 bg-card/45 px-5 py-2.5 font-medium shadow-lg shadow-background/20 transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none motion-reduce:transform-none"
      >
        <span>{t('vkLink')}</span>
        <ExternalLink
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
        />
      </Link>

      {content.images.length > 0 ? (
        <ContentImageGallery
          images={content.images}
          alt={(index) => t('imageAlt', { number: index + 1 })}
          emptyLabel={common('imageUnavailable')}
        />
      ) : null}

      {content.achievements.length > 0 ? (
        <section>
          <h2 className="content-page__title">{t('achievementsTitle')}</h2>
          <ul className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {content.achievements.map((achievement, index) => (
              <li
                key={`${achievement}-${index}`}
                className="rounded-4xl border border-border/45 bg-card/45 p-3 shadow-xl shadow-background/25"
              >
                <ContentImage
                  src={achievement}
                  alt={t('achievementAlt', { number: index + 1 })}
                  emptyLabel={common('imageUnavailable')}
                  portrait
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ContentVideoGallery
        videos={content.videos}
        title={(index) => t('videoTitle', { number: index + 1 })}
      />
    </div>
  );
}
