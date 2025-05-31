import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

// This is a simplified middleware that will prevent redirect loops
export default function middleware(req) {
  // Define public paths that don't require authentication
  const publicPaths = [
    '/',
    '/sign-in',
    '/sign-up',
    '/api',
    '/course',
    '/dashboard',
    '/prepai',
    '/welcome',
    '/favicon.ico',
    '/_next'
  ];

  const { pathname } = req.nextUrl;
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Always allow public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For non-public paths, get auth state but don't redirect
  // This prevents redirect loops while still allowing Clerk's client-side redirects
  const { userId } = getAuth(req);
  
  // Simply continue the request, let client-side handle auth
  return NextResponse.next();
}

// Only run middleware on routes that might need protection
export const config = {
  matcher: [
    // Skip Next.js static files and images
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};