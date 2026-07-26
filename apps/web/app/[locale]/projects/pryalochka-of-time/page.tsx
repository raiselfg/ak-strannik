import type { Metadata } from 'next';
import { connection } from 'next/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentImageGallery } from '@/app/_components/content/content-image-gallery';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getPryalochkaContent } from '@/features/pryalochka-of-time/queries';
import { getLocale } from '@/i18n/get-locale';
import type { Locale } from '@/i18n/routing';
import { PryalochkaActorList } from './pryalochka-actor-list';
import { PryalochkaEventList } from './pryalochka-event-list';
import Link from 'next/link';

type PageProps = { params: Promise<{ locale: string }> };

const LINKS = [
  { labelKey: 'vkLink' as const, url: 'https://vk.com/spinneroftime' },
  { labelKey: 'telegramLink' as const, url: 'https://t.me/+1GlC5EaCM7g4NjA6' },
  { labelKey: 'dzenLink' as const, url: 'https://dzen.ru/usta?share_to=link' },
];

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pages.projectsPryalochkaOfTime',
  });
  return { title: t('title'), description: t('description') };
}

export default async function Page({ params }: PageProps) {
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  return (
    <article className="content-page">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="content-page__container">
        <Suspense fallback={<ContentPageSkeleton embedded />}>
          <PryalochkaContent locale={locale} />
        </Suspense>
      </div>
    </article>
  );
}

async function PryalochkaContent({ locale }: { locale: Locale }) {
  await connection();
  const [content, t, common] = await Promise.all([
    getPryalochkaContent(locale),
    getTranslations('Pages.projectsPryalochkaOfTime'),
    getTranslations('Pages.common'),
  ]);

  if (!content) {
    return <ContentEmptyState message={t('empty')} />;
  }

  return (
    <div className="space-y-24">
      <h2 className="content-page__title">{t('title')}</h2>
      <PryalochkaEventList
        events={content.events}
        imageAlt={(index) => t('eventImageAlt', { number: index + 1 })}
        linkLabel={t('eventLinkLabel')}
        imageUnavailable={common('imageUnavailable')}
      />
      {content.images.length > 0 ? (
        <section className="rounded-[2.5rem] border border-border/45 bg-card/45 p-3 shadow-2xl shadow-background/25 sm:p-5">
          <ContentImageGallery
            images={content.images}
            alt={(index) => t('imageAlt', { number: index + 1 })}
            emptyLabel={common('imageUnavailable')}
          />
        </section>
      ) : null}
      <PryalochkaActorList actors={content.actors} title={t('actorsTitle')} />
      <div className="flex flex-col gap-2">
        <span>{t('followUs')}</span>
        <div className="flex flex-col gap-2">
          {LINKS.map((link) => (
            <Link
              key={link.labelKey}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:text-gold relative flex min-h-11 w-fit items-center rounded-sm font-medium transition-[color,transform] duration-300 ease-out hover:translate-x-1 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none motion-reduce:transform-none"
            >
              <span className="after:bg-gold relative after:absolute after:right-0 after:-bottom-0.5 after:left-0 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 motion-reduce:after:transition-none">
                - {t(link.labelKey)}
              </span>
            </Link>
          ))}
        </div>
        <span className="text-center">
          ПРОЕКТ РЕАЛИЗУЕТСЯ ПРИ ПОДДЕРЖКЕ ПРЕЗИДЕНТСКОГО ФОНДА КУЛЬТУРНЫХ
          ИНИЦИАТИВ
        </span>
      </div>
    </div>
  );
}
