import { NextResponse } from 'next/server';

// This middleware is a pass-through. It does not perform any authentication
// or redirection, ensuring it does not interfere with API routes.
export function middleware(request) {
  return NextResponse.next();
}

// The matcher is configured to run on all paths except for static files.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};