import { reservationApi } from '@/utils/resrvation-api'
import { toast } from 'sonner'

export async function fetchBookings(selectedUnit: string) {
    try {
        if (!selectedUnit) {
            throw new Error('ID do restaurante ou unidade não encontrado')
        }

        const response = await reservationApi.getByUnit(selectedUnit)

        if (response.error) {
            throw new Error(response.error)
        }

        return response.data || []
    } catch (error) {
        console.error('Erro ao buscar reservas:', error)
        toast.error('Erro ao carregar as reservas')
        return []
    }
}
