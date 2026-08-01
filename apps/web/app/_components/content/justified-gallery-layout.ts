export type JustifiedGalleryRow = {
  start: number;
  end: number;
};

type JustifiedGalleryOptions = {
  containerWidth: number;
  gap: number;
  targetHeight: number;
  maxItemsPerRow: number;
};

const FALLBACK_ASPECT_RATIO = 4 / 3;

export function normalizeAspectRatio(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return FALLBACK_ASPECT_RATIO;
  }

  return value;
}

export function createJustifiedRows(
  imageRatios: number[],
  options: JustifiedGalleryOptions
): JustifiedGalleryRow[] {
  if (imageRatios.length === 0) {
    return [];
  }

  if (imageRatios.length === 1) {
    return [{ start: 0, end: 1 }];
  }

  const ratios = imageRatios.map(normalizeAspectRatio);
  const containerWidth = Math.max(1, options.containerWidth);
  const gap = Math.max(0, options.gap);
  const targetHeight = Math.max(1, options.targetHeight);
  const maxItemsPerRow = Math.max(1, Math.floor(options.maxItemsPerRow));
  const costs = new Array<number>(ratios.length + 1).fill(
    Number.POSITIVE_INFINITY
  );
  const nextBreak = new Array<number>(ratios.length + 1).fill(ratios.length);

  costs[ratios.length] = 0;

  for (let start = ratios.length - 1; start >= 0; start -= 1) {
    let ratioSum = 0;
    const lastEnd = Math.min(ratios.length, start + maxItemsPerRow);

    for (let end = start + 1; end <= lastEnd; end += 1) {
      ratioSum += ratios[end - 1] ?? FALLBACK_ASPECT_RATIO;

      const itemCount = end - start;
      const availableWidth = Math.max(
        1,
        containerWidth - gap * (itemCount - 1)
      );
      const rowHeight = availableWidth / ratioSum;
      const relativeDifference = (rowHeight - targetHeight) / targetHeight;
      let rowCost = relativeDifference * relativeDifference;

      if (itemCount === 1) {
        rowCost += 0.65;
      }

      if (rowHeight > targetHeight * 1.7) {
        rowCost += Math.pow(rowHeight / targetHeight - 1.7, 2) * 3;
      }

      if (rowHeight < targetHeight * 0.55) {
        rowCost += Math.pow(0.55 - rowHeight / targetHeight, 2) * 3;
      }

      const totalCost = rowCost + (costs[end] ?? 0);

      if (totalCost < (costs[start] ?? Number.POSITIVE_INFINITY)) {
        costs[start] = totalCost;
        nextBreak[start] = end;
      }
    }
  }

  const rows: JustifiedGalleryRow[] = [];
  let start = 0;

  while (start < ratios.length) {
    const end = Math.max(start + 1, nextBreak[start] ?? ratios.length);
    rows.push({ start, end });
    start = end;
  }

  return rows;
}
