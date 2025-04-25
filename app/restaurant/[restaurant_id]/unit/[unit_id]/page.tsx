'use client'

import { ClientBooking } from '@/components/Client-Booking'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { simplifyHours } from '@/types/hours-simplified'
import { UnitInfo } from '@/types/interfaces'
import { motion } from 'framer-motion'
import { Binoculars, ChevronsRight, Clock, Loader, MapPin, Phone, Star } from 'lucide-react'
import Image from 'next/image'
import { use, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface PageParamsProps {
    params: Promise<{
        group_id: string
        unit_id: string
    }>
}

const RestaurantInformation = ({ params }: PageParamsProps) => {
    const { group_id, unit_id } = use(params)
    const [showForm, setShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [restaurant, setRestaurant] = useState<UnitInfo | null>(null)
    const [activeSection, setActiveSection] = useState('info')

    useEffect(
        function fetchRestaurant() {
            const fetchRestaurant = async () => {
                try {
                    const response = await fetch(`/api/unit/${unit_id}`)

                    if (!response.ok) {
                        throw new Error('Failed to fetch restaurant')
                    }

                    const data = await response.json()
                    setRestaurant(data)
                } catch (error) {
                    console.error(error)
                    toast.error('Erro ao encontrar o restaurante')
                } finally {
                    setIsLoading(false)
                }
            }

            if (unit_id && group_id) fetchRestaurant()
        },
        [group_id, unit_id]
    )

    const handleNext = () => {
        setShowForm(true)
    }

    if (showForm) {
        return (
            restaurant && (
                <ClientBooking
                    restaurant={restaurant}
                    group_id={group_id}
                    unitId={unit_id}
                    working_hours={restaurant.working_hours}
                />
            )
        )
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader size={50} className="animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">
                        Carregando detalhes do restaurante...
                    </p>
                </div>
            </div>
        )
    }

    const formatTime = (timeString: string) => {
        return timeString.slice(0, 5)
    }

    const groupedHours = restaurant?.working_hours.reduce(
        (acc, hour) => {
            if (hour.is_closed) return acc

            const dayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][
                hour.day_of_week
            ]

            if (!acc[dayName]) {
                acc[dayName] = []
            }

            acc[dayName].push(`${formatTime(hour.opening_time)} - ${formatTime(hour.closing_time)}`)
            return acc
        },
        {} as Record<string, string[]>
    )

    if (!restaurant) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 p-8">
                <div className="rounded-full bg-red-100 p-4">
                    <MapPin className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold">Restaurante não encontrado</h2>
                <p className="text-center text-muted-foreground">
                    Não conseguimos encontrar o restaurante solicitado.
                </p>
                <Button onClick={() => window.history.back()} variant="outline" className="mt-4">
                    Voltar
                </Button>
            </div>
        )
    }

    return (
        <div className="relative mx-auto max-w-4xl pb-5">
            {/* Hero Image */}
            <div className="relative h-48 w-full overflow-hidden rounded-b-3xl md:h-80">
                <div className="absolute inset-0 bg-[#000000] z-10"></div>
            </div>

            {/* Restaurant Logo */}
            <div className="relative mx-auto -mt-20 flex justify-center z-20">
                <Image
                    src={restaurant.logo || '/default-restaurant-image.png'}
                    alt={`Logo ${restaurant.name}`}
                    width={100}
                    height={100}
                    className="rounded-full h-40 w-40 object-cover border border-white shadow-lg"
                    quality={100}
                    priority
                />
            </div>

            {/* Restaurant Info */}
            <div className="mt-6 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-3xl font-bold tracking-tight">{restaurant.name}</h1>
                    <div className="mt-2 flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">127 avaliações</span>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="ml-2 text-sm text-muted-foreground underline cursor-pointer"
                                >
                                    <Binoculars className="h-4 w-4 text-primary" />
                                    Avaliar
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogTitle>Avaliações</DialogTitle>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground italic">
                        {restaurant.description}
                    </p>
                </motion.div>

                {/* Navigation Tabs */}
                <div className="mt-8 border-b">
                    <div className="flex space-x-6">
                        <Button
                            variant="ghost"
                            onClick={() => setActiveSection('info')}
                            className={`relative pb-2 font-medium transition-colors rounded-t-lg rounded-b-none ${
                                activeSection === 'info'
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Informações
                            {activeSection === 'info' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary"
                                ></motion.div>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setActiveSection('location')}
                            className={`relative pb-2 font-medium transition-colors rounded-t-lg rounded-b-none ${
                                activeSection === 'location'
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Localização
                            {activeSection === 'location' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary"
                                ></motion.div>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeSection === 'info' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                                <Clock className="h-5 w-5 text-primary" />
                                <div>
                                    <h3 className="font-medium">Horário de Funcionamento</h3>
                                    <p
                                        className="mt-1 text-sm text-muted-foreground"
                                        dangerouslySetInnerHTML={{
                                            __html: simplifyHours(groupedHours || {}),
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                                <Phone className="h-5 w-5 text-primary" />
                                <div>
                                    <h3 className="font-medium">Contato</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        (11) 99999-9999 <br />
                                        contato@{restaurant.name.toLowerCase()}.com.br
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                                <MapPin className="h-5 w-5 text-primary" />
                                <div>
                                    <h3 className="font-medium">Endereço</h3>
                                    {restaurant.address.map((addresses, index) => (
                                        <div
                                            key={index}
                                            className="mt-1 text-sm text-muted-foreground"
                                        >
                                            {addresses.street}, {addresses.number} <br />
                                            {addresses.neighborhood}, {addresses.city} -{' '}
                                            {addresses.state}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'location' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <div className="rounded-lg bg-muted/50 p-4">
                                <h3 className="flex items-center gap-2 font-medium mb-3">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Como chegar
                                </h3>
                                <div className="aspect-video overflow-hidden rounded-lg shadow-md">
                                    <iframe
                                        src={restaurant.address[0].maps_url}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="h-full w-full"
                                    ></iframe>
                                </div>
                                <p className="mt-3 text-sm text-muted-foreground">
                                    {restaurant.address[0].street}, {restaurant.address[0].number} -{' '}
                                    {restaurant.address[0].neighborhood},{' '}
                                    {restaurant.address[0].city} - {restaurant.address[0].state}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Reservation Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-8"
                >
                    <Button
                        onClick={handleNext}
                        size="lg"
                        className="group w-full rounded-lg bg-primary font-medium uppercase dark:text-white"
                    >
                        Faça sua Reserva
                        <ChevronsRight className="h-8 w-8 transform transition-transform duration-200 group-hover:translate-x-1" />
                    </Button>
                </motion.div>
            </div>
        </div>
    )
}

export default RestaurantInformation
