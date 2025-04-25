import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { phone, message, userId } = body

        if (!phone || !message) {
            return NextResponse.json({ error: 'phone e message são obrigatórios' }, { status: 400 })
        }

        const response = await fetch('https://api-whatsapp-prod.vercel.app/api/send-mensage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, message, userId }),
        })

        if (!response.ok) {
            throw new Error('Falha ao enviar mensagem')
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 })
    }
}
