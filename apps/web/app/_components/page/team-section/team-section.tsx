import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { getActiveTeamMembers } from '@/features/team/queries';
import type { Locale } from '@/i18n/routing';

export async function TeamSection({ locale }: { locale: Locale }) {
  let members;
  try {
    members = await getActiveTeamMembers(locale);
  } catch (error) {
    const errorCode = getErrorCode(error);
    console.error(
      `[team] Failed to load active team members${errorCode ? ` (${errorCode})` : ''}`
    );
    return null;
  }

  if (members.length === 0) return null;

  const t = await getTranslations('HomeSections.team');

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="via-gold/50 absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent to-transparent" />
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
          {members.map((member) => (
            <li
              key={member.id}
              className="group rounded-4xl border border-border/45 bg-card/45 p-3 shadow-xl shadow-background/25 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
            >
              {member.image ? (
                <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-muted">
                  <Image
                    src={member.image.url}
                    alt={member.image.alt}
                    title={member.image.title ?? undefined}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background/75 to-transparent" />
                </div>
              ) : null}
              <div className="px-2 pt-4 text-center">
                <h3 className="text-xl leading-tight font-semibold">
                  {member.name}
                </h3>
                {member.role ? (
                  <p className="text-gold mt-2 text-sm">{member.role}</p>
                ) : null}
                {member.description ? (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {member.description}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function getErrorCode(error: unknown) {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return null;
  }

  return typeof error.code === 'string' ? error.code : null;
}
