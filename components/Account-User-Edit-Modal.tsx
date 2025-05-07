'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Loader, Save, UserPen, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { GroupInfo } from './Group-Info'
import { Checkbox } from './ui/checkbox'

interface AccountEditModalProps {
    isOpen: boolean
    onClose: () => void
    userData: {
        name: string
        email: string
        role?: string
        isStaff?: boolean
        groupName?: string
        unitName?: string
    } | null
    userId: string
    onSuccess: () => void
    unitId?: string
    onUnitChange?: (value: string) => void
}

const accountSchema = z.object({
    first_name: z.string().min(1, 'Nome é obrigatório'),
    last_name: z.string().min(1, 'Sobrenome é obrigatório'),
    email: z.string().email('Email inválido'),
    role: z.string().optional(),
    is_active: z.boolean(),
    group_id: z.string().uuid().nullable().optional(),
    unit_id: z.string().uuid().nullable().optional(),
})

type AccountFormValues = z.infer<typeof accountSchema>

export function AccountEditModal({
    isOpen,
    onClose,
    userData,
    userId,
    onSuccess,
    unitId,
    onUnitChange,
}: AccountEditModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { user, token } = useAuth()

    if (!user) {
        return null
    }

    const nameParts = userData?.name?.split(' ') || ['', '']
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            first_name: firstName,
            last_name: lastName,
            email: userData?.email || '',
            role: userData?.role || '',
            is_active: userData?.isStaff ?? true,
            group_id: null,
            unit_id: null,
        },
    })

    const onSubmit = async (data: AccountFormValues) => {
        if (!userId || !token) {
            toast.error('Dados de usuário não disponíveis')
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch(`/api/user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                console.error('Erro ao atualizar usuário:', errorData)
                throw new Error('Falha ao atualizar dados do usuário')
            }

            toast.success('Dados atualizados com sucesso')
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error)
            toast.error('Não foi possível atualizar os dados do usuário')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-xl border border-border/40 shadow-lg">
                <div className="px-6 py-5 border-b border-border/30 bg-zinc-100">
                    <div className="flex flex-col gap-2">
                        <DialogTitle>
                            <div className="flex items-center gap-2">
                                <UserPen className="h-5 w-5" />
                                Editar Perfil
                            </div>
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Edite as informações do usuário
                        </DialogDescription>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
                            <div className="grid gap-5 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Nome</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nome"
                                                    {...field}
                                                    disabled={isLoading}
                                                    className="h-10 focus-visible:ring-offset-0 focus-visible:ring-1"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Sobrenome</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Sobrenome"
                                                    {...field}
                                                    disabled={isLoading}
                                                    className="h-10 focus-visible:ring-offset-0 focus-visible:ring-1"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Email"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-2 items-center justify-between">
                                {userData?.role === 'GROUP_ADMIN' && (
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm">Função</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Função"
                                                        {...field}
                                                        disabled={true}
                                                        className="h-10 bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-1"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <FormField
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center space-y-2">
                                            <FormLabel className="text-sm">Ativo</FormLabel>
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={(checked) =>
                                                        field.onChange(checked)
                                                    }
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {userData && (
                                <div className="pt-2">
                                    <GroupInfo
                                        unitId={unitId || ''}
                                        onUnitChange={onUnitChange || (() => {})}
                                        user={user}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-zinc-100 border-t border-border/30 flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="h-9 px-4 rounded-lg font-medium"
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-9 px-4 rounded-lg font-medium"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader className="h-3.5 w-3.5 animate-spin" />
                                        <span>Atualizando</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Save className="h-3.5 w-3.5" />
                                        <span>Salvar</span>
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
