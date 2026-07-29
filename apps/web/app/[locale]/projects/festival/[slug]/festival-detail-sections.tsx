import { ExternalLink } from 'lucide-react';

import type { PublicFestivalDetail } from '@/features/festival/queries';
import { getSafeExternalUrl } from '@/lib/url/get-safe-external-url';

type FestivalHeaderProps = {
  festival: Pick<PublicFestivalDetail, 'title' | 'socials'>;
  eyebrow: string;
  externalLinkLabel: string;
};

export function FestivalDetailHeader({
  festival,
  eyebrow,
  externalLinkLabel,
}: FestivalHeaderProps) {
  const socialLinks = festival.socials
    .map(getSafeExternalUrl)
    .filter((link): link is string => link !== null);

  return (
    <header className="relative max-w-5xl border-l-2 border-gold/60 py-3 pl-5 sm:py-5 sm:pl-8">
      <div className="bg-gold/10 absolute top-1/2 left-0 -z-10 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      <p className="text-gold text-xs font-semibold tracking-[0.28em] uppercase">
        {eyebrow}
      </p>
      <h1 className="font-hand mt-4 max-w-4xl text-4xl leading-[1.05] font-bold tracking-[0.5px] text-balance sm:text-5xl lg:text-6xl">
        {festival.title}
      </h1>
      {socialLinks.length > 0 ? (
        <ul className="mt-7 flex flex-wrap gap-3">
          {socialLinks.map((href, index) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:border-gold/50 hover:bg-gold/10 hover:text-gold inline-flex min-h-10 items-center gap-2 rounded-full border border-border/60 bg-card/35 px-4 py-2 text-sm font-medium transition-colors"
              >
                {externalLinkLabel} {index + 1}
                <ExternalLink aria-hidden="true" className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}

export function FestivalOrganizationsSection({
  organizations,
  externalLinkLabel,
}: {
  organizations: NonNullable<PublicFestivalDetail['organizations']>;
  externalLinkLabel: string;
}) {
  if (organizations.items.length === 0) return null;

  return (
    <section>
      <h2 className="content-page__title">{organizations.title}</h2>
      <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.items.map((organization) => {
          const href = getSafeExternalUrl(organization.value);
          return (
            <li
              key={organization.id}
              className="rounded-3xl border border-border/40 bg-card/45 p-5"
            >
              <h3 className="font-semibold">{organization.name}</h3>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold mt-3 inline-flex font-medium"
                >
                  {externalLinkLabel}
                </a>
              ) : (
                <p className="mt-2 text-muted-foreground">
                  {organization.value}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
