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

  // For all other routes, just pass through
  // Authentication logic can be added here later if needed
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
