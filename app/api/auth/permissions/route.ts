import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const token = (await cookies()).get('access_token')?.value

        if (!token) {
            return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 })
        }

        const response = await fetch(
            `https://bookabite-back-prod.vercel.app/api/auth/permissions/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching permissions:', error)
        return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 })
    }
}
