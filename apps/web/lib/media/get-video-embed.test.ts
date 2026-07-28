import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getVideoEmbed } from './get-video-embed.ts';

describe('getVideoEmbed', () => {
  it('converts supported YouTube URLs to privacy-enhanced embeds', () => {
    assert.deepEqual(getVideoEmbed('https://youtu.be/dQw4w9WgXcQ'), {
      provider: 'youtube',
      src: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    });
    assert.deepEqual(
      getVideoEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
      {
        provider: 'youtube',
        src: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      }
    );
  });

  it('converts supported Rutube URLs', () => {
    assert.deepEqual(
      getVideoEmbed('https://rutube.ru/video/0123456789abcdef/'),
      {
        provider: 'rutube',
        src: 'https://rutube.ru/play/embed/0123456789abcdef/',
      }
    );
  });

  it('rejects insecure, credentialed, and unsupported URLs', () => {
    assert.equal(getVideoEmbed('http://youtu.be/dQw4w9WgXcQ'), null);
    assert.equal(getVideoEmbed('https://user@youtu.be/dQw4w9WgXcQ'), null);
    assert.equal(getVideoEmbed('https://example.com/dQw4w9WgXcQ'), null);
    assert.equal(getVideoEmbed('not a URL'), null);
  });
});
