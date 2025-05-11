'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { CheckCircle2, Eye, EyeOff, Loader, LockKeyhole, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from './ui/button'

interface ChangePasswordModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
    onSuccess: () => void
}

const passwordSchema = z
    .object({
        current_password: z.string().min(1, 'Senha atual é obrigatória'),
        new_password: z
            .string()
            .min(8, 'A nova senha deve ter pelo menos 8 caracteres')
            .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
            .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
            .regex(/[0-9]/, 'Deve conter pelo menos um número'),
        confirm_password: z.string().min(1, 'Confirmação de senha é obrigatória'),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        message: 'As senhas não coincidem',
        path: ['confirm_password'],
    })

type PasswordFormValues = z.infer<typeof passwordSchema>

export function ChangePasswordModal({
    isOpen,
    onClose,
    userId,
    onSuccess,
}: ChangePasswordModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { token } = useAuth()
    const [error, setError] = useState('')
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: '',
            new_password: '',
            confirm_password: '',
        },
    })

    // Monitora a força da senha
    useEffect(() => {
        const password = form.watch('new_password')
        let strength = 0

        if (password.length > 0) strength += 1
        if (password.length >= 8) strength += 1
        if (/[A-Z]/.test(password)) strength += 1
        if (/[0-9]/.test(password)) strength += 1
        if (/[^A-Za-z0-9]/.test(password)) strength += 1

        setPasswordStrength(strength)
    }, [form.watch('new_password')])

    const onSubmit = async (data: PasswordFormValues) => {
        if (!userId || !token) {
            toast.error('Dados de usuário não disponíveis')
            return
        }

        if (passwordStrength < 3) {
            toast.error('Por favor, crie uma senha mais forte')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await fetch(`/api/user/password/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: data.current_password,
                    new_password: data.new_password,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                setError(errorData?.error || 'Falha ao alterar a senha')
                throw new Error(errorData?.error || 'Falha ao alterar a senha')
            }

            toast.success('Senha alterada com sucesso')
            form.reset()
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Erro ao alterar senha:', error)
            if (!error) {
                toast.error('Não foi possível alterar a senha')
            }
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
                                <LockKeyhole className="h-5 w-5" />
                                Alterar Senha
                            </div>
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Digite sua senha atual e a nova senha desejada
                        </DialogDescription>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="px-6 py-5 space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                    {error}
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="current_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Senha Atual</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={isPasswordVisible ? 'text' : 'password'}
                                                    placeholder="Digite sua senha atual"
                                                    {...field}
                                                    disabled={isLoading}
                                                    className="pl-10 pr-10 h-10 focus-visible:ring-offset-0 focus-visible:ring-1"
                                                />
                                                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                                    onClick={() =>
                                                        setIsPasswordVisible(!isPasswordVisible)
                                                    }
                                                >
                                                    {isPasswordVisible ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="new_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Nova Senha</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={isPasswordVisible ? 'text' : 'password'}
                                                    placeholder="Crie uma senha forte"
                                                    {...field}
                                                    disabled={isLoading}
                                                    className="pl-10 pr-10 h-10 focus-visible:ring-offset-0 focus-visible:ring-1"
                                                />
                                                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                                    onClick={() =>
                                                        setIsPasswordVisible(!isPasswordVisible)
                                                    }
                                                >
                                                    {isPasswordVisible ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>

                                        {/* Indicador de força da senha */}
                                        <div className="mt-2">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-xs text-muted-foreground">
                                                    Força da senha:
                                                </span>
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {passwordStrength === 0 && ''}
                                                    {passwordStrength === 1 && 'Fraca'}
                                                    {passwordStrength === 2 && 'Razoável'}
                                                    {passwordStrength === 3 && 'Boa'}
                                                    {passwordStrength === 4 && 'Forte'}
                                                    {passwordStrength === 5 && 'Excelente'}
                                                </span>
                                            </div>
                                            <div className="flex gap-1 h-1">
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`flex-1 rounded-full ${
                                                            passwordStrength >= level
                                                                ? passwordStrength < 3
                                                                    ? 'bg-red-500'
                                                                    : passwordStrength < 4
                                                                      ? 'bg-yellow-500'
                                                                      : 'bg-emerald-500'
                                                                : 'bg-muted'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Requisitos da senha */}
                                        <ul className="text-xs space-y-1 mt-3 text-muted-foreground">
                                            <li className="flex items-center">
                                                <CheckCircle2
                                                    className={`h-3 w-3 mr-1 ${
                                                        form.watch('new_password')?.length >= 8
                                                            ? 'text-emerald-500'
                                                            : 'text-muted'
                                                    }`}
                                                />
                                                Mínimo de 8 caracteres
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2
                                                    className={`h-3 w-3 mr-1 ${
                                                        /[A-Z]/.test(form.watch('new_password'))
                                                            ? 'text-emerald-500'
                                                            : 'text-muted'
                                                    }`}
                                                />
                                                Pelo menos 1 letra maiúscula
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2
                                                    className={`h-3 w-3 mr-1 ${
                                                        /[a-z]/.test(form.watch('new_password'))
                                                            ? 'text-emerald-500'
                                                            : 'text-muted'
                                                    }`}
                                                />
                                                Pelo menos 1 letra minúscula
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2
                                                    className={`h-3 w-3 mr-1 ${
                                                        /[0-9]/.test(form.watch('new_password'))
                                                            ? 'text-emerald-500'
                                                            : 'text-muted'
                                                    }`}
                                                />
                                                Pelo menos 1 número
                                            </li>
                                        </ul>

                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirm_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">
                                            Confirmar Nova Senha
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={
                                                        isConfirmPasswordVisible
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    placeholder="Confirme a nova senha"
                                                    {...field}
                                                    disabled={isLoading}
                                                    className="pl-10 pr-10 h-10 focus-visible:ring-offset-0 focus-visible:ring-1"
                                                />
                                                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                                    onClick={() =>
                                                        setIsConfirmPasswordVisible(
                                                            !isConfirmPasswordVisible
                                                        )
                                                    }
                                                >
                                                    {isConfirmPasswordVisible ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
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
                                disabled={
                                    isLoading ||
                                    passwordStrength < 3 ||
                                    !form.watch('current_password') ||
                                    form.watch('new_password') !== form.watch('confirm_password')
                                }
                                className="h-9 px-4 rounded-lg font-medium"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader className="h-3.5 w-3.5 animate-spin" />
                                        <span>Alterando</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <LockKeyhole className="h-3.5 w-3.5" />
                                        <span>Alterar Senha</span>
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
