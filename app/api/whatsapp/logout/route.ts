import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId } = body

        if (!userId) {
            return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
        }

        const response = await fetch('https://api-whatsapp-prod.vercel.app/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })

        if (!response.ok) {
            throw new Error('Falha ao desconectar do WhatsApp')
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Erro ao desconectar:', error)
        return NextResponse.json({ error: 'Erro ao desconectar do WhatsApp' }, { status: 500 })
    }
}
