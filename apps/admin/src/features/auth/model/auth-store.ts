export type AuthStatus =
  | 'idle'
  | 'checking'
  | 'authenticated'
  | 'unauthenticated';

let csrfToken: string | null = null;
let unauthorizedHandler: (() => void | Promise<void>) | null = null;

export function getCsrfToken() {
  return csrfToken;
}

export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

export function setUnauthorizedHandler(
  handler: (() => void | Promise<void>) | null
) {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized() {
  void unauthorizedHandler?.();
}
