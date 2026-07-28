import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createTeamMemberSlug } from './team-member-slug.ts';

describe('createTeamMemberSlug', () => {
  it('normalizes spaces and casing', () => {
    assert.equal(
      createTeamMemberSlug('  Svetlana   Isaeva  '),
      'svetlana-isaeva'
    );
  });

  it('keeps supported URL characters', () => {
    assert.equal(
      createTeamMemberSlug('Svetlana Isaeva (USTA)'),
      'svetlana-isaeva-(usta)'
    );
  });

  it('removes unsupported characters and repeated separators', () => {
    assert.equal(
      createTeamMemberSlug('Анна / Anna -- Petrova!'),
      'anna-petrova'
    );
  });

  it('returns an empty slug when no supported characters remain', () => {
    assert.equal(createTeamMemberSlug('Анна'), '');
  });
});
