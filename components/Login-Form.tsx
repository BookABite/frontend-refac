'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Loader, LogInIcon, Mail, RectangleEllipsis } from 'lucide-react'
import Image from 'next/image'
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
        <Card className="overflow-hidden shadow-lg rounded-lg border-0 z-50">
            <CardContent className="grid md:grid-cols-2 h-[450px]">
                {/* Lado esquerdo - Visual */}
                <div className="hidden md:flex relative rounded-lg bg-gradient-to-r from-black to-zinc-900 items-center justify-center">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff33_0%,_transparent_70%)]"></div>
                    </div>
                    <div className="z-10 flex flex-col items-center justify-center gap-6">
                        <Image
                            src="/logo-light.png"
                            alt="BOOKABITE"
                            width={180}
                            height={200}
                            className="object-contain"
                        />
                        <p className="text-white text-sm max-w-xs text-center italic font-light">
                            "Momentos inesquecíveis começam com uma simples reserva"
                        </p>
                    </div>
                </div>

                {/* Lado direito - Formulário */}
                <div className="flex items-center justify-center bg-white p-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleLoginWithCredentials)}
                            className="w-full max-w-sm"
                        >
                            <div className="space-y-2 text-center mb-8">
                                <h1 className="text-2xl font-light text-zinc-800">Bem-vindo</h1>
                                <p className="text-zinc-500 text-sm">
                                    Acesse sua conta para continuar
                                </p>
                            </div>

                            <div className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} placeholder="Email" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        type={visible ? 'text' : 'password'}
                                                        placeholder="Senha"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 group hover:bg-transparent"
                                                        onClick={() => setVisible(!visible)}
                                                    >
                                                        {visible ? (
                                                            <EyeOff
                                                                size={18}
                                                                className="text-zinc-400 group-hover:text-rose-500"
                                                            />
                                                        ) : (
                                                            <Eye
                                                                size={18}
                                                                className="text-zinc-400 group-hover:text-rose-500"
                                                            />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-black group text-white transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader className="h-4 w-4 animate-spin group-hover:text-rose-500" />
                                            <span>Aguarde...</span>
                                        </div>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <LogInIcon className="h-4 w-4" />
                                            Entrar
                                        </span>
                                    )}
                                </Button>

                                <div className="text-center text-sm text-zinc-500 pt-4">
                                    &copy;Todos os direitos reservados
                                    <p className="text-zinc-400 text-xs">BOOKABITE {year}</p>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
}
