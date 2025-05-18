import { NextRequest, NextResponse } from 'next/server'

type WorkingHour = {
    day_of_week: number
    opening_time: string
    closing_time: string
    is_closed: boolean
}

function validateWorkingHours(data: any[]): data is WorkingHour[] {
    if (!Array.isArray(data)) return false

    return data.every(
        (item) =>
            typeof item.day_of_week === 'number' &&
            item.day_of_week >= 0 &&
            item.day_of_week <= 6 &&
            typeof item.opening_time === 'string' &&
            typeof item.closing_time === 'string' &&
            typeof item.is_closed === 'boolean'
    )
}

let workingHoursDb: Record<string, Record<string, WorkingHour[]>> = {}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ group_id: string; unit_id: string }> }
) {
    const { group_id, unit_id } = await params

    if (!workingHoursDb[group_id] || !workingHoursDb[group_id][unit_id]) {
        const defaultHours: WorkingHour[] = Array.from({ length: 7 }, (_, i) => ({
            day_of_week: i,
            opening_time: '2025-04-11T09:00:00.000Z',
            closing_time: '2025-04-11T18:00:00.000Z',
            is_closed: i === 0,
        }))

        return NextResponse.json(defaultHours)
    }

    return NextResponse.json(workingHoursDb[group_id][unit_id])
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ group_id: string; unit_id: string }> }
) {
    const { group_id, unit_id } = await params

    try {
        const data = await request.json()

        if (!validateWorkingHours(data)) {
            return NextResponse.json({ error: 'Formato de dados inválido' }, { status: 400 })
        }

        if (!workingHoursDb[group_id]) {
            workingHoursDb[group_id] = {}
        }

        workingHoursDb[group_id][unit_id] = data

        return NextResponse.json(
            {
                success: true,
                message: 'Horários de trabalho atualizados com sucesso',
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error)
        return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 })
    }
}
