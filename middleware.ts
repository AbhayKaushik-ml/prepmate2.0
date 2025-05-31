import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const publicPaths = [
  '/',
  '/welcome',
  '/sign-in',
  '/sign-up',
  '/course',
  '/dashboard',
  '/prepai',
  '/api',
  '/favicon.ico',
  '/_next'
];

export default async function middleware(req) {
  // Get the pathname of the request
  const { pathname } = req.nextUrl;
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // If it's a public path, no need to check authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get authentication state
  const { userId } = getAuth(req);
  
  // If user is not authenticated and trying to access a protected route,
  // redirect to sign-in page
  if (!userId) {
    // Create a sign-in URL with a redirect back to the current page
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  // If we reach here, the user is authenticated and trying to access a protected route
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}