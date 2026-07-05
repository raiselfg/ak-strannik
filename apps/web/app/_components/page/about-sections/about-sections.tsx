import Image from 'next/image';
import { useTranslations } from 'next-intl';

const teamMembers = [
  {
    key: 'svetlana',
    image: '/svetlana.webp',
  },
  {
    key: 'aleksey',
    image: '/aleksey.png',
  },
  {
    key: 'ksenia',
    image: '/ksenia.webp',
  },
  {
    key: 'roman',
    image: '/roman.webp',
  },
  {
    key: 'tihon',
    image: '/tihon.webp',
  },
] as const;

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

const letters = [
  '/blag-1.webp',
  '/blag-2.webp',
  '/blag-3.webp',
  '/blag-4.webp',
  '/blag-5.webp',
  '/blag-6.webp',
] as const;

export function AboutSections() {
  return (
    <>
      <TeamSection />
      <AchievementsSection />
      <LettersSection />
    </>
  );
}

function TeamSection() {
  const t = useTranslations('HomeSections.team');

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="via-gold/50 absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent to-transparent" />
      <div className="container mx-auto">
        <div className="mb-12 max-w-3xl">
          <p className="text-gold mb-3 text-sm font-semibold tracking-[0.28em] uppercase">
            {t('eyebrow')}
          </p>
          <h2 className="font-hand text-5xl leading-[0.9] font-bold tracking-[0.5px] sm:text-7xl">
            {t('title')}
          </h2>
          <p className="mt-5 text-lg text-muted-foreground italic sm:text-xl">
            {t('quote')}
          </p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {teamMembers.map((member) => (
            <li
              key={member.key}
              className="group rounded-4xl border border-border/45 bg-card/45 p-3 shadow-xl shadow-background/25 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted">
                <Image
                  src={member.image}
                  alt={t(`members.${member.key}.name`)}
                  fill
                  sizes="(min-width: 1024px) 18vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/75 to-transparent" />
              </div>
              <div className="px-2 pt-4 text-center">
                <h3 className="text-xl leading-tight font-semibold">
                  {t(`members.${member.key}.name`)}
                </h3>
                <p className="text-gold mt-2 text-sm">
                  {t(`members.${member.key}.role`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function AchievementsSection() {
  const t = useTranslations('HomeSections.achievements');

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,var(--color-gold)/0.14,transparent_30%),radial-gradient(circle_at_80%_10%,var(--color-ink-3),transparent_28%)]" />
      <div className="container mx-auto">
        <div className="mb-12 max-w-3xl">
          <p className="text-gold mb-3 text-sm font-semibold tracking-[0.28em] uppercase">
            {t('eyebrow')}
          </p>
          <h2 className="font-hand text-5xl leading-[0.9] font-bold tracking-[0.5px] sm:text-7xl">
            {t('title')}
          </h2>
        </div>

        <dl className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="rounded-4xl border border-border/45 bg-background/35 p-6 shadow-xl shadow-background/20 backdrop-blur-sm"
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
          <div className="rounded-4xl border border-border/45 bg-card/45 p-6 shadow-xl shadow-background/20 backdrop-blur-sm sm:p-8">
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
                className="before:text-gold rounded-3xl border border-border/40 bg-background/35 px-5 py-4 leading-7 text-muted-foreground shadow-lg shadow-background/10 backdrop-blur-sm before:mr-3 before:content-['✦']"
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

function LettersSection() {
  const t = useTranslations('HomeSections.letters');

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="mb-12 max-w-3xl">
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
              key={letter}
              className="group overflow-hidden rounded-4xl border border-border/45 bg-card/45 p-3 shadow-2xl shadow-background/30 backdrop-blur-sm"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted">
                <Image
                  src={letter}
                  alt={t('letterAlt', { number: index + 1 })}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
