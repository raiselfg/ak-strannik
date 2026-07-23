import {
  ContentImage,
  ContentImageGallery,
} from '@/app/_components/content/content-image-gallery';
import { ContentVideoGallery } from '@/app/_components/content/content-video-gallery';
import type { PublicFestivalDetail } from '@/features/festival/queries';
import { getVideoEmbed } from '@/lib/media/get-video-embed';

type DetailLabels = {
  logoAlt: string;
  programTitle: string;
  imagesTitle: string;
  imageAlt: (index: number) => string;
  achievementsTitle: string;
  achievementAlt: (index: number) => string;
  videosTitle: string;
  videoTitle: (index: number) => string;
  socialsTitle: string;
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
    <article className="relative overflow-hidden px-4 pt-36 pb-20 sm:px-6 sm:pt-40 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="container mx-auto space-y-16">
        <header className="grid gap-8 lg:grid-cols-[minmax(16rem,0.65fr)_1.35fr] lg:items-center">
          <div className="rounded-4xl border border-border/45 bg-card/45 p-3 shadow-xl shadow-background/25">
            <ContentImage
              src={festival.logo}
              alt={labels.logoAlt}
              emptyLabel={labels.imageUnavailable}
            />
          </div>
          <div>
            <h1 className="font-hand text-5xl leading-[0.9] font-bold tracking-[0.5px] sm:text-7xl">
              {festival.title}
            </h1>
          </div>
        </header>

        {festival.events.length > 0 ? (
          <section>
            <h2 className="font-hand text-4xl font-bold sm:text-5xl">
              {labels.programTitle}
            </h2>
            <ol className="mt-7 grid gap-5 md:grid-cols-2">
              {festival.events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-4xl border border-border/45 bg-card/45 p-6 shadow-xl shadow-background/25"
                >
                  <h3 className="text-xl font-semibold">{event.title}</h3>
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
            <h2 className="font-hand text-4xl font-bold sm:text-5xl">
              {festival.nominations.title}
            </h2>
            <p className="mt-5 leading-8 whitespace-pre-line text-muted-foreground">
              {festival.nominations.text}
            </p>
          </section>
        ) : null}

        {festival.jury ? (
          <section>
            <h2 className="font-hand text-4xl font-bold sm:text-5xl">
              {festival.jury.title}
            </h2>
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
            <h2 className="font-hand text-4xl font-bold sm:text-5xl">
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

        {festival.images.length > 0 ? (
          <section>
            <h2 className="font-hand text-4xl font-bold sm:text-5xl">
              {labels.imagesTitle}
            </h2>
            <div className="mt-7">
              <ContentImageGallery
                images={festival.images}
                alt={labels.imageAlt}
                emptyLabel={labels.imageUnavailable}
              />
            </div>
          </section>
        ) : null}

        {festival.achievements.length > 0 ? (
          <section>
            <h2 className="font-hand text-4xl font-bold sm:text-5xl">
              {labels.achievementsTitle}
            </h2>
            <div className="mt-7">
              <ContentImageGallery
                images={festival.achievements}
                alt={labels.achievementAlt}
                emptyLabel={labels.imageUnavailable}
              />
            </div>
          </section>
        ) : null}

        {hasValidVideos ? (
          <section>
            <h2 className="font-hand text-4xl font-bold sm:text-5xl">
              {labels.videosTitle}
            </h2>
            <div className="mt-7">
              <ContentVideoGallery
                videos={festival.videos}
                title={labels.videoTitle}
              />
            </div>
          </section>
        ) : null}

        {socialLinks.length > 0 ? (
          <section>
            <h2 className="font-hand text-4xl font-bold sm:text-5xl">
              {labels.socialsTitle}
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((href, index) => (
                <li key={`${href}-${index}`}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold border-gold/30 hover:bg-gold/10 inline-flex min-h-11 items-center rounded-full border px-5 py-2 font-medium transition-colors"
                  >
                    {labels.externalLink} {index + 1}
                  </a>
                </li>
              ))}
            </ul>
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
