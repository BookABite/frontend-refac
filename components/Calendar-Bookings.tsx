import { Calendar } from '@/components/ui/calendar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Booking } from '@/types/interfaces'
import { format, isSameDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface CalendarBookingProps {
    bookings: Booking[]
    group_id: string | undefined
    isLoading?: boolean
}

const CalendarBooking = ({ bookings = [], group_id, isLoading }: CalendarBookingProps) => {
    const [highlightedDays, setHighlightedDays] = useState<Date[]>([])

    useEffect(() => {
        const highlightedDates = bookings.map((booking) => parseISO(booking.reservation_date))
        setHighlightedDays(highlightedDates)
    }, [bookings])

    const isDayHighlighted = (date: Date) => {
        return highlightedDays.some((highlightedDay) => isSameDay(highlightedDay, date))
    }

    const getBookingsForDay = (date: Date) => {
        return bookings.filter((booking) => booking.reservation_date === format(date, 'yyyy-MM-dd'))
    }

    return (
        <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg border-none bg-card shadow transition-all duration-300 hover:shadow-md dark:bg-zinc-900/80">
            {' '}
            {isLoading ? (
                <div className="flex h-full w-full flex-col p-4">
                    <div className="flex items-center justify-between px-2">
                        <Skeleton className="h-8 w-24" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </div>

                    <Skeleton className="mt-4 h-0.5 w-full" />

                    <div className="mt-4 grid flex-1 grid-cols-7 gap-2">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <Skeleton key={`header-${i}`} className="h-6 w-full" />
                        ))}

                        {Array.from({ length: 35 }).map((_, i) => (
                            <Skeleton key={`day-${i}`} className="h-10 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="relative flex-1">
                    <Calendar
                        mode="single"
                        locale={ptBR}
                        components={{
                            DayContent: ({ date }) => {
                                const bookingsForDay = getBookingsForDay(date)
                                const hasBookings = bookingsForDay.length > 0

                                return (
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <div className="group relative flex h-full w-full cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                                <span
                                                    className={`text-sm ${hasBookings ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}`}
                                                >
                                                    {date.getDate()}
                                                </span>

                                                {isDayHighlighted(date) && (
                                                    <div className="absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 transform rounded-full bg-primary">
                                                        <div className="size-1.5 animate-ping rounded-full bg-primary opacity-75"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </HoverCardTrigger>

                                        <HoverCardContent
                                            side="top"
                                            align="center"
                                            className="w-[300px] max-w-[90vw] rounded-lg border-none bg-white/95 shadow-lg backdrop-blur-sm dark:bg-zinc-900/95 md:w-[350px]"
                                        >
                                            <div className="flex flex-col items-start p-3">
                                                <span className="flex flex-col items-start text-base font-medium">
                                                    <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                                        Reservas
                                                    </p>
                                                    <p className="text-sm font-medium capitalize text-zinc-800 dark:text-zinc-200">
                                                        {format(date, "dd 'de' MMMM 'de' yyyy", {
                                                            locale: ptBR,
                                                        })}
                                                    </p>
                                                </span>

                                                {hasBookings ? (
                                                    <div className="z-50 mt-3 flex max-h-64 w-full flex-col gap-2 overflow-y-auto text-start scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                                                        {bookingsForDay.map((booking, index) => (
                                                            <motion.div
                                                                key={booking.reservation_hash}
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{
                                                                    duration: 0.2,
                                                                    delay: index * 0.05,
                                                                }}
                                                                className="flex flex-col rounded-lg bg-zinc-100 p-2.5 text-start shadow-sm dark:bg-zinc-800"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                                                        <p>Reserva {index + 1}</p>
                                                                        <div className="size-1.5 rounded-full bg-emerald-500">
                                                                            <div className="size-1.5 animate-pulse rounded-full bg-emerald-500"></div>
                                                                        </div>
                                                                    </span>
                                                                    <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                                                                        {booking.start_time.slice(
                                                                            0,
                                                                            5
                                                                        )}{' '}
                                                                        • {booking.amount_of_hours}h
                                                                    </span>
                                                                </div>

                                                                <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                                    {booking.first_name +
                                                                        ' ' +
                                                                        booking.last_name}
                                                                </p>

                                                                <div className="mt-1 flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                                                                    <span className="flex items-center gap-1">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="12"
                                                                            height="12"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        >
                                                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                                            <circle
                                                                                cx="9"
                                                                                cy="7"
                                                                                r="4"
                                                                            ></circle>
                                                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                                                        </svg>
                                                                        {booking.amount_of_people}
                                                                    </span>
                                                                </div>

                                                                {booking.observation && (
                                                                    <p className="mt-2 text-xs italic text-zinc-500 dark:text-zinc-500">
                                                                        {booking.observation}
                                                                    </p>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 flex w-full items-center justify-center py-4">
                                                        <span className="text-sm text-zinc-400 dark:text-zinc-500">
                                                            Dia livre
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                )
                            },
                        }}
                        styles={{
                            months: {
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            },
                            month: {
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            },
                            table: {
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            },
                            tbody: {
                                flex: '1',
                                height: '100%',
                                flexDirection: 'column',
                            },
                            head_cell: {
                                width: '100%',
                                textTransform: 'capitalize',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: 'var(--text-muted)',
                                padding: '0.5rem 0',
                            },
                            cell: {
                                width: '100%',
                                height: '42px',
                                padding: '2px',
                                borderRadius: '0',
                            },
                            button: {
                                width: '100%',
                                height: '100%',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease',
                            },
                            nav_button_previous: {
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease',
                            },
                            nav_button_next: {
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease',
                            },
                            caption: {
                                textTransform: 'capitalize',
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: 'var(--text-primary)',
                            },
                        }}
                        className="calendar-custom h-full flex-1"
                    />
                </div>
            )}
        </div>
    )
}

export default CalendarBooking
