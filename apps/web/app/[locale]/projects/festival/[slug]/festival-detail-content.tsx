import {
  ContentImage,
  ContentImageGallery,
} from '@/app/_components/content/content-image-gallery';
import { ContentVideoGallery } from '@/app/_components/content/content-video-gallery';
import type { PublicFestivalDetail } from '@/features/festival/queries';
import { getVideoEmbed } from '@/lib/media/get-video-embed';
import {
  FestivalDetailHeader,
  FestivalOrganizationsSection,
} from './festival-detail-sections';

type DetailLabels = {
  eyebrow: string;
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
  const hasValidVideos = festival.videos.some(
    (video) => getVideoEmbed(video) !== null
  );

  return (
    <article className="content-page">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,var(--color-gold)/0.12,transparent_28%),radial-gradient(circle_at_86%_38%,var(--color-ink-3),transparent_34%)]" />
      <div className="container mx-auto space-y-24">
        <FestivalDetailHeader
          festival={festival}
          eyebrow={labels.eyebrow}
          externalLinkLabel={labels.externalLink}
        />

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
          <FestivalOrganizationsSection
            organizations={festival.organizations}
            externalLinkLabel={labels.externalLink}
          />
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
