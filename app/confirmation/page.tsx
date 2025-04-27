'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Addresses } from '@/types/interfaces'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { BadgeCheck, Download, Loader } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface RestaurantProps {
    id: string
    restaurantName: string
    restaurantAddress: Addresses[]
}

interface ReservationData {
    first_name: string
    last_name: string
    amount_of_people: number
    amount_of_hours: number
    start_time: string
    end_time: string
    reservation_date: string
    email: string
    country_code: string
    phone: string
    birthday: string | null
    observation: string
    reservation_hash: string
    restaurant: RestaurantProps
}

const Confirmation = () => {
    const [reservationData, setReservationData] = useState<ReservationData | null>(null)
    const ticketRef = useRef<HTMLDivElement>(null)
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

    useEffect(() => {
        const storedData = localStorage.getItem('reservationData')
        if (storedData) {
            setReservationData(JSON.parse(storedData))
        }
    }, [])

    const formatDateTime = (date: string, time: string) => {
        if (!date || !time) return ''

        try {
            const [hours, minutes] = time.split(':')
            const dateObj = new Date(date)
            dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0)

            return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR })
        } catch (error) {
            return `${date} ${time}`
        }
    }

    // Formatar telefone
    const formatPhone = (countryCode: string, phone: string) => {
        if (!countryCode || !phone) return ''

        if (countryCode === '55' && phone.length === 11) {
            return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`
        }

        return `+${countryCode} ${phone}`
    }

    const formatAddress = (address: Addresses) => {
        if (!address) return ''

        return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city} - ${address.state}, ${address.cep}, ${address.country}${address.complement ? `, ${address.complement}` : ''}`
    }

    // Obter o primeiro endereço do restaurante (se existir)
    const getRestaurantAddress = () => {
        if (!reservationData?.restaurant?.restaurantAddress?.length) {
            return 'Endereço não disponível'
        }

        return formatAddress(reservationData.restaurant.restaurantAddress[0])
    }

    const downloadPDF = async () => {
        if (!ticketRef.current) return

        try {
            setIsGeneratingPDF(true)
            const canvas = await html2canvas(ticketRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#1a1a1a', // Fundo escuro
                height: ticketRef.current.scrollHeight,
                windowHeight: ticketRef.current.scrollHeight,
            })

            const imgWidth = 210
            const pageHeight = 310
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            })

            if (imgHeight > pageHeight) {
                const scale = pageHeight / imgHeight
                const scaledWidth = imgWidth * scale
                const xPosition = (imgWidth - scaledWidth) / 2

                pdf.addImage(
                    canvas.toDataURL('image/png'),
                    'PNG',
                    xPosition,
                    0,
                    scaledWidth,
                    pageHeight
                )
            } else {
                const yPosition = (pageHeight - imgHeight) / 2
                pdf.addImage(
                    canvas.toDataURL('image/png'),
                    'PNG',
                    0,
                    yPosition,
                    imgWidth,
                    imgHeight
                )
            }

            pdf.save('reserva-ticket.pdf')
        } catch (error) {
            console.error('Erro ao gerar PDF:', error)
        } finally {
            setIsGeneratingPDF(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-6 p-5">
            <div
                ref={ticketRef}
                className="flex w-full max-w-md flex-col items-center rounded-xl bg-[#1a1a1a] p-8 text-white"
            >
                <div className="flex h-[150px] w-full max-w-[300px] items-center justify-center">
                    <Image
                        src="/success-icon.png"
                        alt="restaurante"
                        width={86}
                        height={86}
                        quality={100}
                        priority
                    />
                </div>

                <h1 className="text-2xl font-bold">Reserva concluída!</h1>
                <p className="mb-8 text-sm text-zinc-400">Sua reserva foi marcada com sucesso.</p>

                <Separator className="mb-5 w-full" />

                <div className="w-full space-y-3">
                    <div className="flex items-start justify-between">
                        <span className="text-sm text-zinc-400">RESERVANTE:</span>
                        <span className="text-right text-sm">
                            {reservationData
                                ? `${reservationData.first_name} ${reservationData.last_name}`
                                : 'Carregando...'}
                        </span>
                    </div>
                    <div className="flex items-start justify-between">
                        <span className="text-sm text-zinc-400">DATA E HORA:</span>
                        <span className="text-right text-sm">
                            {reservationData
                                ? formatDateTime(
                                      reservationData.reservation_date,
                                      reservationData.start_time
                                  )
                                : 'Carregando...'}
                        </span>
                    </div>
                    <div className="flex items-start justify-between">
                        <span className="text-sm text-zinc-400">TELEFONE:</span>
                        <span className="text-right text-sm">
                            {reservationData
                                ? formatPhone(reservationData.country_code, reservationData.phone)
                                : 'Carregando...'}
                        </span>
                    </div>
                    <div className="flex items-start justify-between">
                        <span className="text-sm text-zinc-400">E-MAIL:</span>
                        <span className="text-right text-sm">
                            {reservationData ? reservationData.email : 'Carregando...'}
                        </span>
                    </div>
                    <div className="flex items-start justify-between">
                        <span className="text-sm text-zinc-400">RESTAURANTE:</span>
                        <span className="text-right text-sm">
                            {reservationData?.restaurant?.restaurantName || 'Carregando...'}
                        </span>
                    </div>
                    <div className="flex items-start justify-between">
                        <span className="text-sm text-zinc-400">ID RESERVA:</span>
                        <span className="ml-4 flex-1 text-right text-sm">
                            {reservationData ? reservationData.reservation_hash : 'Carregando...'}
                        </span>
                    </div>
                    <div className="flex items-start justify-between">
                        <span className="text-sm text-zinc-400">ENDEREÇO:</span>
                        <span className="ml-4 flex-1 text-right text-sm">
                            {reservationData ? getRestaurantAddress() : 'Carregando...'}
                        </span>
                    </div>
                </div>

                <Separator className="mt-5 w-full" />

                <p className="mt-8 text-center text-xs italic text-zinc-400">
                    Obrigado por reservar conosco! Aguardamos sua visita.
                </p>
            </div>

            <Button
                onClick={downloadPDF}
                className="flex items-center gap-2"
                disabled={isGeneratingPDF}
            >
                {isGeneratingPDF ? (
                    <div className="flex items-center gap-1">
                        <Loader size={16} className="animate-spin" />
                        Gerando PDF...
                    </div>
                ) : (
                    <div className="flex items-center gap-1 dark:text-white">
                        <Download size={16} />
                        Baixar comprovante
                    </div>
                )}
            </Button>
        </div>
    )
}

export default Confirmation
