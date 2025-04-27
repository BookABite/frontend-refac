'use client'

import { Booking } from '@/types/interfaces'
import { format } from 'date-fns'
import { ReactNode } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

interface BookingDetailsDialogProps {
    booking?: Booking
    children: ReactNode
}

export default function BookingDetailsDialog({ booking, children }: BookingDetailsDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalhes da Reserva</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Reservante:</p>
                        <p className="text-sm">{booking?.first_name || 'N/A'}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium">Quantidade de Pessoas:</p>
                        <p className="text-sm">{booking?.amount_of_people || 'N/A'}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium">Data:</p>
                        <p className="text-sm">
                            {booking?.reservation_date
                                ? format(new Date(booking.reservation_date), 'dd/MM/yyyy')
                                : 'N/A'}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium">Horário:</p>
                        <p className="text-sm">
                            {booking?.start_time && booking?.end_time
                                ? `${booking.start_time} - ${booking.end_time}`
                                : 'N/A'}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium">Status:</p>
                        <p className="text-sm capitalize">{booking?.status || 'N/A'}</p>
                    </div>

                    {booking?.observation && (
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Observações:</p>
                            <p className="text-sm whitespace-pre-line">{booking.observation}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
