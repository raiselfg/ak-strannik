'use client';

import { BalancedMasonry } from '@/app/_components/content/balanced-masonry';
import { RentalItemCard } from './rental-item-card';

export type RentalMasonryItem = {
  id: string;
  image: string;
  imageAlt: string;
  imageUnavailable: string;
  caption?: string | null;
  captionKind?: 'heading' | 'text';
  imageWidth?: number | null;
  imageHeight?: number | null;
};

export function RentalMasonry({
  items,
  className,
}: {
  items: readonly RentalMasonryItem[];
  className?: string;
}) {
  return (
    <BalancedMasonry
      items={items}
      className={className}
      minColumnWidth={280}
      maxColumns={3}
      gap={16}
      getItemKey={(item) => item.id}
      getAspectRatio={(item) => {
        if (!item.imageWidth || !item.imageHeight) return undefined;
        return item.imageWidth / item.imageHeight;
      }}
      getEstimatedCaptionHeight={(item, columnWidth) =>
        estimateCaptionHeight(item.caption, columnWidth)
      }
      renderItem={(item, { aspectRatio, onImageLoad, sizes }) => {
        const hasStoredDimensions = Boolean(
          item.imageWidth && item.imageHeight
        );
        const imageWidth = hasStoredDimensions
          ? (item.imageWidth ?? 1600)
          : 1600;
        const imageHeight = hasStoredDimensions
          ? (item.imageHeight ?? 1200)
          : Math.round(imageWidth / aspectRatio);

        return (
          <RentalItemCard
            image={item.image}
            imageAlt={item.imageAlt}
            imageUnavailable={item.imageUnavailable}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            imageSizes={sizes}
            onImageLoad={onImageLoad}
          >
            {item.caption ? (
              item.captionKind === 'heading' ? (
                <h3 className="font-semibold text-foreground">
                  {item.caption}
                </h3>
              ) : (
                item.caption
              )
            ) : null}
          </RentalItemCard>
        );
      }}
    />
  );
}

function estimateCaptionHeight(
  caption: string | null | undefined,
  columnWidth: number
): number {
  if (!caption) return 0;

  const horizontalPadding = 40;
  const verticalPadding = 40;
  const availableTextWidth = Math.max(1, columnWidth - horizontalPadding);
  const approximateCharactersPerLine = Math.max(
    12,
    Math.floor(availableTextWidth / 8)
  );
  const lineCount = caption
    .split('\n')
    .reduce(
      (total, line) =>
        total +
        Math.max(1, Math.ceil(line.length / approximateCharactersPerLine)),
      0
    );

  return verticalPadding + lineCount * 28;
}
