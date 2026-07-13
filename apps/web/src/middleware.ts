import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login', '/register', '/auth/callback', '/products', '/sellers']
const authPages = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('sadean_token')?.value

  const isPublic = pathname === '/' || publicRoutes.some((route) => pathname.startsWith(route))
  const isAuthPage = authPages.some((route) => pathname === route)
  const isStatic = pathname.startsWith('/_next') || pathname.startsWith('/icons') || pathname.startsWith('/manifest') || pathname === '/sw.js' || pathname === '/favicon.ico' || pathname === '/offline'

  if (isStatic) return NextResponse.next()

  if (!token) {
    if (isAuthPage || isPublic) return NextResponse.next()
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPage) return NextResponse.redirect(new URL('/dashboard', request.url))

  const role = extractRole(token)

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname.startsWith('/seller') && role !== 'seller') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

function extractRole(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || null
  } catch {
    return null
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
