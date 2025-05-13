import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const passwordSchema = z
    .object({
        current_password: z.string().min(1, 'Senha atual é obrigatória'),
        new_password: z.string().min(8, 'A nova senha deve ter pelo menos 8 caracteres'),
        confirm_password: z.string().min(8, 'Confirmação de senha é obrigatória'),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        message: 'As senhas não coincidem',
        path: ['confirm_password'],
    })

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id
        const body = await request.json()

        // Validação do schema
        const validation = passwordSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: validation.error.errors },
                { status: 400 }
            )
        }

        const authHeader = request.headers.get('authorization')
        if (!authHeader) {
            return NextResponse.json({ error: 'Autorização necessária' }, { status: 401 })
        }

        const response = await fetch(
            `https://bookabite-back-prod.vercel.app/api/user/change-password/${id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authHeader,
                },
                body: JSON.stringify({
                    user_id: id,
                    current_password: body.current_password,
                    new_password: body.new_password,
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
        console.error('Erro ao atualizar senha:', error)
        return NextResponse.json(
            {
                error: 'Erro ao atualizar senha',
                detail:
                    error instanceof Error
                        ? [{ msg: error.message }]
                        : [{ msg: 'Erro desconhecido' }],
            },
            { status: 500 }
        )
    }
}
