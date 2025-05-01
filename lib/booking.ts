import { reservationApi } from '@/utils/resrvation-api'
import { toast } from 'sonner'

export async function fetchBookings(selectedUnit: string) {
    try {
        const response = await reservationApi.getByUnit(selectedUnit)

        if (response.error) {
            throw new Error(response.error)
        }

        return response.data || []
    } catch (error) {
        console.error('Erro ao buscar reservas:', error)
        return []
    }
}
