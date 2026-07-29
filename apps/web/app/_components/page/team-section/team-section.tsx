import { connection } from 'next/server';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { getTeamMembers } from '@/features/team/queries';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';

export async function TeamSection({ locale }: { locale: Locale }) {
  await connection();
  let members;
  try {
    members = await getTeamMembers(locale);
  } catch {
    console.error('[team] Failed to load team members');
    return null;
  }

  if (members.length === 0) return null;

  const t = await getTranslations('HomeSections.team');

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="via-gold/50 absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent to-transparent" />
      <div
        aria-hidden="true"
        className="bg-gold/10 motion-safe:animate-soft-pulse absolute top-1/4 -right-48 -z-10 size-[30rem] rounded-full blur-3xl will-change-transform"
      />
      <div
        aria-hidden="true"
        className="bg-ink-3/70 motion-safe:animate-ambient-drift-reverse absolute bottom-0 -left-52 -z-10 size-[34rem] rounded-full blur-3xl will-change-transform"
      />
      <div className="container mx-auto">
        <div
          data-reveal
          data-reveal-state="pending"
          className="mb-8 max-w-3xl sm:mb-12"
        >
          <p className="text-gold mb-3 text-sm font-semibold tracking-[0.28em] uppercase">
            {t('eyebrow')}
          </p>
          <h2 className="font-hand text-4xl leading-[0.95] font-bold tracking-[0.5px] text-balance sm:text-7xl sm:leading-[0.9]">
            {t('title')}
          </h2>
          <p className="mt-4 text-base text-muted-foreground italic sm:mt-5 sm:text-xl">
            {t('quote')}
          </p>
        </div>
        <ul className="grid gap-4 min-[480px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
          {members.map((member, index) => (
            <li
              key={member.id}
              data-reveal
              data-reveal-state="pending"
              data-reveal-order={(index % 3) + 1}
            >
              <Link
                href={`/team/${member.slug}`}
                className="landing-card group block h-full rounded-4xl border border-border/45 bg-card/45 p-3 shadow-xl shadow-background/25 backdrop-blur-sm focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-muted">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background/75 to-transparent" />
                </div>
                <div className="px-2 pt-4 text-center">
                  <h3 className="text-xl leading-tight font-semibold">
                    {member.name}
                  </h3>
                  {member.role ? (
                    <p className="text-gold mt-2 text-sm">{member.role}</p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
