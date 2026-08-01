export type GalleryItemSpan = 2 | 3 | 6;

export function getBalancedGalleryItemSpan(
  index: number,
  imageCount: number
): GalleryItemSpan {
  const remainder = imageCount % 3;

  if (remainder === 1) {
    if (imageCount === 1) return 6;
    return index >= imageCount - 4 ? 3 : 2;
  }

  if (remainder === 2 && index >= imageCount - 2) return 3;
  return 2;
}
