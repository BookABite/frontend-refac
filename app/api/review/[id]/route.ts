import apiBookaBite from '@/lib/booking-service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id

        if (!id) {
            return NextResponse.json({ error: 'Hash da reserva é obrigatória' }, { status: 400 })
        }

        const response = await apiBookaBite.get(`/unit/rating/${id}/ratings`)

        if (response.error) {
            return NextResponse.json(
                { error: response.error || 'Failed to fetch reservations' },
                { status: response.status }
            )
        }

        return NextResponse.json(response.data)
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error)
        return NextResponse.json(
            {
                error: 'Erro ao buscar avaliações',
                detail:
                    error instanceof Error
                        ? [{ msg: error.message }]
                        : [{ msg: 'Erro desconhecido' }],
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id
        const body = await request.json()

        if (!id) {
            return NextResponse.json({ error: 'Hash da reserva é obrigatória' }, { status: 400 })
        }

        const bodySchema = {
            stars: Number,
            comment: 'string',
            customer_name: 'string',
            reservation_hash: 'string',
        }

        const response = await fetch(
            `https://bookabite-back-prod.vercel.app/api/unit/rating/${id}/ratings`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodySchema),
            }
        )

        const data = await response.json()
        if (!response.ok) {
            console.error('Erro do backend:', data)
            return NextResponse.json(data, { status: response.status })
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error('Erro ao criar avaliação:', error)
        return NextResponse.json(
            {
                error: 'Erro ao criar avaliação',
                detail: error instanceof Error ? error.message : 'Erro desconhecido',
            },
            { status: 500 }
        )
    }
}
