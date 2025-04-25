import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const { email, password } = await request.json()
    const payload = JSON.stringify({ email, password })

    try {
        const response = await fetch(`https://bookabite-back-prod.vercel.app/api/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: payload,
        })

        if (response.status === 200) {
            const data = await response.json()

            const responseWithCookie = NextResponse.json(data)
            responseWithCookie.cookies.set('next-auth.session-token', data.access, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24,
            })

            return responseWithCookie
        } else {
            return NextResponse.error()
        }
    } catch (error) {
        console.error('Login failed:', error)
        return NextResponse.json(
            { error: 'Ocorreu um erro ao tentar fazer login' },
            { status: 500 }
        )
    }
}
