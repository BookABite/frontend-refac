'use server'

import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 })
        }

        const response = await fetch(`https://bookabite-back-prod.vercel.app/api/unit/${id}`)

        const data = await response.json()

        if (!response.ok) {
            console.error('Erro do backend:', data)
            return NextResponse.json(data, { status: response.status })
        }

        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('Erro ao buscar restaurante:', error)
        return NextResponse.json(
            {
                error: 'Erro ao buscar restaurante',
                detail:
                    error instanceof Error
                        ? [{ msg: error.message }]
                        : [{ msg: 'Erro desconhecido' }],
            },
            { status: 500 }
        )
    }
}
