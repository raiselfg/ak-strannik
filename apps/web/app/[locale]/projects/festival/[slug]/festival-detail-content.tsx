import {
  ContentImage,
  ContentImageGallery,
} from '@/app/_components/content/content-image-gallery';
import { ContentVideoGallery } from '@/app/_components/content/content-video-gallery';
import type { PublicFestivalDetail } from '@/features/festival/queries';
import { getVideoEmbed } from '@/lib/media/get-video-embed';
import { ExternalLink } from 'lucide-react';

type DetailLabels = {
  eyebrow: string;
  logoAlt: string;
  programTitle: string;
  imagesTitle: string;
  imageAlt: (index: number) => string;
  achievementsTitle: string;
  achievementAlt: (index: number) => string;
  videosTitle: string;
  videoTitle: (index: number) => string;
  externalLink: string;
  imageUnavailable: string;
};

export function FestivalDetailContent({
  festival,
  labels,
}: {
  festival: PublicFestivalDetail;
  labels: DetailLabels;
}) {
  const socialLinks = festival.socials
    .map(getSafeExternalUrl)
    .filter((link): link is string => link !== null);
  const hasValidVideos = festival.videos.some(
    (video) => getVideoEmbed(video) !== null
  );

  return (
    <article className="content-page">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="container mx-auto space-y-24">
        <header className="relative overflow-hidden rounded-[2.5rem] border border-border/45 bg-card/55 shadow-2xl shadow-background/30 backdrop-blur-sm">
          <div className="bg-gold/10 absolute -top-32 -left-32 size-80 rounded-full blur-3xl" />
          <div className="relative grid lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-stretch">
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <p className="text-gold text-xs font-semibold tracking-[0.28em] uppercase">
                {labels.eyebrow}
              </p>
              <h1 className="font-hand mt-5 max-w-4xl text-3xl leading-[1.1] font-bold tracking-[0.5px] sm:text-7xl lg:text-8xl">
                {festival.title}
              </h1>
              {socialLinks.length > 0 ? (
                <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
                  {socialLinks.map((href, index) => (
                    <li key={`${href}-${index}`}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gold inline-flex items-center gap-2 border-b border-border pb-1 font-medium transition-colors"
                      >
                        {labels.externalLink} {index + 1}
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
                alt={labels.logoAlt}
                emptyLabel={labels.imageUnavailable}
                contain
              />
            </div>
          </div>
        </header>

        {festival.images.length > 0 ? (
          <section>
            <h2 className="content-page__title">{labels.imagesTitle}</h2>
            <div className="mt-7">
              <ContentImageGallery
                images={festival.images}
                alt={labels.imageAlt}
                emptyLabel={labels.imageUnavailable}
              />
            </div>
          </section>
        ) : null}

        {festival.events.length > 0 ? (
          <section>
            <ol className="mt-8 grid gap-px overflow-hidden rounded-4xl border border-border/45 bg-border/45 md:grid-cols-2">
              {festival.events.map((event) => (
                <li key={event.id} className="bg-card p-6 sm:p-8">
                  <h3 className="mt-4 text-xl font-semibold">{event.title}</h3>
                  <p className="mt-4 leading-8 whitespace-pre-line text-muted-foreground">
                    {event.text}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {festival.nominations ? (
          <section className="rounded-4xl border border-border/45 bg-card/45 p-6 shadow-xl shadow-background/25 sm:p-8">
            <h2 className="content-page__title">
              {festival.nominations.title}
            </h2>
            <p className="mt-5 leading-8 whitespace-pre-line text-muted-foreground">
              {festival.nominations.text}
            </p>
          </section>
        ) : null}

        {festival.jury ? (
          <section>
            <h2 className="content-page__title">{festival.jury.title}</h2>
            {festival.jury.persons.length > 0 ? (
              <ul className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {festival.jury.persons.map((person) => (
                  <li
                    key={person.id}
                    className="rounded-4xl border border-border/45 bg-card/45 p-3 shadow-xl shadow-background/25"
                  >
                    <ContentImage
                      src={person.image}
                      alt={person.name}
                      emptyLabel={labels.imageUnavailable}
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold">{person.name}</h3>
                      <p className="text-gold mt-2">{person.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        {festival.organizations ? (
          <section>
            <h2 className="content-page__title">
              {festival.organizations.title}
            </h2>
            {festival.organizations.items.length > 0 ? (
              <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {festival.organizations.items.map((organization) => {
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
                          {labels.externalLink}
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
            ) : null}
          </section>
        ) : null}

        {festival.achievements.length > 0 ? (
          <section>
            <h2 className="content-page__title">{labels.achievementsTitle}</h2>
            <ul className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {festival.achievements.map((achievement, index) => (
                <li
                  key={`${achievement}-${index}`}
                  className="rounded-4xl border border-border/45 bg-card/45 p-3 shadow-xl shadow-background/25"
                >
                  <ContentImage
                    src={achievement}
                    alt={labels.achievementAlt(index)}
                    emptyLabel={labels.imageUnavailable}
                    portrait
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {hasValidVideos ? (
          <section>
            <h2 className="content-page__title">{labels.videosTitle}</h2>
            <div className="mt-7">
              <ContentVideoGallery
                videos={festival.videos}
                title={labels.videoTitle}
              />
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}

function getSafeExternalUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (
      (url.protocol !== 'http:' && url.protocol !== 'https:') ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}
