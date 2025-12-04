// import { handleSessionOnEdge } from '@frontegg/nextjs/edge';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(
  request: NextRequest
): Promise<Response | undefined> {
  const { pathname } = request.nextUrl;

  // Skip middleware for Next.js internal routes, RSC requests, and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('__rsc') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/i)
  ) {
    return NextResponse.next();
  }

  // Skip authentication for the version endpoint
  //   if (pathname === '/api/version') {
  //     return undefined; // Skip middleware for this path
  //   }

  // shouldByPassMiddleware from getSessionOnEdge was moved under the hood of handleSessionOnEdge

  // Additional logic if needed
  //   return handleSessionOnEdge({ request, pathname, searchParams, headers });
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect all routes except those that start with:
    // - api (your API routes)
    // - _next (Next.js internals)
    // - static files (images, favicon)
    // - auth-related routes
    // And exclude specific API routes that should be public
    '/((?!api/version|_next|favicon.ico|images/talus-only-logo.png).*)',
  ],
};
