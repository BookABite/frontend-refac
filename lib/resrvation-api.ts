import apiBookaBite from '@/lib/booking-service'
import { Booking } from '@/types/interfaces'

export const reservationApi = {
    /**
     * Busca todas as reservas de uma unidade
     */
    getByUnit: (unitId: string) => {
        return apiBookaBite.get<Booking[]>(`/unit/${unitId}/reservations`)
    },

    /**
     * Busca todas as reservas de uma unidade
     */
    getByRestaurant: (restaurantId: string) => {
        return apiBookaBite.get<Booking[]>(`/group/dashboard/${restaurantId}/dashboard`)
    },

    /**
     * Busca uma reserva específica pelo ID
     */
    getById: (bookingId: string) => {
        return apiBookaBite.get<Booking>(`/reservations/${bookingId}`)
    },

    /**
     * Cria uma nova reserva
     */
    create: (unitId: string, bookingData: Omit<Booking, 'id'>) => {
        return apiBookaBite.post<Booking>(`/reservations/group/${unitId}`, bookingData)
    },

    /**
     * Atualiza o status de uma reserva existente
     */
    updateStatus: (bookingId: string, status: string) => {
        return apiBookaBite.patch<Booking>(`/reservations/${bookingId}`, { status })
    },

    /**
     * Cancela uma reserva
     */
    cancel: (bookingId: string) => {
        return apiBookaBite.delete<{ success: boolean }>(`/reservations/${bookingId}`)
    },
}
