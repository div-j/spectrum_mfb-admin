import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/activate',
  '/auth/verify-otp',
  '/error',
  "/login"
]

// Helper: Check if path is public
const isPublicRoute = (pathname: string) => {
  return PUBLIC_PATHS.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  )
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('admin_token')?.value

  // If it's a public route → allow
  if (isPublicRoute(pathname)) {
    // If user tries to go to login but already authenticated → redirect to dashboard
    if (pathname === '/auth/login' && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // Protected routes → verify token
  if (!token) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('redirect', pathname) // optional: redirect back after login
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Apply the middleware to *all pages* except static assets & API routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next|static|assets|public|images|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|api).*)',
  ],
};