'use server'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
    const cookieStore = await cookies()
    try {
        const response = await fetch(`https://bookabite-back-prod.vercel.app/api/auth/logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })

        cookieStore.delete('next-auth.session-token')
        cookieStore.delete('auth-token')

        return NextResponse.json({ message: 'Logout successful' })
    } catch (error) {
        console.error('Logout failed:', error)
        return NextResponse.json(
            { error: 'Ocorreu um erro ao tentar fazer logout' },
            { status: 500 }
        )
    }
}
