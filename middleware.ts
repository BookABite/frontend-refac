import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value
    const { pathname } = request.nextUrl

    // Rotas protegidas
    const protectedRoutes = ['/dashboard', '/confirmation', '/group']
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

    // Se tentar acessar rota protegida sem token
    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Se tentar acessar login com token
    if (pathname.startsWith('/login') && token) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('access_token')
        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
