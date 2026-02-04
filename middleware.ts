import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rotas públicas (não precisam de autenticação)
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/']
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname === route)

  // Rotas protegidas
  const protectedRoutes = ['/dashboard', '/progresso', '/goals', '/perfil']
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // Se está em rota protegida SEM sessão → redireciona para login
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Se está em rota pública COM sessão → redireciona para dashboard
  if ((isPublicRoute && req.nextUrl.pathname !== '/') && session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|icons).*)',
  ],
}