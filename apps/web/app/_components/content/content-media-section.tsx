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
  splitMediaWithoutText?: boolean;
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
  splitMediaWithoutText = false,
}: ContentMediaSectionProps) {
  const hasTitle = title.trim().length > 0;
  const hasText = Boolean(text?.trim());
  const useSplitMediaLayout =
    splitMediaWithoutText &&
    !hasTitle &&
    !hasText &&
    images.length > 0 &&
    videos.length > 0;

  return (
    <section
      className={`rounded-4xl border border-border/45 bg-card/45 shadow-xl shadow-background/25 backdrop-blur-sm ${
        useSplitMediaLayout ? 'p-3 sm:p-4 lg:p-5' : 'p-5 sm:p-7'
      }`}
    >
      {hasTitle || hasText ? (
        <div className="mb-6">
          {hasTitle ? (
            <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
          ) : null}
          {hasText ? (
            <p className="mt-5 leading-8 whitespace-pre-line text-muted-foreground">
              {text}
            </p>
          ) : null}
        </div>
      ) : null}

      {useSplitMediaLayout ? (
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
          <ContentImageGallery
            images={images}
            alt={imageAlt}
            emptyLabel={imageUnavailable}
            compact
          />
          <ContentVideoGallery videos={videos} title={videoTitle} />
        </div>
      ) : (
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
      )}
      {meta?.value.trim() ? (
        <p className="border-gold/25 bg-gold/10 text-gold mt-4 inline-flex rounded-full border px-4 py-1.5 text-sm font-medium">
          {meta.value}
        </p>
      ) : null}
    </section>
  );
}
