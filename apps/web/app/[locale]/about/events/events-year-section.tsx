import { ContentImageGallery } from '@/app/_components/content/content-image-gallery';
import { ContentVideoGallery } from '@/app/_components/content/content-video-gallery';
import type { PublicEventsYear } from '@/features/events/queries';

export function EventsYearSection({
  group,
  eventLabel,
  emptyMessage,
  imageAlt,
  videoTitle,
  imageUnavailable,
}: {
  group: PublicEventsYear;
  eventLabel: (index: number) => string;
  emptyMessage: string;
  imageAlt: (eventIndex: number, imageIndex: number) => string;
  videoTitle: (eventIndex: number, videoIndex: number) => string;
  imageUnavailable: string;
}) {
  return (
    <section className="rounded-4xl border border-border/45 bg-card/35 p-5 shadow-xl shadow-background/25 sm:p-8">
      <h2 className="font-hand text-gold text-4xl font-bold sm:text-5xl">
        {group.year}
      </h2>
      {group.events.length === 0 ? (
        <p className="mt-5 rounded-3xl border border-border/35 bg-background/25 px-5 py-4 text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <ol className="mt-7 space-y-6">
          {group.events.map((event, eventIndex) => (
            <li
              key={event.id}
              className="rounded-4xl border border-border/40 bg-background/30 p-4 sm:p-6"
            >
              <p className="text-gold mb-4 text-sm font-semibold tracking-[0.18em] uppercase">
                {eventLabel(eventIndex)}
              </p>
              <p className="leading-8 whitespace-pre-line text-muted-foreground">
                {event.text}
              </p>
              <div className="mt-6 space-y-5">
                {event.images.length > 0 ? (
                  <ContentImageGallery
                    images={event.images}
                    alt={(imageIndex) => imageAlt(eventIndex, imageIndex)}
                    emptyLabel={imageUnavailable}
                  />
                ) : null}
                <ContentVideoGallery
                  videos={event.videos}
                  title={(videoIndex) => videoTitle(eventIndex, videoIndex)}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
