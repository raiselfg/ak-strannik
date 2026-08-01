export const FALLBACK_MASONRY_ASPECT_RATIO = 4 / 3;

export function normalizeMasonryAspectRatio(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return FALLBACK_MASONRY_ASPECT_RATIO;
  }

  return value;
}

export function getResponsiveMasonryColumnCount({
  containerWidth,
  gap,
  itemCount,
  maxColumns,
  minColumnWidth,
}: {
  containerWidth: number;
  gap: number;
  itemCount: number;
  maxColumns: number;
  minColumnWidth: number;
}): number {
  if (itemCount === 0) return 0;

  const width = Math.max(0, containerWidth);
  const breakpointColumns = width < 640 ? 1 : width < 1024 ? 2 : maxColumns;
  const columnsThatFit = Math.max(
    1,
    Math.floor((width + gap) / (minColumnWidth + gap))
  );

  return Math.min(itemCount, maxColumns, breakpointColumns, columnsThatFit);
}

export function estimateMasonryItemHeight({
  aspectRatio,
  captionHeight = 0,
  columnWidth,
}: {
  aspectRatio: number;
  captionHeight?: number;
  columnWidth: number;
}): number {
  return (
    Math.max(0, columnWidth) / normalizeMasonryAspectRatio(aspectRatio) +
    Math.max(0, captionHeight)
  );
}

export function distributeMasonryItems(
  estimatedHeights: readonly number[],
  columnCount: number,
  gap: number
): number[][] {
  const safeColumnCount = Math.max(
    0,
    Math.min(Math.floor(columnCount), estimatedHeights.length)
  );
  const columns = Array.from({ length: safeColumnCount }, () => [] as number[]);
  const columnHeights = new Array<number>(safeColumnCount).fill(0);

  estimatedHeights.forEach((height, itemIndex) => {
    let shortestColumn = 0;

    for (let columnIndex = 1; columnIndex < safeColumnCount; columnIndex += 1) {
      if (
        (columnHeights[columnIndex] ?? Number.POSITIVE_INFINITY) <
        (columnHeights[shortestColumn] ?? Number.POSITIVE_INFINITY)
      ) {
        shortestColumn = columnIndex;
      }
    }

    const column = columns[shortestColumn];
    if (!column) return;

    const itemGap = column.length === 0 ? 0 : Math.max(0, gap);
    column.push(itemIndex);
    columnHeights[shortestColumn] =
      (columnHeights[shortestColumn] ?? 0) + Math.max(0, height) + itemGap;
  });

  return columns;
}
