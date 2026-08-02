import Image from 'next/image';
import type { SyntheticEvent } from 'react';
import { JustifiedImageGallery } from './justified-image-gallery';
import { ImageLightbox } from './image-lightbox';

type ContentImageGalleryProps = {
  images: string[];
  alt: (index: number) => string;
  emptyLabel: string;
  compact?: boolean;
  eagerImageCount?: number;
  initialAspectRatio?: number;
};

export function ContentImageGallery({
  images,
  alt,
  emptyLabel,
  compact = false,
  eagerImageCount = 0,
  initialAspectRatio,
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
      eagerImageCount={eagerImageCount}
      initialAspectRatio={initialAspectRatio}
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
  width,
  height,
  sizes,
  onLoad,
}: {
  src: string;
  alt: string;
  emptyLabel: string;
  portrait?: boolean;
  contain?: boolean;
  variant?: 'default' | 'rental';
  width?: number;
  height?: number;
  sizes?: string;
  onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
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
          width={width ?? 1600}
          height={height ?? 1200}
          sizes={sizes ?? imageSizes}
          onLoad={onLoad}
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
