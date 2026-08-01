import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  distributeMasonryItems,
  estimateMasonryItemHeight,
  getResponsiveMasonryColumnCount,
} from './balanced-masonry-layout.ts';

describe('balanced masonry layout', () => {
  it('caps responsive columns by the number of items', () => {
    assert.equal(
      getResponsiveMasonryColumnCount({
        containerWidth: 1280,
        gap: 16,
        itemCount: 2,
        maxColumns: 3,
        minColumnWidth: 280,
      }),
      2
    );
  });

  it('uses one, two and three columns at the responsive breakpoints', () => {
    const options = {
      gap: 16,
      itemCount: 10,
      maxColumns: 3,
      minColumnWidth: 280,
    };

    assert.equal(
      getResponsiveMasonryColumnCount({ ...options, containerWidth: 639 }),
      1
    );
    assert.equal(
      getResponsiveMasonryColumnCount({ ...options, containerWidth: 800 }),
      2
    );
    assert.equal(
      getResponsiveMasonryColumnCount({ ...options, containerWidth: 1200 }),
      3
    );
  });

  it('places each next item into the currently shortest column', () => {
    assert.deepEqual(distributeMasonryItems([300, 200, 100, 150], 3, 16), [
      [0],
      [1],
      [2, 3],
    ]);
  });

  it('includes the image ratio and caption in the height estimate', () => {
    assert.equal(
      estimateMasonryItemHeight({
        aspectRatio: 2,
        captionHeight: 60,
        columnWidth: 300,
      }),
      210
    );
  });
});
