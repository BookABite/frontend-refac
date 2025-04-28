'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
    AlertCircle,
    Building2,
    Globe,
    Image as ImageIcon,
    Loader,
    Mail,
    MapPin,
    Phone,
    SaveIcon,
    Upload,
    Utensils,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
    unit_id: z.string().min(1, 'ID da unidade é obrigatório'),
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional().or(z.literal('')),
    description: z
        .string()
        .min(10, 'Descrição deve ter pelo menos 10 caracteres')
        .optional()
        .or(z.literal('')),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    phone: z
        .string()
        .min(10, 'Telefone deve ter pelo menos 10 dígitos')
        .optional()
        .or(z.literal('')),
    logo: z.string().url('URL da logo inválida').optional().or(z.literal('')),
    banner_image: z.string().url('URL da imagem de banner inválida').optional().or(z.literal('')),
    website: z.string().url('URL do website inválida').optional().or(z.literal('')),
    address: z
        .string()
        .min(5, 'Endereço deve ter pelo menos 5 caracteres')
        .optional()
        .or(z.literal('')),
})

type FormValues = z.infer<typeof formSchema>

interface UnitUpdateFormProps {
    unitId: string
}

export function UnitUpdateForm({ unitId }: UnitUpdateFormProps) {
    const router = useRouter()
    const { refreshUserData } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [uploadingBanner, setUploadingBanner] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [bannerUrl, setBannerUrl] = useState('')

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            unit_id: unitId || '',
            name: '',
            description: '',
            email: '',
            phone: '',
            logo: '',
            banner_image: '',
            website: '',
            address: '',
        },
    })

    useEffect(() => {
        if (unitId && unitId !== form.getValues('unit_id')) {
            form.setValue('unit_id', unitId)
            fetchUnitData(unitId)
        }
    }, [unitId, form])

    const fetchUnitData = async (id: string) => {
        if (!id) {
            setErrorMessage('ID da unidade não fornecido')
            return
        }

        setIsLoading(true)
        setErrorMessage(null)

        try {
            const response = await fetch(`/api/unit/${id}`)

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()

            const currentValues = form.getValues()
            form.reset({
                ...data,
                banner_image: currentValues.banner_image || data.banner_image,
            })
        } catch (error) {
            console.error('Erro ao carregar dados da unidade:', error)
            setErrorMessage(
                `Erro ao carregar dados da unidade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            )
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (unitId) {
            fetchUnitData(unitId)
        }
    }, [])

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true)
        try {
            const payload = Object.fromEntries(
                Object.entries(data).filter(([_, value]) => value !== null && value !== '')
            )

            const response = await fetch(`/api/unit/${unitId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                toast.success('Unidade atualizada com sucesso!')
                await refreshUserData()
            } else {
                const errorData = await response.json().catch(() => null)
                throw new Error(
                    errorData?.message || `Erro ${response.status}: ${response.statusText}`
                )
            }
        } catch (error) {
            console.error('Erro ao atualizar unidade:', error)
            toast.error(
                `Erro ao atualizar unidade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleBannerUpload = async () => {
        if (!bannerUrl) {
            toast.error('Por favor, insira uma URL válida')
            return
        }

        setUploadingBanner(true)
        try {
            const image = new Image()
            image.src = bannerUrl

            await new Promise((resolve, reject) => {
                image.onload = resolve
                image.onerror = reject
            })

            form.setValue('banner_image', bannerUrl, { shouldValidate: true })
            toast.success('Banner atualizado com sucesso!')
            setBannerUrl('')
        } catch (error) {
            toast.error('URL inválida ou imagem não encontrada')
        } finally {
            setUploadingBanner(false)
        }
    }

    if (!unitId) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <AlertCircle className="h-12 w-12 text-rose-600 mb-4" />
                <h3 className="text-lg font-medium text-zinc-800">Nenhuma unidade selecionada</h3>
                <p className="text-zinc-500 mt-2">
                    Selecione uma unidade no menu lateral para editar suas informações.
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
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl font-medium text-zinc-800">
                                Atualizar Unidade
                            </CardTitle>
                            <CardDescription className="mt-1 text-zinc-500">
                                Atualize as informações da sua unidade de restaurante
                            </CardDescription>
                        </div>

                        <div className="flex flex-col items-center">
                            <Avatar className="w-16 h-16 border-2 border-zinc-400 shadow-md">
                                <AvatarImage src={form.watch('logo')} alt="Logo do restaurante" />
                                <AvatarFallback className="bg-rose-100 text-rose-800">
                                    <Utensils size={24} />
                                </AvatarFallback>
                            </Avatar>
                        </div>
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
                            <Loader className="h-8 w-8 text-rose-600 animate-spin" />
                            <span className="ml-2 text-zinc-500">Carregando dados...</span>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="grid grid-cols-1 gap-2"
                                    >
                                        <div className="relative h-48 w-full mb-6 rounded-lg overflow-hidden bg-zinc-100">
                                            {form.watch('banner_image') ? (
                                                <img
                                                    src={form.watch('banner_image')}
                                                    alt="Banner"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <ImageIcon
                                                        size={32}
                                                        className="text-zinc-400"
                                                    />
                                                </div>
                                            )}

                                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="url"
                                                        placeholder="Cole a URL da imagem do banner"
                                                        className="bg-white/90 text-black placeholder:text-zinc-500 border-none"
                                                        value={bannerUrl}
                                                        onChange={(e) =>
                                                            setBannerUrl(e.target.value)
                                                        }
                                                        disabled={uploadingBanner}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-white border-white/30 bg-black/30 hover:bg-black/50 backdrop-blur-sm whitespace-nowrap"
                                                        onClick={handleBannerUpload}
                                                        disabled={uploadingBanner || !bannerUrl}
                                                    >
                                                        {uploadingBanner ? (
                                                            <>
                                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                                <span>Carregando...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload className="mr-2 h-4 w-4" />
                                                                <span>Aplicar</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="logo"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center text-zinc-700">
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Logo do restaurante
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    {...field}
                                                                    placeholder="URL da logo"
                                                                    className="bg-zinc-50"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="whitespace-nowrap"
                                                                    onClick={() =>
                                                                        handleBannerUpload()
                                                                    }
                                                                    disabled={uploadingLogo}
                                                                >
                                                                    {uploadingLogo ? (
                                                                        <Loader className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <span>Upload</span>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="unit_id"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center text-zinc-700">
                                                            ID da unidade
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                readOnly
                                                                disabled
                                                                className="bg-zinc-100"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </motion.div>

                                    <Separator className="my-6" />

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h3 className="text-sm font-medium text-zinc-700 mb-4">
                                            Informações da Unidade
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center text-zinc-700">
                                                            <Building2 className="h-4 w-4 mr-2" />
                                                            Nome da unidade
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Ex: Filial Centro"
                                                                className="bg-zinc-50"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center text-zinc-700">
                                                        Descrição
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            placeholder="Descreva seu restaurante..."
                                                            className="resize-none h-24 bg-zinc-50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    <Separator className="my-6" />

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <h3 className="text-sm font-medium text-zinc-700 mb-4">
                                            Contato e Localização
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center text-zinc-700">
                                                            <Mail className="h-4 w-4 mr-2" />
                                                            Email
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="contato@restaurante.com"
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
                                                        <FormLabel className="flex items-center text-zinc-700">
                                                            <Phone className="h-4 w-4 mr-2" />
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
                                                name="website"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center text-zinc-700">
                                                            <Globe className="h-4 w-4 mr-2" />
                                                            Website
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="https://www.seurestaurante.com"
                                                                className="bg-zinc-50"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center text-zinc-700">
                                                            <MapPin className="h-4 w-4 mr-2" />
                                                            Endereço
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Rua, número, bairro, cidade - UF"
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
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-rose-600 hover:bg-rose-700 text-white"
                                        disabled={isLoading || form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting ? (
                                            <>
                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                <span>Salvando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <SaveIcon className="mr-2 h-4 w-4" />
                                                <span>Salvar alterações</span>
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
