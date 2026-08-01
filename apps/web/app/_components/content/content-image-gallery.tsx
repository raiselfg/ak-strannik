import Image from 'next/image';
import { JustifiedImageGallery } from './justified-image-gallery';
import { ImageLightbox } from './image-lightbox';

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
    <JustifiedImageGallery
      images={renderableImages.map((src, index) => ({
        src,
        alt: alt(index),
      }))}
      compact={compact}
    />
  );
}

export function ContentImage({
  src,
  alt,
  emptyLabel,
  portrait = false,
  contain = false,
}: {
  src: string;
  alt: string;
  emptyLabel: string;
  portrait?: boolean;
  contain?: boolean;
}) {
  if (!isRenderableImageUrl(src)) {
    return <ImagePlaceholder label={emptyLabel} portrait={portrait} />;
  }

  return (
    <ImageLightbox
      src={src}
      alt={alt}
      className={`w-full rounded-2xl bg-muted sm:rounded-3xl ${
        portrait ? 'aspect-4/5' : 'aspect-4/3'
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 42vw, 90vw"
        className={`${
          contain ? 'p-6 sm:p-8' : ''
        } object-contain transition-opacity duration-300 group-hover/lightbox:opacity-90`}
      />
    </ImageLightbox>
  );
}

function ImagePlaceholder({
  label,
  portrait = false,
}: {
  label: string;
  portrait?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-border/35 bg-muted/35 px-4 text-center text-sm text-muted-foreground sm:rounded-3xl sm:px-5 ${
        portrait ? 'aspect-4/5' : 'aspect-4/3'
      }`}
    >
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
