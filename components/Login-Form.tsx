'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    BarChart,
    CalendarCheck,
    Eye,
    EyeOff,
    Loader,
    Lock,
    LogInIcon,
    Mail,
    RectangleEllipsis,
    Utensils,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
    email: z.string().email('Digite um email válido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

type FormData = z.infer<typeof formSchema>

export function LoginForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const year = new Date().getFullYear()

    const handleLoginWithCredentials = async (data: FormData) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const { access } = await response.json()
                document.cookie = `access_token=${access}; path=/; max-age=86400; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
                toast.success('Login realizado com sucesso!')
                router.push('/dashboard')
            } else {
                toast.error('Credenciais inválidas')
            }
        } catch (error) {
            toast.error('Erro ao fazer login')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="overflow-hidden shadow-xl rounded-xl border-0 z-50">
            <CardContent className="grid md:grid-cols-2 h-[500px] p-0">
                {/* Lado esquerdo - Visual */}
                <div className="hidden md:block relative overflow-hidden">
                    <div className="absolute left-4 inset-0 rounded-lg">
                        <Image
                            src="/1.jpg"
                            alt="BOOKABITE"
                            fill
                            className="object-cover object-center rounded-lg absolute left-2 inset-0 opacity-80"
                            priority
                        />
                        <div className="absolute left-2 inset-0 bg-[radial-gradient(circle_at_center,_#ffffff20_0%,_transparent_60%)]"></div>
                    </div>

                    <div className="relative h-full flex flex-col items-center justify-between p-8 text-white z-10">
                        <div className="w-full flex justify-center pt-6">
                            <Image
                                src="/logo-light.png"
                                alt="BOOKABITE"
                                width={160}
                                height={45}
                                className="object-contain"
                            />
                        </div>

                        <div className="space-y-6 text-center">
                            <h2 className="text-2xl font-light text-white tracking-wide">
                                Gerenciamento de Reservas
                            </h2>
                            <p className="text-zinc-200 text-sm max-w-xs italic font-light">
                                "Transforme a experiência dos seus clientes com um sistema de
                                reservas eficiente e elegante"
                            </p>

                            <div className="flex gap-3 justify-center pt-4">
                                <div className="flex flex-col items-center">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-50">
                                        <Utensils size={20} className="text-rose-500" />
                                    </span>
                                    <span className="text-xs text-zinc-100">Gerenciamento</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-50">
                                        <CalendarCheck size={20} className="text-rose-500" />
                                    </span>
                                    <span className="text-xs text-zinc-100">Reservas</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-50">
                                        <BarChart size={20} className="text-rose-500" />
                                    </span>
                                    <span className="text-xs text-zinc-100">Análises</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center text-xs font-light text-zinc-50">
                            Sistema exclusivo para proprietários de restaurantes
                        </div>
                    </div>
                </div>

                {/* Lado direito - Formulário */}
                <div className="flex items-center justify-center bg-white py-8 px-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleLoginWithCredentials)}
                            className="w-full max-w-sm"
                        >
                            <div className="space-y-2 text-center mb-8">
                                <h1 className="text-2xl font-medium text-zinc-800">
                                    Bem-vindo de volta
                                </h1>
                                <p className="text-zinc-500 text-sm">
                                    Acesse o painel de controle do seu restaurante
                                </p>
                            </div>

                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs text-zinc-600 font-medium">
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                                    <Input
                                                        {...field}
                                                        placeholder="seu@email.com"
                                                        className="pl-10 bg-zinc-50 border-zinc-200 focus-visible:ring-rose-500"
                                                    />
                                                </div>
                                            </FormControl>
                                            {fieldState.error && (
                                                <FormMessage>
                                                    {fieldState.error.message}
                                                </FormMessage>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs text-zinc-600 font-medium">
                                                Senha
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                                    <Input
                                                        {...field}
                                                        type={visible ? 'text' : 'password'}
                                                        placeholder="••••••"
                                                        className="pl-10 bg-zinc-50 border-zinc-200 focus-visible:ring-rose-500"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-transparent"
                                                        onClick={() => setVisible(!visible)}
                                                    >
                                                        {visible ? (
                                                            <EyeOff
                                                                size={16}
                                                                className="text-zinc-400 hover:text-rose-700"
                                                            />
                                                        ) : (
                                                            <Eye
                                                                size={16}
                                                                className="text-zinc-400 hover:text-rose-700"
                                                            />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            {fieldState.error && (
                                                <FormMessage>
                                                    {fieldState.error.message}
                                                </FormMessage>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full " disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader className="h-4 w-4 animate-spin" />
                                            <span>Aguarde...</span>
                                        </div>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <LogInIcon className="h-4 w-4" />
                                            Entrar
                                        </span>
                                    )}
                                </Button>

                                <div className="text-center text-xs text-zinc-400 pt-6 border-t border-zinc-100">
                                    &copy; {year} BOOKABITE | Todos os direitos reservados
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
}
