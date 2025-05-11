'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Send, Star, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface ReviewDialogProps {
    unitId: string
    unitName: string
    onReviewSubmit: () => void
}

const formSchema = z.object({
    stars: z.number().min(1, 'Avaliação é obrigatória'),
    comment: z.string().min(10, 'Mínimo 10 caracteres'),
    customer_name: z.string().min(1, 'Nome é obrigatório'),
    customer_email: z.string().email('Email inválido'),
})

export function ReviewDialog({ unitId, unitName, onReviewSubmit }: ReviewDialogProps) {
    const [open, setOpen] = useState(false)
    const [hoverRating, setHoverRating] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            stars: 0,
            comment: '',
            customer_name: '',
            customer_email: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)

            const response = await fetch('/api/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    unit_id: unitId,
                }),
            })

            if (!response.ok) {
                throw new Error('Falha ao enviar avaliação')
            }

            toast.success('Avaliação enviada com sucesso!')
            setOpen(false)
            form.reset()
            onReviewSubmit() // Atualiza a lista de avaliações
        } catch (error: any) {
            toast.error(error.message || 'Erro ao enviar avaliação')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>Avaliar</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-zinc-100">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-medium">
                            Avaliação {unitName}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="stars"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-center block">
                                            Sua avaliação
                                        </FormLabel>
                                        <div className="flex justify-center gap-2 py-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    type="button"
                                                    key={star}
                                                    onClick={() => field.onChange(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`h-9 w-9 ${
                                                            (hoverRating || field.value) >= star
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-200'
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <FormMessage className="text-center" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comentário</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Conte como foi sua experiência..."
                                                className="min-h-[120px] resize-none focus-visible:ring-blue-300"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="customer_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Seu Nome</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Seu nome completo"
                                                    className="focus-visible:ring-blue-300"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="customer_email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Seu Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="seu@email.com"
                                                    className="focus-visible:ring-blue-300"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Star className="h-4 w-4" />
                                        Enviar Avaliação
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
