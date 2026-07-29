import Image from 'next/image';
import { ImageLightbox } from './image-lightbox';

type ContentImageGalleryProps = {
  images: string[];
  alt: (index: number) => string;
  emptyLabel: string;
  compact?: boolean;
  portrait?: boolean;
};

export function ContentImageGallery({
  images,
  alt,
  emptyLabel,
  compact = false,
  portrait = false,
}: ContentImageGalleryProps) {
  const renderableImages = images.filter(isRenderableImageUrl);

  if (renderableImages.length === 0) {
    return <ImagePlaceholder label={emptyLabel} />;
  }

  return (
    <ul
      className={
        compact
          ? 'grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3'
          : 'grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3'
      }
    >
      {renderableImages.map((image, index) => (
        <li key={`${image}-${index}`} className="relative">
          <ImageLightbox
            src={image}
            alt={alt(index)}
            className={`w-full ${
              portrait
                ? 'aspect-210/237'
                : 'aspect-4/3 rounded-2xl sm:rounded-3xl'
            }`}
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
              className={`${portrait ? 'object-contain' : 'object-cover'} transition-transform duration-300 group-hover/lightbox:scale-[1.02]`}
            />
          </ImageLightbox>
        </li>
      ))}
    </ul>
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
          contain ? 'object-contain p-6 sm:p-8' : 'object-cover'
        } transition-transform duration-300 group-hover/lightbox:scale-[1.02]`}
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
