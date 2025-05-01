'use client'

import { Booking } from '@/types/interfaces'
import { Loader, Salad, Table2 } from 'lucide-react'
import { useState } from 'react'

import SeatingFilters from './Seating-Filters'
import Table from './Table'
import TableStatusLegend from './Table-Status-Legend'

interface SeatingLayoutProps {
    bookings: Booking[]
    isLoading: boolean
}

export default function SeatingLayout({ bookings, isLoading }: SeatingLayoutProps) {
    const [selectedTab, setSelectedTab] = useState('all')
    const [date, setDate] = useState<Date | undefined>(new Date())

    const selectedDate = date
        ? date.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
    const filteredByDate = bookings.filter((booking) => booking.reservation_date === selectedDate)

    const sortedBookings = [...filteredByDate].sort((a, b) => {
        const priority: { [key in Booking['status']]: number } = {
            confirmed: 0,
            finished: 1,
            canceled: 2,
            undefined: 3,
        }
        return priority[a?.status ?? 'undefined'] - priority[b?.status ?? 'undefined']
    })

    const minTables = Math.ceil(bookings.length / 5) * 5
    const totalTables = Math.max(15, minTables)

    const filteredTables = Array(totalTables)
        .fill(null)
        .map((_, i) => sortedBookings[i] || null)
        .filter((booking) => {
            switch (selectedTab) {
                case 'free':
                    return booking === null
                case 'reserved':
                    return booking?.status === 'confirmed'
                case 'concluded':
                    return booking?.status === 'finished'
                case 'canceled':
                    return booking?.status === 'canceled'
                default:
                    return true
            }
        })

    return (
        <div className="h-full w-full rounded-lg p-2 bg-card shadow dark:bg-zinc-900">
            {isLoading ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg dark:bg-zinc-900 p-8">
                    <h1 className="text-2xl font-medium text-zinc-300">Carregando...</h1>
                    <Loader className="size-10 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <SeatingFilters
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        date={date}
                        onDateChange={setDate}
                    />

                    <div className="flex flex-col items-start justify-center mb-4">
                        <p className="flex gap-2 text-xl font-bold uppercase">
                            <Salad />
                            reservas
                        </p>
                        <p className="text-sm font-light text-zinc-300">
                            Visualização de mesas reservadas para o dia
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-10">
                        <div className="flex flex-col items-start">
                            {Array(Math.ceil(filteredTables.length / 5))
                                .fill(null)
                                .map((_, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        className="flex w-full justify-around gap-4 mb-4"
                                    >
                                        {filteredTables
                                            .slice(rowIndex * 5, (rowIndex + 1) * 5)
                                            .map((booking, colIndex) => (
                                                <Table
                                                    key={`${rowIndex}-${colIndex}`}
                                                    seats={
                                                        booking?.amount_of_people ||
                                                        (rowIndex === 1 ? 8 : 4)
                                                    }
                                                    shape={
                                                        booking?.amount_of_people
                                                            ? booking.amount_of_people > 4
                                                                ? 'oval'
                                                                : 'round'
                                                            : rowIndex === 1
                                                              ? 'oval'
                                                              : 'round'
                                                    }
                                                    booking={booking}
                                                />
                                            ))}
                                    </div>
                                ))}
                        </div>

                        <TableStatusLegend />
                    </div>
                </>
            )}
        </div>
    )
}
