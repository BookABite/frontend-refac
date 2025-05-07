'use server'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const authHeader = request.headers.get('authorization')

        if (!authHeader) {
            return NextResponse.json({ error: 'Autorização necessária' }, { status: 401 })
        }

        const response = await fetch(
            `https://bookabite-back-prod.vercel.app/api/user/profile/${id}`,
            {
                headers: {
                    Authorization: authHeader,
                    'Content-Type': 'application/json',
                },
            }
        )

        const data = await response.json()

        if (!response.ok) {
            console.error('Erro do backend:', data)
            return NextResponse.json(data, { status: response.status })
        }

        const userData = {
            name: `${data.first_name} ${data.last_name}`.trim(),
            email: data.email,
            avatar: '',
            role: data.role,
            isStaff: data.is_staff,
            groupName: data.group_name,
            unitName: data.unit_name,
        }

        return NextResponse.json(userData, { status: 200 })
    } catch (error) {
        console.error('Erro ao buscar usuário:', error)
        return NextResponse.json(
            {
                error: 'Erro ao buscar usuário',
                detail:
                    error instanceof Error
                        ? [{ msg: error.message }]
                        : [{ msg: 'Erro desconhecido' }],
            },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params
        const body = await request.json()

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const updatetableFields = [
            'first_name',
            'last_name',
            'email',
            'role',
            'is_active',
            'group_id',
            'unit_id',
        ]

        const hasValidField = updatetableFields.some((field) => field in body)

        if (!hasValidField) {
            return NextResponse.json(
                { error: 'Nenhum campo válido enviado para atualização' },
                { status: 400 }
            )
        }

        const authHeader = request.headers.get('authorization')

        if (!authHeader) {
            return NextResponse.json({ error: 'Autorização necessária' }, { status: 401 })
        }

        const response = await fetch(
            `https://bookabite-back-prod.vercel.app/api/user/profile/${id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authHeader,
                },
                body: JSON.stringify({
                    user_id: id,
                    ...body,
                }),
            }
        )

        const data = await response.json()

        if (!response.ok) {
            console.error('Erro do backend:', data)
            return NextResponse.json(data, { status: response.status })
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error)
        return NextResponse.json(
            {
                error: 'Erro ao atualizar usuário',
                detail:
                    error instanceof Error
                        ? [{ msg: error.message }]
                        : [{ msg: 'Erro desconhecido' }],
            },
            { status: 500 }
        )
    }
}
