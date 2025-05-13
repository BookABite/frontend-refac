import apiBookaBite from '@/lib/booking-service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ group_id: string; unit_id: string }> }
) {
    try {
        const { group_id, unit_id } = await params
        const requestData = await request.json()

        const response = await apiBookaBite.post(
            `/reservations/group/${group_id}/unit/${unit_id}/reserve`,
            requestData
        )

        if (response.error) {
            return NextResponse.json({ error: response.error }, { status: response.status })
        }

        return NextResponse.json(response.data, { status: response.status })
    } catch (error) {
        console.error('Erro ao criar reserva:', error)
        return NextResponse.json(
            {
                error: 'Erro ao criar reserva',
                detail:
                    error instanceof Error
                        ? [{ msg: error.message }]
                        : [{ msg: 'Erro desconhecido' }],
            },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id

        if (!id) {
            return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 })
        }

        const response = await apiBookaBite.get(`/group/${id}/reservations`)

        if (response.error) {
            return NextResponse.json(
                { error: response.error || 'Failed to fetch reservations' },
                { status: response.status }
            )
        }

        return NextResponse.json(response.data)
    } catch (error) {
        console.error('Failed to fetch reservations:', error)
        return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 })
    }
}
