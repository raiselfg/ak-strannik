import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from './lib/auth';

const PUBLIC_FILE = /\.(.*)$/;
const AUTH_PREFIX = '/api/auth';
const LOGIN_PATH = '/login';

export async function proxy(request: NextRequest) {
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
  const session = await auth.api.getSession({ headers: request.headers });

  if (session?.user && isLoginRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!session?.user && !isLoginRoute) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
