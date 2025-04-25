import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId } = body

        if (!userId) {
            return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
        }

        const cookieStore = await cookies()
        const authCookie = cookieStore.get('auth-token')?.value

        const authHeader = request.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '') || authCookie

        if (!token) {
            return NextResponse.json(
                { error: 'Token de autenticação não encontrado' },
                { status: 401 }
            )
        }

        const response = await fetch(
            'https://api-whatsapp-prod.vercel.app/api/whatsapp/start-session',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            console.error('Erro na resposta da API WhatsApp:', {
                status: response.status,
                statusText: response.statusText,
                errorData,
            })
            return NextResponse.json(
                {
                    error: 'Falha ao iniciar sessão do WhatsApp',
                    details: errorData || response.statusText,
                },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Erro ao iniciar sessão do WhatsApp:', error)
        return NextResponse.json(
            {
                error: 'Erro ao iniciar sessão do WhatsApp',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}
