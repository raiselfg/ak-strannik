import { ofetch } from 'ofetch';

import {
  getCsrfToken,
  notifyUnauthorized,
} from '../../features/auth/model/auth-store';
import { normalizeApiError } from './api-error';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const AUTH_ENDPOINTS = new Set([
  '/admin/auth/login',
  '/admin/auth/logout',
  '/admin/auth/me',
]);

export function isAuthEndpoint(request: string | Request) {
  const value = typeof request === 'string' ? request : request.url;

  try {
    const pathname = new URL(value, 'http://admin.local').pathname;
    return [...AUTH_ENDPOINTS].some((endpoint) => pathname.endsWith(endpoint));
  } catch {
    return false;
  }
}

export function shouldNotifyUnauthorized(
  request: string | Request,
  status: number
) {
  return status === 401 && !isAuthEndpoint(request);
}

export const apiClient = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
  },
  onRequest({ options }) {
    const method = String(options.method ?? 'GET').toUpperCase();
    const csrfToken = getCsrfToken();

    if (csrfToken && MUTATING_METHODS.has(method)) {
      const headers = new Headers(options.headers);
      headers.set('X-CSRF-Token', csrfToken);
      options.headers = headers;
    }
  },
  onRequestError({ error }) {
    throw normalizeApiError(error);
  },
  onResponseError({ request, response }) {
    const error = normalizeApiError(
      { data: response._data, response },
      response.status
    );

    if (shouldNotifyUnauthorized(request, error.status)) {
      notifyUnauthorized();
    }

    throw error;
  },
});
