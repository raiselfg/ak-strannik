import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getTeamMemberBySlug } from '@/features/team/queries';
import { routing, type Locale } from '@/i18n/routing';
import { TeamMemberPageSkeleton } from './team-member-page-skeleton';

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = getValidLocale(rawLocale);
  const [member, metadata] = await Promise.all([
    getTeamMemberBySlug(slug, locale),
    getTranslations({ locale, namespace: 'Metadata' }),
  ]);

  if (!member) return {};

  const descriptionSource =
    member.bio.trim() || member.role.trim() || metadata('description');

  return {
    title: `${member.name} — ${metadata('title')}`,
    description: truncateDescription(descriptionSource),
  };
}

export default function TeamMemberPage({ params }: PageProps) {
  return (
    <Suspense fallback={<TeamMemberPageSkeleton />}>
      <TeamMemberContent params={params} />
    </Suspense>
  );
}

async function TeamMemberContent({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = getValidLocale(rawLocale);
  setRequestLocale(locale);

  const member = await getTeamMemberBySlug(slug, locale);
  if (!member) notFound();

  const t = await getTranslations('TeamDetail');
  const links = member.links
    .map((href, index) => getExternalLink(href, index + 1))
    .filter((link): link is ExternalLink => link !== null);

  return (
    <article className="relative overflow-hidden px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_85%_35%,var(--color-ink-3),transparent_32%)]" />
      <div className="container mx-auto">
        <div className="grid gap-8 lg:grid-cols-[minmax(18rem,0.75fr)_1.25fr] lg:items-start">
          <div className="overflow-hidden rounded-4xl border border-border/45 bg-card/45 p-3 shadow-2xl shadow-background/30 backdrop-blur-sm">
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-muted">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(min-width: 1024px) 38vw, 90vw"
                className="object-cover"
              />
            </div>
            {links.length > 0 ? (
              <section className="mt-9 border-t border-border/35 pt-7">
                <h2 className="text-xl font-semibold">{t('linksTitle')}</h2>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {links.map((link) => (
                    <li key={`${link.href}-${link.index}`}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:border-gold/45 hover:text-gold inline-flex min-h-11 items-center rounded-full border border-border/50 bg-background/30 px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                      >
                        {link.hostname ||
                          t('linkLabel', { number: link.index })}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <div className="rounded-4xl border border-border/45 bg-background/35 p-6 shadow-xl shadow-background/20 backdrop-blur-md sm:p-8 lg:p-10">
            <p className="text-gold mb-3 text-sm font-semibold tracking-[0.28em] uppercase">
              {t('eyebrow')}
            </p>
            <h1 className="font-hand text-5xl leading-[0.9] font-bold tracking-[0.5px] sm:text-7xl">
              {member.name}
            </h1>
            {member.role ? (
              <p className="text-gold mt-5 text-lg font-medium sm:text-xl">
                {member.role}
              </p>
            ) : null}
            {member.bio ? (
              <p className="mt-7 text-lg leading-8 whitespace-pre-line text-muted-foreground">
                {member.bio}
              </p>
            ) : null}
          </div>
        </div>

        {member.achievements.length > 0 ? (
          <section className="mt-16">
            <div className="mb-10 max-w-3xl">
              <p className="text-gold mb-3 text-sm font-semibold tracking-[0.28em] uppercase">
                {t('achievementsEyebrow')}
              </p>
              <h2 className="font-hand text-4xl leading-none font-bold sm:text-6xl">
                {t('achievementsTitle')}
              </h2>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {member.achievements.map((image, index) => (
                <li
                  key={`${image}-${index}`}
                  className="overflow-hidden rounded-4xl border border-border/45 bg-card/45 p-3 shadow-xl shadow-background/25 backdrop-blur-sm"
                >
                  <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-muted">
                    <Image
                      src={image}
                      alt={t('achievementAlt', {
                        name: member.name,
                        number: index + 1,
                      })}
                      fill
                      sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}

type ExternalLink = {
  href: string;
  hostname: string;
  index: number;
};

function getExternalLink(href: string, index: number): ExternalLink | null {
  try {
    const url = new URL(href);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

    return {
      href: url.toString(),
      hostname: url.hostname.replace(/^www\./, ''),
      index,
    };
  } catch {
    console.error(`[team] Ignoring invalid external link at position ${index}`);
    return null;
  }
}

function getValidLocale(locale: string): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

function truncateDescription(value: string): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 160) return normalized;
  return `${normalized.slice(0, 157).trimEnd()}…`;
}
