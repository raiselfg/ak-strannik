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
  variant = 'default',
}: {
  src: string;
  alt: string;
  emptyLabel: string;
  portrait?: boolean;
  contain?: boolean;
  variant?: 'default' | 'rental';
}) {
  const isRental = variant === 'rental';
  const imageSizes = isRental
    ? '(min-width: 1280px) 34vw, (min-width: 640px) 50vw, 100vw'
    : '(min-width: 1024px) 42vw, 90vw';

  if (!isRenderableImageUrl(src)) {
    return (
      <ImagePlaceholder
        label={emptyLabel}
        portrait={portrait}
        flush={isRental}
        naturalHeight={isRental}
      />
    );
  }

  return (
    <ImageLightbox
      src={src}
      alt={alt}
      className={`w-full ${
        isRental ? '' : 'rounded-2xl sm:rounded-3xl'
      } ${isRental ? '' : portrait ? 'aspect-4/5' : 'aspect-4/3'}`}
    >
      {isRental ? (
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1200}
          sizes={imageSizes}
          className="h-auto w-full transition-opacity duration-300 group-hover/lightbox:opacity-90"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={imageSizes}
          className={`${
            contain ? 'p-6 sm:p-8' : ''
          } object-contain transition-opacity duration-300 group-hover/lightbox:opacity-90`}
        />
      )}
    </ImageLightbox>
  );
}

function ImagePlaceholder({
  label,
  portrait = false,
  flush = false,
  naturalHeight = false,
}: {
  label: string;
  portrait?: boolean;
  flush?: boolean;
  naturalHeight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center border border-border/35 bg-muted/35 px-4 text-center text-sm text-muted-foreground sm:px-5 ${
        flush ? '' : 'rounded-2xl sm:rounded-3xl'
      } ${naturalHeight ? 'min-h-40' : portrait ? 'aspect-4/5' : 'aspect-4/3'}`}
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
