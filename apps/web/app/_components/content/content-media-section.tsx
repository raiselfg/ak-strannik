import { ContentImageGallery } from './content-image-gallery';
import { ContentVideoGallery } from './content-video-gallery';

type ContentMediaSectionProps = {
  title: string;
  text: string | null;
  images: string[];
  videos: string[];
  imageAlt: (index: number) => string;
  videoTitle: (index: number) => string;
  imageUnavailable: string;
  meta?: { label: string; value: string } | null;
};

export function ContentMediaSection({
  title,
  text,
  images,
  videos,
  imageAlt,
  videoTitle,
  imageUnavailable,
  meta,
}: ContentMediaSectionProps) {
  return (
    <section className="rounded-4xl border border-border/45 bg-card/45 p-5 shadow-xl shadow-background/25 backdrop-blur-sm sm:p-7">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        {meta?.value.trim() ? (
          <p className="border-gold/25 bg-gold/10 text-gold mt-4 inline-flex rounded-full border px-4 py-1.5 text-sm font-medium">
            {meta.label}: {meta.value}
          </p>
        ) : null}
        {text?.trim() ? (
          <p className="mt-5 leading-8 whitespace-pre-line text-muted-foreground">
            {text}
          </p>
        ) : null}
      </div>

      <div className="space-y-5">
        {images.length > 0 ? (
          <ContentImageGallery
            images={images}
            alt={imageAlt}
            emptyLabel={imageUnavailable}
          />
        ) : null}
        <ContentVideoGallery videos={videos} title={videoTitle} />
      </div>
    </section>
  );
}
