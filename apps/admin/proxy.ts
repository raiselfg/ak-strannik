import { getSessionCookie } from 'better-auth/cookies';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const AUTH_PREFIX = '/api/auth';
const LOGIN_PATH = '/login';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith(AUTH_PREFIX) ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const isLoginRoute = pathname === LOGIN_PATH;
  const hasSession = Boolean(
    getSessionCookie(request, { cookiePrefix: 'strannik_auth' })
  );

  if (hasSession && isLoginRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!hasSession && !isLoginRoute) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
