'use client';

import { type ReactNode, useCallback, useLayoutEffect, useRef } from 'react';

import { cn } from '@ak-strannik/ui/lib/utils';

const MASONRY_ROW_HEIGHT = 4;

export function MasonryGrid({
  children,
  className,
  ordered = false,
}: {
  children: ReactNode;
  className?: string;
  ordered?: boolean;
}) {
  const gridRef = useRef<HTMLElement | null>(null);
  const Component = ordered ? 'ol' : 'ul';
  const setGridRef = useCallback((element: HTMLElement | null) => {
    gridRef.current = element;
  }, []);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const items = Array.from(grid.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement
    );
    let animationFrame = 0;

    const layoutItems = () => {
      const gap = Number.parseFloat(
        getComputedStyle(grid).getPropertyValue('--masonry-gap')
      );

      for (const item of items) {
        const span = Math.ceil(
          (item.getBoundingClientRect().height + gap) / MASONRY_ROW_HEIGHT
        );
        const nextGridRowEnd = `span ${span}`;

        if (item.style.gridRowEnd !== nextGridRowEnd) {
          item.style.gridRowEnd = nextGridRowEnd;
        }
      }
    };

    const scheduleLayout = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(layoutItems);
    };

    grid.dataset.masonryReady = 'true';
    layoutItems();

    const resizeObserver = new ResizeObserver(scheduleLayout);
    resizeObserver.observe(grid);
    for (const item of items) resizeObserver.observe(item);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      delete grid.dataset.masonryReady;
      for (const item of items) item.style.gridRowEnd = '';
    };
  }, [children]);

  return (
    <Component
      ref={setGridRef}
      className={cn(
        'columns-1 gap-3 [--masonry-gap:0.75rem] sm:columns-2 sm:gap-4 sm:[--masonry-gap:1rem] xl:columns-3',
        '[&>li]:mb-3 [&>li]:inline-block [&>li]:w-full [&>li]:break-inside-avoid-column sm:[&>li]:mb-4',
        'data-[masonry-ready=true]:grid data-[masonry-ready=true]:columns-auto data-[masonry-ready=true]:grid-flow-row-dense data-[masonry-ready=true]:auto-rows-[4px] data-[masonry-ready=true]:grid-cols-1 data-[masonry-ready=true]:gap-x-3 data-[masonry-ready=true]:gap-y-0 sm:data-[masonry-ready=true]:grid-cols-2 sm:data-[masonry-ready=true]:gap-x-4 xl:data-[masonry-ready=true]:grid-cols-3',
        'data-[masonry-ready=true]:[&>li]:mb-0 data-[masonry-ready=true]:[&>li]:self-start',
        className
      )}
    >
      {children}
    </Component>
  );
}
