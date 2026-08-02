import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { resolveEventsYearFilter } from './resolve-events-year-filter.ts';

const years = ['2025', '2015-2018', 'Ранее'];

describe('resolveEventsYearFilter', () => {
  it('accepts every available filter value, including year ranges', () => {
    assert.equal(resolveEventsYearFilter('2025', years), '2025');
    assert.equal(resolveEventsYearFilter('2015-2018', years), '2015-2018');
    assert.equal(resolveEventsYearFilter('Ранее', years), 'Ранее');
  });

  it('uses no year filter when all years are selected', () => {
    assert.equal(resolveEventsYearFilter('all', years), undefined);
  });

  it('falls back to the latest group for missing or unknown values', () => {
    assert.equal(resolveEventsYearFilter(undefined, years), null);
    assert.equal(resolveEventsYearFilter('unknown', years), null);
  });
});
