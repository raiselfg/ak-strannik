import Image from 'next/image';

type ContentImageGalleryProps = {
  images: string[];
  alt: (index: number) => string;
  emptyLabel: string;
  compact?: boolean;
};

export function ContentImageGallery({
  images,
  alt,
  emptyLabel,
  compact = false,
}: ContentImageGalleryProps) {
  const renderableImages = images.filter(isRenderableImageUrl);

  if (renderableImages.length === 0) {
    return <ImagePlaceholder label={emptyLabel} />;
  }

  return (
    <ul
      className={
        compact
          ? 'grid grid-cols-2 gap-3'
          : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
      }
    >
      {renderableImages.map((image, index) => (
        <li
          key={`${image}-${index}`}
          className="relative aspect-4/3 overflow-hidden rounded-3xl bg-muted"
        >
          <Image
            src={image}
            alt={alt(index)}
            fill
            sizes={
              compact
                ? '(min-width: 1280px) 18vw, (min-width: 640px) 35vw, 45vw'
                : '(min-width: 1280px) 25vw, (min-width: 640px) 42vw, 90vw'
            }
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}

export function ContentImage({
  src,
  alt,
  emptyLabel,
}: {
  src: string;
  alt: string;
  emptyLabel: string;
}) {
  if (!isRenderableImageUrl(src)) {
    return <ImagePlaceholder label={emptyLabel} />;
  }

  return (
    <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-muted">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 42vw, 90vw"
        className="object-cover"
      />
    </div>
  );
}

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-4/3 items-center justify-center rounded-3xl border border-border/35 bg-muted/35 px-5 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function isRenderableImageUrl(value: string): boolean {
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'cdn.ak-strannik.ru';
  } catch {
    return false;
  }
}
