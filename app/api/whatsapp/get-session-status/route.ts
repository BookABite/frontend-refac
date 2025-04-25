import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const tokenFromQuery = searchParams.get('token')

        if (!userId) {
            return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
        }

        const cookieStore = await cookies()
        const authCookie = cookieStore.get('auth-token')?.value

        const authHeader = request.headers.get('authorization')
        const token = tokenFromQuery || authHeader?.replace('Bearer ', '') || authCookie

        if (!token) {
            return NextResponse.json(
                { error: 'Token de autenticação não encontrado' },
                { status: 401 }
            )
        }

        const url = `https://api-whatsapp-prod.vercel.app/api/get-session-status?userId=${userId}`

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            console.error('Erro na resposta da API WhatsApp (status):', {
                status: response.status,
                statusText: response.statusText,
                errorData,
            })

            return NextResponse.json(
                {
                    error: 'Falha ao verificar status da sessão',
                    details: errorData || response.statusText,
                },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Erro ao verificar status:', error)
        return NextResponse.json(
            {
                error: 'Erro ao verificar status da sessão',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}
