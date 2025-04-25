import { fetchBookings } from '@/lib/booking'
import { Booking } from '@/types/interfaces'
import { useCallback, useEffect, useState } from 'react'

export function useFetchBookings(selectedUnit: string) {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const loadBookings = useCallback(async () => {
        setIsLoading(true)
        const data = await fetchBookings(selectedUnit)
        setBookings(data)
        setIsLoading(false)
    }, [selectedUnit])

    useEffect(() => {
        loadBookings()
    }, [loadBookings])

    return { bookings, isLoading, setIsLoading, refetch: loadBookings }
}
