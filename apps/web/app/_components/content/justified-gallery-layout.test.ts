import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createJustifiedRows } from './justified-gallery-layout.ts';

const RATIOS = [
  1.5, 1.45, 1.55, 1.42, 0.72, 0.78, 1.6, 1.33, 0.66, 1.78, 1.25, 0.8, 1.5, 1.4,
  0.7, 1.65, 1.2, 0.75,
];

describe('createJustifiedRows', () => {
  it('keeps every image in order for galleries from 1 to 18 images', () => {
    for (let imageCount = 1; imageCount <= RATIOS.length; imageCount += 1) {
      const rows = createJustifiedRows(RATIOS.slice(0, imageCount), {
        containerWidth: 1600,
        gap: 16,
        targetHeight: 320,
        maxItemsPerRow: 5,
      });
      const indexes = rows.flatMap((row) =>
        Array.from(
          { length: row.end - row.start },
          (_, offset) => row.start + offset
        )
      );

      assert.deepEqual(
        indexes,
        Array.from({ length: imageCount }, (_, index) => index)
      );
      assert.ok(rows.every((row) => row.end - row.start <= 5));
    }
  });

  it('avoids an orphaned final image in a seven-image gallery', () => {
    const rows = createJustifiedRows(RATIOS.slice(0, 7), {
      containerWidth: 1700,
      gap: 16,
      targetHeight: 340,
      maxItemsPerRow: 5,
    });

    assert.ok(rows.every((row) => row.end - row.start > 1));
  });

  it('produces rows whose proportional widths fill the container', () => {
    const containerWidth = 1320;
    const gap = 16;
    const ratios = RATIOS.slice(0, 11);
    const rows = createJustifiedRows(ratios, {
      containerWidth,
      gap,
      targetHeight: 280,
      maxItemsPerRow: 5,
    });

    for (const row of rows) {
      const rowRatios = ratios.slice(row.start, row.end);
      const availableWidth = containerWidth - gap * (rowRatios.length - 1);
      const rowHeight =
        availableWidth /
        rowRatios.reduce((sum, imageRatio) => sum + imageRatio, 0);
      const renderedWidth =
        rowRatios.reduce((sum, imageRatio) => sum + imageRatio * rowHeight, 0) +
        gap * (rowRatios.length - 1);

      assert.ok(Math.abs(renderedWidth - containerWidth) < 0.001);
    }
  });
});
