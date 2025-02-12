import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    // Protect all routes except those that start with:
    // - api (your API routes)
    // - _next (Next.js internals)
    // - static files (images, favicon)
    // - auth-related routes
    "/((?!api|_next/static|_next/image|favicon.ico|login|auth).*)",
  ],
};
