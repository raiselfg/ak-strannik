import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getSafeExternalUrl } from './get-safe-external-url.ts';

describe('getSafeExternalUrl', () => {
  it('accepts HTTP and HTTPS links', () => {
    assert.equal(
      getSafeExternalUrl('https://example.com/path'),
      'https://example.com/path'
    );
    assert.equal(
      getSafeExternalUrl('http://example.com/path'),
      'http://example.com/path'
    );
  });

  it('rejects credentials and non-web protocols', () => {
    assert.equal(getSafeExternalUrl('https://user@example.com'), null);
    assert.equal(getSafeExternalUrl('javascript:alert(1)'), null);
    assert.equal(getSafeExternalUrl('mailto:test@example.com'), null);
  });

  it('rejects invalid URLs', () => {
    assert.equal(getSafeExternalUrl('example.com'), null);
  });
});
