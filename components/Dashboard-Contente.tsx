import { Booking } from '@/types/interfaces'
import { CalendarCheck2, CalendarPlus, CalendarX2 } from 'lucide-react'

import AreaDashboard from './Area-Graphic-Deashboard'
import CalendarBooking from './Calendar-Bookings'
import CardBookings from './Card-Bookings'
import { DataTable } from './Data-Table'

interface DashboardContentProps {
    bookings: Booking[]
    isLoading: boolean
    group: any
}

export function DashboardContent({ bookings, isLoading, group }: DashboardContentProps) {
    const totalBookings = bookings ? bookings.length : 0
    const confirmedBookings = bookings.filter((booking) => booking.status === 'confirmed').length
    const canceledBookings = bookings.filter((booking) => booking.status === 'canceled').length

    return (
        <div className="flex h-full flex-col gap-4">
            <div className="flex flex-1 gap-4">
                <div className="flex w-1/4 flex-col gap-4">
                    <CardBookings
                        totalRevenue={totalBookings}
                        title="Total de Reservas"
                        icon={<CalendarCheck2 />}
                        className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500"
                        isLoading={isLoading}
                    />
                    <CardBookings
                        totalRevenue={confirmedBookings}
                        title="Novas Reservas"
                        icon={<CalendarPlus />}
                        className="flex size-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500"
                        isLoading={isLoading}
                    />
                    <CardBookings
                        totalRevenue={canceledBookings}
                        title="Reservas Canceladas"
                        icon={<CalendarX2 />}
                        className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary"
                        isLoading={isLoading}
                    />
                </div>

                {/* Calendário */}
                <div className="w-1/4">
                    <CalendarBooking
                        bookings={bookings}
                        group_id={group?.group_id}
                        isLoading={isLoading}
                    />
                </div>

                {/* DataTable */}
                <div className="flex-1">
                    <DataTable bookings={bookings} isLoading={isLoading} sizeClients={5} />
                </div>
            </div>

            {/* Área do gráfico (segunda linha) */}
            <div className="flex-1">
                <AreaDashboard isLoading={isLoading} />
            </div>
        </div>
    )
}
