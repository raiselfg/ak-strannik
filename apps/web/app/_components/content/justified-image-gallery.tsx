'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ImageLightbox } from './image-lightbox';
import {
  createJustifiedRows,
  normalizeAspectRatio,
} from './justified-gallery-layout';

type GalleryImage = {
  src: string;
  alt: string;
};

type JustifiedImageGalleryProps = {
  images: GalleryImage[];
  compact?: boolean;
  eagerImageCount?: number;
  initialAspectRatio?: number;
};

const FALLBACK_ASPECT_RATIO = 4 / 3;

export function JustifiedImageGallery({
  images,
  compact = false,
  eagerImageCount = 0,
  initialAspectRatio = FALLBACK_ASPECT_RATIO,
}: JustifiedImageGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const imageKeys = useMemo(
    () => images.map((image, index) => getImageKey(image.src, index)),
    [images]
  );
  const fallbackRatio = normalizeAspectRatio(initialAspectRatio);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateWidth = (width: number) => {
      setContainerWidth((currentWidth) =>
        Math.abs(currentWidth - width) < 1 ? currentWidth : width
      );
    };

    updateWidth(container.clientWidth);

    const resizeObserver = new ResizeObserver(([entry]) => {
      updateWidth(entry?.contentRect.width ?? container.clientWidth);
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  const initialRatios = useMemo(
    () => imageKeys.map(() => fallbackRatio),
    [fallbackRatio, imageKeys]
  );
  const layout = getLayoutSettings(containerWidth, compact);
  const rows = useMemo(
    () =>
      createJustifiedRows(initialRatios, {
        containerWidth: layout.width,
        gap: layout.gap,
        targetHeight: layout.targetHeight,
        maxItemsPerRow: layout.maxItemsPerRow,
      }),
    [
      layout.gap,
      layout.maxItemsPerRow,
      layout.targetHeight,
      layout.width,
      initialRatios,
    ]
  );
  const imageSizes = getImageSizes(images.length, compact);

  return (
    <div
      ref={containerRef}
      role="list"
      className={`flex w-full flex-col ${
        images.length === 1 ? 'mx-auto max-w-4xl' : ''
      }`}
      style={{ gap: layout.gap }}
    >
      {rows.map((row) => (
        <GalleryRow
          key={`${row.start}-${row.end}`}
          images={images.slice(row.start, row.end)}
          imageKeys={imageKeys.slice(row.start, row.end)}
          imageSizes={imageSizes}
          fallbackRatio={fallbackRatio}
          gap={layout.gap}
          startIndex={row.start}
          eagerImageCount={eagerImageCount}
        />
      ))}
    </div>
  );
}

function GalleryRow({
  images,
  imageKeys,
  imageSizes,
  fallbackRatio,
  gap,
  startIndex,
  eagerImageCount,
}: {
  images: GalleryImage[];
  imageKeys: string[];
  imageSizes: string;
  fallbackRatio: number;
  gap: number;
  startIndex: number;
  eagerImageCount: number;
}) {
  const [measuredRatios, setMeasuredRatios] = useState<Record<string, number>>(
    {}
  );
  const saveImageRatio = useCallback((key: string, ratio: number) => {
    setMeasuredRatios((currentRatios) => {
      const normalizedRatio = normalizeAspectRatio(ratio);

      return currentRatios[key] === normalizedRatio
        ? currentRatios
        : { ...currentRatios, [key]: normalizedRatio };
    });
  }, []);
  const isReady = imageKeys.every(
    (imageKey) => measuredRatios[imageKey] !== undefined
  );

  return (
    <div role="presentation" className="flex w-full" style={{ gap }}>
      {images.map((image, rowIndex) => {
        const imageKey =
          imageKeys[rowIndex] ?? getImageKey(image.src, startIndex + rowIndex);
        const ratio = isReady
          ? (measuredRatios[imageKey] ?? fallbackRatio)
          : fallbackRatio;

        return (
          <div
            key={imageKey}
            role="listitem"
            className="relative min-w-0"
            style={{
              aspectRatio: ratio,
              flexBasis: 0,
              flexGrow: ratio,
              transition:
                'aspect-ratio 500ms ease-out, flex-grow 500ms ease-out',
            }}
          >
            <ImageLightbox
              src={image.src}
              alt={image.alt}
              className="h-full w-full rounded-2xl bg-muted/35 shadow-md shadow-background/15 sm:rounded-3xl"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-0 bg-muted/55 transition-opacity duration-300 ${
                  isReady ? 'opacity-0' : 'animate-pulse opacity-100'
                }`}
              />
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={imageSizes}
                loading={
                  startIndex + rowIndex < eagerImageCount ? 'eager' : 'lazy'
                }
                onLoad={(event) =>
                  saveImageRatio(
                    imageKey,
                    event.currentTarget.naturalWidth /
                      event.currentTarget.naturalHeight
                  )
                }
                onError={() => saveImageRatio(imageKey, fallbackRatio)}
                className={`object-contain transition-opacity duration-300 group-hover/lightbox:opacity-90 ${
                  isReady ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </ImageLightbox>
          </div>
        );
      })}
    </div>
  );
}

function getImageKey(src: string, index: number): string {
  return `${src}-${index}`;
}

function getLayoutSettings(containerWidth: number, compact: boolean) {
  const width = containerWidth || (compact ? 720 : 1080);
  const isMobile = width < 480;
  const gap = compact ? (width >= 640 ? 12 : 8) : width >= 640 ? 16 : 12;

  if (isMobile) {
    return {
      width,
      gap,
      targetHeight: clamp(width * 0.42, 135, 180),
      maxItemsPerRow: 2,
    };
  }

  return {
    width,
    gap,
    targetHeight: compact
      ? clamp(width * 0.22, 150, 230)
      : clamp(width * 0.2, 190, 340),
    maxItemsPerRow: compact ? 4 : width >= 1280 ? 5 : 4,
  };
}

function getImageSizes(imageCount: number, compact: boolean): string {
  if (imageCount === 1) {
    return '(min-width: 1024px) 56rem, 90vw';
  }

  if (compact) {
    return '(min-width: 640px) 33vw, 50vw';
  }

  return '(min-width: 1280px) 33vw, (min-width: 480px) 50vw, 100vw';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
