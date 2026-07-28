import { ExternalLink } from 'lucide-react';

import { ContentImage } from '@/app/_components/content/content-image-gallery';
import type { PublicFestivalDetail } from '@/features/festival/queries';
import { getSafeExternalUrl } from '@/lib/url/get-safe-external-url';

type FestivalHeaderProps = {
  festival: Pick<PublicFestivalDetail, 'title' | 'logo' | 'socials'>;
  eyebrow: string;
  logoAlt: string;
  externalLinkLabel: string;
  imageUnavailable: string;
};

export function FestivalDetailHeader({
  festival,
  eyebrow,
  logoAlt,
  externalLinkLabel,
  imageUnavailable,
}: FestivalHeaderProps) {
  const socialLinks = festival.socials
    .map(getSafeExternalUrl)
    .filter((link): link is string => link !== null);

  return (
    <header className="relative overflow-hidden rounded-[2.5rem] border border-border/45 bg-card/55 shadow-2xl shadow-background/30 backdrop-blur-sm">
      <div className="bg-gold/10 absolute -top-32 -left-32 size-80 rounded-full blur-3xl" />
      <div className="relative grid lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-stretch">
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
          <p className="text-gold text-xs font-semibold tracking-[0.28em] uppercase">
            {eyebrow}
          </p>
          <h1 className="font-hand mt-5 max-w-4xl text-3xl leading-[1.1] font-bold tracking-[0.5px] sm:text-7xl lg:text-8xl">
            {festival.title}
          </h1>
          {socialLinks.length > 0 ? (
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
              {socialLinks.map((href, index) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold inline-flex items-center gap-2 border-b border-border pb-1 font-medium transition-colors"
                  >
                    {externalLinkLabel} {index + 1}
                    <ExternalLink aria-hidden="true" className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="border-t border-border/35 bg-background/25 p-4 lg:border-t-0 lg:border-l">
          <ContentImage
            src={festival.logo}
            alt={logoAlt}
            emptyLabel={imageUnavailable}
            contain
          />
        </div>
      </div>
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
