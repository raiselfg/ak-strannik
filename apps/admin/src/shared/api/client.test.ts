import { describe, expect, it } from 'vitest';

import { isAuthEndpoint, shouldNotifyUnauthorized } from './client';

describe('API unauthorized handling', () => {
  it.each([
    '/admin/auth/login',
    '/api/v1/admin/auth/me',
    'https://api.example.com/api/v1/admin/auth/logout',
  ])('recognizes expected auth endpoint %s', (request) => {
    expect(isAuthEndpoint(request)).toBe(true);
    expect(shouldNotifyUnauthorized(request, 401)).toBe(false);
  });

  it('notifies globally for an expired business request', () => {
    expect(shouldNotifyUnauthorized('/admin/projects', 401)).toBe(true);
  });

  it('does not notify globally for non-401 failures', () => {
    expect(shouldNotifyUnauthorized('/admin/projects', 403)).toBe(false);
  });
});
