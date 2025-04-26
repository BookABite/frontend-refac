'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { AlertCircle, Loader2, SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
    theme: z.string().min(1, 'Tema é obrigatório'),
    currency: z.string().min(1, 'Moeda é obrigatória'),
    notification_enabled: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface GroupUpdateProps {
    groupId: string
}

export function GroupUpdate({ groupId }: GroupUpdateProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            theme: 'light',
            currency: 'BRL',
            notification_enabled: true,
        },
    })

    useEffect(() => {
        if (groupId) {
            fetchGroupSettings(groupId)
        }
    }, [groupId])

    const fetchGroupSettings = async (id: string) => {
        if (!id) {
            setErrorMessage('ID do grupo não fornecido')
            return
        }

        setIsLoading(true)
        setErrorMessage(null)

        try {
            const response = await fetch(`/api/group/${id}`)

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()

            if (data) {
                form.reset(data)
            } else {
                setErrorMessage('Configurações do grupo não encontradas')
            }
        } catch (error) {
            console.error('Erro ao carregar configurações:', error)
            setErrorMessage(
                `Erro ao carregar configurações: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            )
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/group/${groupId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast.success('Configurações atualizadas com sucesso!')
                fetchGroupSettings(groupId)
            } else {
                const errorData = await response.json().catch(() => null)
                throw new Error(
                    errorData?.message || `Erro ${response.status}: ${response.statusText}`
                )
            }
        } catch (error) {
            console.error('Erro ao atualizar configurações:', error)
            toast.error(
                `Erro ao atualizar configurações: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            )
        } finally {
            setIsLoading(false)
        }
    }

    if (!groupId) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <AlertCircle className="h-12 w-12 text-rose-600 mb-4" />
                <h3 className="text-lg font-medium text-zinc-800">Nenhum grupo selecionado</h3>
                <p className="text-zinc-500 mt-2">
                    Selecione um grupo para editar suas configurações.
                </p>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <Card className="border border-zinc-200 shadow-sm">
                <CardHeader className="pb-4">
                    <div>
                        <CardTitle className="text-2xl font-medium text-zinc-800">
                            Configurações do Grupo
                        </CardTitle>
                        <CardDescription className="mt-1 text-zinc-500">
                            Gerencie as preferências e configurações do seu grupo
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    {errorMessage && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    {isLoading && !form.formState.isSubmitting ? (
                        <div className="h-96 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-rose-600 animate-spin" />
                            <span className="ml-2 text-zinc-500">Carregando configurações...</span>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="space-y-6"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="theme"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-zinc-700">
                                                        Tema
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Ex: light, dark"
                                                            className="bg-zinc-50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="currency"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-zinc-700">
                                                        Moeda
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Ex: BRL, USD"
                                                            className="bg-zinc-50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="notification_enabled"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-zinc-50">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-zinc-700">
                                                            Notificações habilitadas
                                                        </FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        className="bg-rose-600 hover:bg-rose-700 text-white"
                                        disabled={isLoading || form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                <span>Salvando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <SaveIcon className="mr-2 h-4 w-4" />
                                                Salvar configurações
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}
