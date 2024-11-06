import { NextResponse, type NextRequest } from 'next/server';
import { auth } from './lib/next-auth/auth';
import { PUBLIC_ROUTES, PROTECTED_ROUTES, LOGIN } from './lib/routes';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  const isPublicRoute = PUBLIC_ROUTES.includes(path);
  const isProtectedRoute = PROTECTED_ROUTES.includes(path);
  const isAuthenticate =
    !!session?.user && session.user.exp * 1000 > Date.now();

  if (isProtectedRoute && !isAuthenticate) {
    return NextResponse.redirect(new URL(LOGIN, nextUrl));
  }

  if (isPublicRoute && isAuthenticate && nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
