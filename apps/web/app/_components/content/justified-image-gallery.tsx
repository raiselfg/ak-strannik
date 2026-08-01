'use client';

import Image from 'next/image';
import {
  type SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
};

const FALLBACK_ASPECT_RATIO = 4 / 3;

export function JustifiedImageGallery({
  images,
  compact = false,
}: JustifiedImageGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingRatiosRef = useRef<Record<string, number>>({});
  const animationFrameRef = useRef<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [measuredRatios, setMeasuredRatios] = useState<Record<string, number>>(
    {}
  );

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

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    },
    []
  );

  const saveImageRatio = useCallback(
    (key: string, event: SyntheticEvent<HTMLImageElement>) => {
      const image = event.currentTarget;
      const ratio = normalizeAspectRatio(
        image.naturalWidth / image.naturalHeight
      );

      pendingRatiosRef.current[key] = ratio;

      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const pendingRatios = pendingRatiosRef.current;
        pendingRatiosRef.current = {};
        animationFrameRef.current = null;

        setMeasuredRatios((currentRatios) => {
          const hasChanges = Object.entries(pendingRatios).some(
            ([imageKey, imageRatio]) => currentRatios[imageKey] !== imageRatio
          );

          return hasChanges
            ? { ...currentRatios, ...pendingRatios }
            : currentRatios;
        });
      });
    },
    []
  );

  const ratios = useMemo(
    () =>
      images.map(
        (image, index) =>
          measuredRatios[getImageKey(image.src, index)] ?? FALLBACK_ASPECT_RATIO
      ),
    [images, measuredRatios]
  );
  const layout = getLayoutSettings(containerWidth, compact);
  const rows = useMemo(
    () =>
      createJustifiedRows(ratios, {
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
      ratios,
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
        <div
          key={`${row.start}-${row.end}`}
          role="presentation"
          className="flex w-full"
          style={{ gap: layout.gap }}
        >
          {images.slice(row.start, row.end).map((image, rowIndex) => {
            const imageIndex = row.start + rowIndex;
            const imageKey = getImageKey(image.src, imageIndex);
            const ratio = ratios[imageIndex] ?? FALLBACK_ASPECT_RATIO;

            return (
              <div
                key={imageKey}
                role="listitem"
                className="relative min-w-0"
                style={{
                  aspectRatio: ratio,
                  flexBasis: 0,
                  flexGrow: ratio,
                }}
              >
                <ImageLightbox
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full rounded-2xl bg-muted/35 shadow-md shadow-background/15 sm:rounded-3xl"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={imageSizes}
                    onLoad={(event) => saveImageRatio(imageKey, event)}
                    className="object-contain transition-opacity duration-300 group-hover/lightbox:opacity-90"
                  />
                </ImageLightbox>
              </div>
            );
          })}
        </div>
      ))}
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
