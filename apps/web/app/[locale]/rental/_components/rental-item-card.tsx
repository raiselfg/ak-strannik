import type { ReactNode, SyntheticEvent } from 'react';

import { ContentImage } from '@/app/_components/content/content-image-gallery';

export function RentalItemCard({
  image,
  imageAlt,
  imageUnavailable,
  imageWidth,
  imageHeight,
  imageSizes,
  onImageLoad,
  children,
}: {
  image: string;
  imageAlt: string;
  imageUnavailable: string;
  imageWidth: number;
  imageHeight: number;
  imageSizes: string;
  onImageLoad: (event: SyntheticEvent<HTMLImageElement>) => void;
  children?: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-border/45 bg-card/55 shadow-xl shadow-background/25 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 sm:rounded-[2rem]">
      <ContentImage
        src={image}
        alt={imageAlt}
        emptyLabel={imageUnavailable}
        variant="rental"
        width={imageWidth}
        height={imageHeight}
        sizes={imageSizes}
        onLoad={onImageLoad}
      />
      {children ? (
        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <div className="leading-7 whitespace-pre-line text-muted-foreground">
            {children}
          </div>
        </div>
      ) : null}
    </article>
  );
}
