'use client'

import { useCountries } from '@/hooks/use-countries'
import { ClientBookingProps } from '@/types/interfaces'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CookingPot, Loader } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { AdditionalInfoStep } from './Additional-InfoStep'
import { NavigationButtons } from './Navigation-Buttons'
import { PersonalInfoStep } from './Personal-InfoStep'
import { ProgressIndicator } from './Progress-Indicator'
import { ReservationDetailsStep } from './Reservation-InfoStep'
import { Button } from './ui/button'
import { Form } from './ui/form'

const FormSchema = z.object({
    first_name: z.string().min(1, 'Digite o seu nome'),
    last_name: z.string().min(1, 'Digite o seu nome'),
    amount_of_people: z.coerce.number().min(1, 'Digite um número válido'),
    amount_of_hours: z.coerce.number().min(1, 'Digite um número válido'),
    time: z.string().min(1, 'Digite o horário'),
    date: z.string().min(1, 'Digite a data'),
    email: z.string().email('Digite um email válido'),
    country_code: z.string().min(1, 'Digite o código do país'),
    phone: z.string().min(9, 'Digite um telefone válido'),
    observations: z.string().optional(),
    birthday: z.string().optional(),
})

export type FormData = z.infer<typeof FormSchema>

export const ClientBooking = ({ group_id, unitId, unit }: ClientBookingProps) => {
    const totalSteps = 3
    const router = useRouter()
    const { countries, loading, error } = useCountries()
    const [isLoading, setIsLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedCountry, setSelectedCountry] = useState<string>('+55')

    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            amount_of_people: 1,
            amount_of_hours: 1,
            time: '',
            date: '',
            email: '',
            country_code: '+55',
            phone: '',
            observations: '',
            birthday: '',
        },
    })

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true)
            if (!group_id) return
            const reservationDate = new Date(data.date)
            const [hours, minutes] = data.time.split(':').map(Number)
            reservationDate.setHours(hours, minutes, 0, 0)

            const endTime = new Date(reservationDate)
            endTime.setHours(endTime.getHours() + data.amount_of_hours)

            const formattedData = {
                first_name: data.first_name,
                last_name: data.last_name,
                amount_of_people: data.amount_of_people,
                amount_of_hours: data.amount_of_hours,
                start_time: reservationDate.toISOString().split('T')[1].split('.')[0],
                end_time: endTime.toISOString().split('T')[1].split('.')[0],
                reservation_date: data.date,
                email: data.email,
                country_code: data.country_code.replace('+', ''),
                phone: data.phone,
                birthday: data.birthday || null,
                observation: data.observations || '',
            }

            const response = await fetch(`/api/reservations/group/${group_id}/unit/${unitId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            })

            const responseData = await response.json()

            if (!response.ok) {
                if (responseData.detail && Array.isArray(responseData.detail)) {
                    const errorMessage = responseData.detail
                        .map((error: any) => error.msg)
                        .join(', ')
                    toast.error(errorMessage)
                } else {
                    toast.error('Erro ao realizar reserva')
                }
                return
            }

            if (response.ok) {
                const reservationData = {
                    ...formattedData,
                    reservation_hash: responseData.reservation_hash,
                    restaurant: {
                        id: group_id,
                        restaurantName: unit.name,
                        restaurantAddress: unit.address,
                    },
                }

                localStorage.setItem('reservationData', JSON.stringify(reservationData))
                toast.success('Reserva realizada com sucesso')
                form.reset()
                router.push('/confirmation')
            }
        } catch (error) {
            console.error('Erro completo:', error)
            toast.error('Erro ao realizar reserva')
        } finally {
            setIsLoading(false)
        }
    }

    const sortedCountries = [...countries]
        .filter((country) => country.phoneCode && country.phoneCode.trim() !== '')
        .sort((a, b) => {
            if (a.code === 'BR') return -1
            if (b.code === 'BR') return 1
            return a.name.localeCompare(b.name)
        })

    const getCountryFlag = (phoneCode: string) => {
        return countries.find((country) => country.phoneCode === phoneCode)?.flag || '/aaa.png'
    }

    const goToNextStep = async () => {
        let isValid = false
        let errorMessage = ''

        if (currentStep === 1) {
            isValid = await form.trigger(['first_name', 'last_name', 'email', 'phone'])
            if (!isValid) {
                errorMessage = 'Por favor, preencha todos os campos obrigatórios do formulário.'
            }
        } else if (currentStep === 2) {
            isValid = await form.trigger(['amount_of_people', 'amount_of_hours', 'time', 'date'])
            if (!isValid) {
                errorMessage = 'Por favor, preencha todos os detalhes da reserva corretamente.'
            }
        }

        if (!isValid) {
            toast.error(errorMessage)
            return
        }

        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    const goToPreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const fadeInAnimation = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 },
    }

    return (
        <div className="relative mx-auto max-w-4xl pb-5">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-col items-center"
            >
                <div className="relative mb-4 flex flex-col items-center w-full">
                    <div className="relative h-48 w-full overflow-hidden rounded-b-3xl md:h-80">
                        <Image
                            src={unit.banner_image || '/back.png'}
                            alt={`Banner ${unit.name}`}
                            layout="fill"
                            objectFit="cover"
                            className="absolute inset-0 z-10"
                            priority
                        />
                    </div>

                    {/* Restaurant Logo */}
                    <div className="relative mx-auto -mt-20 flex justify-center z-20">
                        <Image
                            src={unit.logo || '/default-restaurant-image.png'}
                            alt={`Logo ${unit.name}`}
                            width={100}
                            height={100}
                            className="rounded-full h-40 w-40 object-cover border border-white shadow-lg"
                            quality={100}
                            priority
                        />
                    </div>
                    <h1 className="mt-4 text-2xl font-bold">{unit.name}</h1>
                    <p className="text-sm text-muted-foreground">Reserve sua mesa</p>
                </div>
            </motion.div>

            <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-5">
                    {currentStep === 1 && (
                        <motion.div {...fadeInAnimation}>
                            <PersonalInfoStep
                                form={form}
                                loading={loading}
                                selectedCountry={selectedCountry}
                                setSelectedCountry={setSelectedCountry}
                                getCountryFlag={getCountryFlag}
                                sortedCountries={sortedCountries}
                                error={error}
                            />
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div {...fadeInAnimation}>
                            <ReservationDetailsStep form={form} unit={unit} />
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div {...fadeInAnimation}>
                            <AdditionalInfoStep form={form} />
                        </motion.div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                        <NavigationButtons
                            currentStep={currentStep}
                            totalSteps={totalSteps}
                            isLoading={isLoading}
                            onPrevious={goToPreviousStep}
                            onNext={goToNextStep}
                        />

                        {currentStep === totalSteps && (
                            <Button
                                type="submit"
                                className="group  rounded-lg dark:text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader size={16} className="animate-spin" />
                                        Reservando...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <CookingPot
                                            size={16}
                                            className="group-hover:animate-bounce"
                                        />
                                        <span>Finalizar Reserva</span>
                                    </div>
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    )
}
