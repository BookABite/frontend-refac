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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const body = await request.json()

        if (!id) {
            return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 })
        }

        // Validar se pelo menos um campo foi enviado para atualização
        const updatableFields = [
            'name',
            'restaurant_name',
            'description',
            'email',
            'phone',
            'logo',
            'banner_image',
            'website',
            'address',
        ]

        const hasValidField = updatableFields.some((field) => field in body)

        if (!hasValidField) {
            return NextResponse.json(
                { error: 'At least one valid field must be provided for update' },
                { status: 400 }
            )
        }

        const response = await fetch(
            `https://bookabite-back-prod.vercel.app/api/units/${id}/profile`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    unit_id: id,
                    ...body,
                }),
            }
        )

        const data = await response.json()

        if (!response.ok) {
            console.error('Erro do backend:', data)
            return NextResponse.json(data, { status: response.status })
        }

        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('Erro ao atualizar restaurante:', error)
        return NextResponse.json(
            {
                error: 'Erro ao atualizar restaurante',
                detail:
                    error instanceof Error
                        ? [{ msg: error.message }]
                        : [{ msg: 'Erro desconhecido' }],
            },
            { status: 500 }
        )
    }
}
