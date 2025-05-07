import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const PermissionSchema = z.object({
    email: z.string().email(),
    is_superuser: z.boolean(),
    role: z.string(),
    group_id: z.string(),
    custom_user_id: z.string(),
    unit_ids: z.array(z.string()),
})

export async function GET(request: Request) {
    try {
        const token = (await cookies()).get('access_token')?.value

        if (!token) {
            return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 })
        }

        const backendUrl = `https://bookabite-back-prod.vercel.app/api/auth/permissions/`
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            console.error('Backend error:', {
                status: response.status,
                error: errorData?.detail || response.statusText,
            })

            return NextResponse.json(
                {
                    error: errorData?.detail || 'Erro ao verificar permissões',
                    status: response.status,
                },
                { status: response.status }
            )
        }

        const rawData = await response.json()
        const parsedData = PermissionSchema.safeParse(rawData)

        if (!parsedData.success) {
            console.error('Dados inválidos do backend:', parsedData.error)
            return NextResponse.json({ error: 'Formato de dados inválido' }, { status: 500 })
        }

        return NextResponse.json(parsedData.data)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
