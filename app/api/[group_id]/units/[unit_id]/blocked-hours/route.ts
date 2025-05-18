import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

type BlockedHour = {
    id: string
    start_datetime: string
    end_datetime: string
    reason: string
}

function validateBlockedHour(data: any): data is Omit<BlockedHour, 'id'> {
    return (
        typeof data.start_datetime === 'string' &&
        typeof data.end_datetime === 'string' &&
        typeof data.reason === 'string' &&
        data.reason.trim() !== '' &&
        new Date(data.start_datetime).getTime() < new Date(data.end_datetime).getTime()
    )
}

let blockedHoursDb: Record<string, Record<string, BlockedHour[]>> = {}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ group_id: string; unit_id: string }> }
) {
    const { group_id, unit_id } = await params

    if (!blockedHoursDb[group_id] || !blockedHoursDb[group_id][unit_id]) {
        return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    return NextResponse.json(blockedHoursDb[group_id][unit_id], { status: 200 })
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ group_id: string; unit_id: string }> }
) {
    const { group_id, unit_id } = await params

    try {
        const data = await request.json()
        if (!validateBlockedHour(data)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
        }
        if (!blockedHoursDb[group_id]) {
            blockedHoursDb[group_id] = {}
        }
        if (!blockedHoursDb[group_id][unit_id]) {
            blockedHoursDb[group_id][unit_id] = []
        }

        const newBlockedHour: BlockedHour = {
            id: uuidv4(),
            ...data,
        }

        blockedHoursDb[group_id][unit_id].push(newBlockedHour)

        return NextResponse.json(
            {
                id: newBlockedHour.id,
                message: 'Horário bloqueado adicionado com sucesso',
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Erro ao adicionar horário bloqueado:', error)
        return NextResponse.json(
            {
                error: 'Erro ao adicionar horário bloqueado',
                detail:
                    error instanceof Error
                        ? [{ msg: error.message }]
                        : [{ msg: 'Erro desconhecido' }],
            },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ group_id: string; unit_id: string }> }
) {
    const { group_id, unit_id } = await params
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Blocked hour id is required' }, { status: 400 })
    }

    if (!blockedHoursDb[group_id] || !blockedHoursDb[group_id][unit_id]) {
        return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    const initialLength = blockedHoursDb[group_id][unit_id].length
    blockedHoursDb[group_id][unit_id] = blockedHoursDb[group_id][unit_id].filter(
        (hour) => hour.id !== id
    )

    if (blockedHoursDb[group_id][unit_id].length === initialLength) {
        return NextResponse.json({ error: 'Horário bloqueado não encontrado' }, { status: 404 })
    }

    return NextResponse.json(
        { success: true, message: 'Horário bloqueado removido com sucesso' },
        { status: 200 }
    )
}
