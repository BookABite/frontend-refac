'use server'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const response = await fetch(
            `https://bookabite-back-prod.vercel.app/api/user/profile/${id}}`
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
