import { connection } from 'next/server';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { getLatestThankYouNotes } from '@/features/thank-you-notes/queries';

const stats = [
  { key: 'participants', value: '40 000' },
  { key: 'audience', value: '150 000' },
  { key: 'funds', value: '10+' },
] as const;

const projects = [
  'musicIsSevenNotes',
  'russianBaroque',
  'starBorn',
  'bravo',
  'blackAndWhite',
  'kindnessTheater',
  'warVictory',
  'heartToHeart',
  'pryalochka',
] as const;

export function AboutSections() {
  return (
    <>
      <AchievementsSection />
      <Suspense fallback={null}>
        <LettersSection />
      </Suspense>
    </>
  );
}

function AchievementsSection() {
  const t = useTranslations('HomeSections.achievements');

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,var(--color-gold)/0.14,transparent_30%),radial-gradient(circle_at_80%_10%,var(--color-ink-3),transparent_28%)]" />
      <div
        aria-hidden="true"
        className="bg-gold/10 motion-safe:animate-ambient-drift absolute top-24 -left-40 -z-10 size-[28rem] rounded-full blur-3xl will-change-transform"
      />
      <div
        aria-hidden="true"
        className="bg-ink-3/60 motion-safe:animate-ambient-drift-reverse absolute right-1/4 bottom-1/3 -z-10 size-96 rounded-full blur-3xl will-change-transform"
      />
      <div className="container mx-auto">
        <div
          data-reveal
          data-reveal-state="pending"
          className="mb-12 max-w-3xl"
        >
          <p className="text-gold mb-3 text-sm font-semibold tracking-[0.28em] uppercase">
            {t('eyebrow')}
          </p>
          <h2 className="font-hand text-5xl leading-[0.9] font-bold tracking-[0.5px] sm:text-7xl">
            {t('title')}
          </h2>
        </div>

        <dl className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.key}
              data-reveal
              data-reveal-state="pending"
              data-reveal-order={index + 1}
              className="landing-card rounded-4xl border border-border/45 bg-background/35 p-6 shadow-xl shadow-background/20 backdrop-blur-sm"
            >
              <dt className="text-sm leading-6 text-muted-foreground">
                {t(`stats.${stat.key}`)}
              </dt>
              <dd className="text-gold mt-3 text-5xl leading-none font-light tracking-tight sm:text-6xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div
            data-reveal
            data-reveal-state="pending"
            className="landing-card rounded-4xl border border-border/45 bg-card/45 p-6 shadow-xl shadow-background/20 backdrop-blur-sm sm:p-8"
          >
            <h3 className="text-2xl font-semibold">{t('projectsTitle')}</h3>
            <p className="mt-4 leading-7 text-muted-foreground">{t('intro')}</p>
            <p className="mt-5 leading-7 text-muted-foreground">
              {t('pandemicNote')}
            </p>
          </div>

          <ul className="grid gap-3">
            {projects.map((project) => (
              <li
                key={project}
                data-reveal
                data-reveal-state="pending"
                className="landing-card before:text-gold rounded-3xl border border-border/40 bg-background/35 px-5 py-4 leading-7 text-muted-foreground shadow-lg shadow-background/10 backdrop-blur-sm before:mr-3 before:content-['✦']"
              >
                {t(`projects.${project}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

async function LettersSection() {
  await connection();
  let letters;
  try {
    letters = await getLatestThankYouNotes();
  } catch {
    console.error('[thank-you-notes] Failed to load latest notes');
    return null;
  }

  if (letters.length === 0) return null;

  const t = await getTranslations('HomeSections.letters');

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="bg-ink-3/65 motion-safe:animate-ambient-drift-reverse absolute right-1/4 bottom-0 -z-10 size-[28rem] rounded-full blur-3xl will-change-transform"
      />
      <div
        aria-hidden="true"
        className="bg-gold/10 motion-safe:animate-soft-pulse absolute top-1/4 -right-44 -z-10 size-96 rounded-full blur-3xl will-change-transform"
      />
      <div className="container mx-auto">
        <div
          data-reveal
          data-reveal-state="pending"
          className="mb-12 max-w-3xl"
        >
          <p className="text-gold mb-3 text-sm font-semibold tracking-[0.28em] uppercase">
            {t('eyebrow')}
          </p>
          <h2 className="font-hand text-5xl leading-[0.9] font-bold tracking-[0.5px] sm:text-7xl">
            {t('title')}
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {letters.map((letter, index) => (
            <li
              key={letter.id}
              data-reveal
              data-reveal-state="pending"
              data-reveal-order={(index % 3) + 1}
              className="landing-card group overflow-hidden rounded-4xl border border-border/45 bg-card/45 p-3 shadow-2xl shadow-background/30 backdrop-blur-sm"
            >
              <ImageLightbox
                src={letter.image}
                alt={t('letterAlt', { number: index + 1 })}
                className="aspect-4/5 w-full rounded-3xl bg-muted"
              >
                <Image
                  src={letter.image}
                  alt={t('letterAlt', { number: index + 1 })}
                  fill
                  sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, 70vw"
                  className="object-cover transition-transform duration-500 group-hover/lightbox:scale-[1.03]"
                />
              </ImageLightbox>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
import { ImageLightbox } from '@/app/_components/content/image-lightbox';
