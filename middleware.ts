import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/customer/login', '/admin/login', '/auth', '/error'] // add any public routes here

export async function updateSession(request: NextRequest) {
  let user = null
  let userRole = null

  try {
    // Check for authentication token in cookies
    const authToken = request.cookies.get('auth_token')?.value
    const userRoleCookie = request.cookies.get('user_role')?.value
    
    if (authToken) {
      user = { id: authToken } // Mock user object
      userRole = userRoleCookie
    }
  } catch (error) {
    console.error('Middleware auth error:', error)
    // Continue with user as null to redirect to login
  }

  const isPublicPath = PUBLIC_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // If no user and not a public path → redirect based on route type
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()

    // Redirect admin routes to admin login
    if (request.nextUrl.pathname.startsWith('/admin')) {
      url.pathname = '/admin/login'
    }
    // Redirect customer routes to customer login
    else if (request.nextUrl.pathname.startsWith('/customer')) {
      url.pathname = '/customer/login'
    }
    // Default to admin login for other protected routes
    else {
      url.pathname = '/admin/login'
    }

    return NextResponse.redirect(url)
  }

  // Role-based access control
  if (user && userRole) {
    // Makers can only access create transaction page
    if (request.nextUrl.pathname.startsWith('/admin/transactions/create') && userRole !== 'maker') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }

    // Authorizers can only access approve transaction page
    if (request.nextUrl.pathname.startsWith('/customer/transactions/approve') && userRole !== 'authorizer') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next({ request })
}

export default async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
