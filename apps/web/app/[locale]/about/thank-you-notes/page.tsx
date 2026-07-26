import type { Metadata } from 'next';
import { connection } from 'next/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { ContentEmptyState } from '@/app/_components/content/content-empty-state';
import { ContentImage } from '@/app/_components/content/content-image-gallery';
import { ContentPageSkeleton } from '@/app/_components/content/content-page-skeleton';
import { getThankYouNotes } from '@/features/thank-you-notes/queries';
import { getLocale } from '@/i18n/get-locale';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pages.aboutThankYouNotes',
  });
  return { title: t('title'), description: t('description') };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<ContentPageSkeleton />}>
      <ThankYouNotesContent params={params} />
    </Suspense>
  );
}

async function ThankYouNotesContent({ params }: PageProps) {
  await connection();
  const locale = getLocale((await params).locale);
  setRequestLocale(locale);
  const [notes, t, common] = await Promise.all([
    getThankYouNotes(),
    getTranslations('Pages.aboutThankYouNotes'),
    getTranslations('Pages.common'),
  ]);

  return (
    <article className="content-page">
      <div className="content-page__container">
        <h2 className="content-page__title">{t('title')}</h2>
        {notes.length === 0 ? (
          <ContentEmptyState message={common('empty')} />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {notes.map((note, index) => (
              <li
                key={note.id}
                className="rounded-4xl border border-border/45 bg-card/45 p-3 shadow-xl shadow-background/25"
              >
                <ContentImage
                  src={note.image}
                  alt={t('imageAlt', { number: index + 1 })}
                  emptyLabel={common('imageUnavailable')}
                  portrait
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
