// import { handleSessionOnEdge } from '@frontegg/nextjs/edge';
// import { type NextRequest } from 'next/server';

// export async function proxy(
//   request: NextRequest
// ): Promise<Response | undefined> {
//   const { pathname, searchParams } = request.nextUrl;
//   const { headers } = request;

//   // Skip authentication for the version endpoint
//   if (pathname === '/api/version') {
//     return undefined; // Skip middleware for this path
//   }

//   // shouldByPassMiddleware from getSessionOnEdge was moved under the hood of handleSessionOnEdge

//   // Additional logic if needed
//   return handleSessionOnEdge({ request, pathname, searchParams, headers });
// }

// export const config = {
//   matcher: [
//     // Protect all routes except those that start with:
//     // - api (your API routes)
//     // - _next (Next.js internals)
//     // - static files (images, favicon)
//     // - auth-related routes
//     // And exclude specific API routes that should be public
//     '/((?!api/version|_next|favicon.ico|images/talus-only-logo.png).*)',
//   ],
// };
