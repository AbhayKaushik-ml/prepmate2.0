import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicPaths = [
  '/',
  '/welcome',
  '/api',
  '/favicon.ico',
  '/_next',
  '/fonts',
  '/images'
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
  
  // For API routes, allow access without redirection
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // For all other routes, we'll handle authentication client-side
  // using the session storage in each component
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