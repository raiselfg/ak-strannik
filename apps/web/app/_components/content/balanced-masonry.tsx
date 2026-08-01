'use client';

import {
  type ReactNode,
  type SyntheticEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cn } from '@ak-strannik/ui/lib/utils';
import {
  distributeMasonryItems,
  estimateMasonryItemHeight,
  FALLBACK_MASONRY_ASPECT_RATIO,
  getResponsiveMasonryColumnCount,
  normalizeMasonryAspectRatio,
} from './balanced-masonry-layout';

type RenderItemOptions = {
  aspectRatio: number;
  onImageLoad: (event: SyntheticEvent<HTMLImageElement>) => void;
  sizes: string;
};

type BalancedMasonryProps<Item> = {
  items: readonly Item[];
  renderItem: (item: Item, options: RenderItemOptions) => ReactNode;
  getItemKey: (item: Item) => string;
  getAspectRatio?: (item: Item) => number | undefined;
  getEstimatedCaptionHeight?: (item: Item, columnWidth: number) => number;
  className?: string;
  gap?: number;
  maxColumns?: number;
  minColumnWidth?: number;
  smallGridLimit?: number;
};

const DEFAULT_CONTAINER_WIDTH = 1200;

export function BalancedMasonry<Item>({
  items,
  renderItem,
  getItemKey,
  getAspectRatio,
  getEstimatedCaptionHeight,
  className,
  gap = 16,
  maxColumns = 3,
  minColumnWidth = 280,
  smallGridLimit = 4,
}: BalancedMasonryProps<Item>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(DEFAULT_CONTAINER_WIDTH);
  const [measuredRatios, setMeasuredRatios] = useState<Record<string, number>>(
    {}
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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

  const saveImageRatio = useCallback(
    (itemKey: string, event: SyntheticEvent<HTMLImageElement>) => {
      const image = event.currentTarget;
      const ratio = normalizeMasonryAspectRatio(
        image.naturalWidth / image.naturalHeight
      );

      setMeasuredRatios((currentRatios) => {
        const currentRatio = currentRatios[itemKey];
        return currentRatio !== undefined &&
          Math.abs(currentRatio - ratio) < 0.001
          ? currentRatios
          : { ...currentRatios, [itemKey]: ratio };
      });
    },
    []
  );

  if (items.length === 0) return null;

  if (items.length <= smallGridLimit) {
    return (
      <div ref={containerRef} className={cn('w-full', className)}>
        <ul className={getSmallGridClassName(items.length)}>
          {items.map((item) => {
            const itemKey = getItemKey(item);
            const aspectRatio = normalizeMasonryAspectRatio(
              measuredRatios[itemKey] ??
                getAspectRatio?.(item) ??
                FALLBACK_MASONRY_ASPECT_RATIO
            );

            return (
              <li key={itemKey} className="min-w-0 self-start">
                {renderItem(item, {
                  aspectRatio,
                  onImageLoad: (event) => saveImageRatio(itemKey, event),
                  sizes: getImageSizes(items.length, 1),
                })}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const columnCount = getResponsiveMasonryColumnCount({
    containerWidth,
    gap,
    itemCount: items.length,
    maxColumns,
    minColumnWidth,
  });
  const columnWidth =
    (containerWidth - gap * Math.max(0, columnCount - 1)) / columnCount;
  const aspectRatios = items.map((item) => {
    const itemKey = getItemKey(item);
    return normalizeMasonryAspectRatio(
      measuredRatios[itemKey] ??
        getAspectRatio?.(item) ??
        FALLBACK_MASONRY_ASPECT_RATIO
    );
  });
  const columns = distributeMasonryItems(
    items.map((item, index) =>
      estimateMasonryItemHeight({
        aspectRatio: aspectRatios[index] ?? FALLBACK_MASONRY_ASPECT_RATIO,
        captionHeight: getEstimatedCaptionHeight?.(item, columnWidth),
        columnWidth,
      })
    ),
    columnCount,
    gap
  );

  return (
    <div
      ref={containerRef}
      role="list"
      className={cn('grid w-full items-start', className)}
      style={{
        gap,
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
      }}
    >
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          role="presentation"
          className="flex min-w-0 flex-col"
          style={{ gap }}
        >
          {column.map((itemIndex) => {
            const item = items[itemIndex];
            if (!item) return null;

            const itemKey = getItemKey(item);
            return (
              <div key={itemKey} role="listitem" className="min-w-0">
                {renderItem(item, {
                  aspectRatio:
                    aspectRatios[itemIndex] ?? FALLBACK_MASONRY_ASPECT_RATIO,
                  onImageLoad: (event) => saveImageRatio(itemKey, event),
                  sizes: getImageSizes(items.length, columnCount),
                })}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function getSmallGridClassName(itemCount: number): string {
  if (itemCount === 1) {
    return 'mx-auto grid w-full max-w-md grid-cols-1 gap-3 sm:gap-4';
  }

  if (itemCount === 2 || itemCount === 4) {
    return 'mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4';
  }

  return 'mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3';
}

function getImageSizes(itemCount: number, columnCount: number): string {
  if (itemCount === 1) {
    return '(min-width: 640px) 28rem, calc(100vw - 2rem)';
  }

  if (columnCount === 1) return 'calc(100vw - 2rem)';
  if (columnCount === 2) {
    return '(min-width: 640px) 46vw, calc(100vw - 2rem)';
  }

  return '(min-width: 1024px) 31vw, (min-width: 640px) 46vw, calc(100vw - 2rem)';
}
