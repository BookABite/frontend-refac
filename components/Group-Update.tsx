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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
    Building2,
    Clock,
    CreditCard,
    Facebook,
    FileDigit,
    Globe,
    Instagram,
    Loader,
    Mail,
    MessageSquareText,
    Phone,
    Save,
    Twitter,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
    description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').optional(),
    email: z.string().email('Email inválido').optional(),
    phone: z.string().min(8, 'Telefone deve ter pelo menos 8 dígitos').optional(),
    country_code: z.string().min(2, 'Código do país deve ter 2 caracteres').optional(),
    facebook_url: z.string().url('URL inválida').optional().or(z.literal('')),
    instagram_url: z.string().url('URL inválida').optional().or(z.literal('')),
    whatsapp_url: z.string().url('URL inválida').optional().or(z.literal('')),
    twitter_url: z.string().url('URL inválida').optional().or(z.literal('')),
    primary_currency: z.string().min(1, 'Moeda é obrigatória').optional(),
    time_zone: z.string().min(1, 'Fuso horário é obrigatório').optional(),
    tax_id: z.string().min(5, 'ID fiscal deve ter pelo menos 5 caracteres').optional(),
})

type FormValues = z.infer<typeof formSchema>

interface GroupUpdateProps {
    groupId: string
    initialData?: Partial<FormValues>
}

export function GroupUpdate({ groupId, initialData }: GroupUpdateProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            email: '',
            phone: '',
            country_code: '',
            facebook_url: '',
            instagram_url: '',
            whatsapp_url: '',
            twitter_url: '',
            primary_currency: '',
            time_zone: '',
            tax_id: '',
            ...initialData,
        },
    })

    useEffect(() => {
        if (groupId) {
            fetchBusinessData(groupId)
        }
    }, [groupId])

    const fetchBusinessData = async (id: string) => {
        setIsLoading(true)
        setErrorMessage(null)

        try {
            const response = await fetch(`/api/group/${id}`)

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            form.reset(data)
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
            setErrorMessage(
                `Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            )
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true)
        try {
            const payload = Object.fromEntries(
                Object.entries(data).filter(([_, value]) => value !== '')
            )

            const response = await fetch(`/api/group/${groupId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                toast.success('Configurações atualizadas com sucesso!')
            } else {
                const errorData = await response.json().catch(() => null)
                throw new Error(
                    errorData?.message || `Erro ${response.status}: ${response.statusText}`
                )
            }
        } catch (error) {
            console.error('Erro ao atualizar configurações:', error)
            toast.error(
                `Erro ao atualizar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            )
        } finally {
            setIsLoading(false)
        }
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
                    <CardTitle className="flex gap-2 text-2xl font-medium text-zinc-800">
                        <Building2 />
                        Configurações do Negócio
                    </CardTitle>
                    <CardDescription className="mt-1 text-zinc-500">
                        Gerencie as informações básicas e configurações do seu negócio
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {errorMessage && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    {isLoading && !form.formState.isSubmitting ? (
                        <div className="min-h-screen flex flex-col items-center justify-center">
                            <Loader className="h-8 w-8 animate-spin" />
                            <span className="ml-2 text-zinc-500">Carregando dados...</span>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="space-y-6">
                                    {/* Seção de Informações Básicas */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <h3 className="text-sm font-medium text-zinc-700 mb-4">
                                            Informações Básicas
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nome do Negócio</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Nome oficial"
                                                                className="bg-zinc-50"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="tax_id"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <FileDigit className="h-4 w-4  " />
                                                            ID Fiscal (CNPJ/CPF)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="00.000.000/0000-00"
                                                                className="bg-zinc-50"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem className="mt-6">
                                                    <FormLabel>Descrição</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            placeholder="Descreva seu negócio..."
                                                            className="resize-none h-24 bg-zinc-50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    <Separator className="my-6" />

                                    {/* Seção de Contato */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h3 className="text-sm font-medium text-zinc-700 mb-4">
                                            Informações de Contato
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <Mail className="h-4 w-4  " />
                                                            Email
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="contato@negocio.com"
                                                                className="bg-zinc-50"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <Phone className="h-4 w-4  " />
                                                            Telefone
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="(00) 00000-0000"
                                                                className="bg-zinc-50"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="country_code"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <Globe className="h-4 w-4  " />
                                                            Código do País
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="BR"
                                                                className="bg-zinc-50"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </motion.div>

                                    <Separator className="my-6" />

                                    {/* Seção de Redes Sociais */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <h3 className="text-sm font-medium text-zinc-700 mb-4">
                                            Redes Sociais
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="facebook_url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <Facebook className="h-4 w-4  " />
                                                            Facebook
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="https://facebook.com/seunegocio"
                                                                className="bg-zinc-50"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="instagram_url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <Instagram className="h-4 w-4  " />
                                                            Instagram
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="https://instagram.com/seunegocio"
                                                                className="bg-zinc-50"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="whatsapp_url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <MessageSquareText className="h-4 w-4  " />
                                                            WhatsApp
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="https://wa.me/seunumero"
                                                                className="bg-zinc-50"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="twitter_url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <Twitter className="h-4 w-4  " />
                                                            Twitter
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="https://twitter.com/seunegocio"
                                                                className="bg-zinc-50"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </motion.div>

                                    <Separator className="my-6" />

                                    {/* Seção de Configurações */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <h3 className="text-sm font-medium text-zinc-700 mb-4">
                                            Configurações
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="primary_currency"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <CreditCard className="h-4 w-4  " />
                                                            Moeda Principal
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="BRL, USD, EUR"
                                                                className="bg-zinc-50"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="time_zone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <Clock className="h-4 w-4  " />
                                                            Fuso Horário
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="America/Sao_Paulo"
                                                                className="bg-zinc-50"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isLoading || form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting ? (
                                            <>
                                                <Loader className="  h-4 w-4 animate-spin" />
                                                <span>Salvando...</span>
                                            </>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Save className="h-4 w-4" />
                                                Salvar Configurações
                                            </span>
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
