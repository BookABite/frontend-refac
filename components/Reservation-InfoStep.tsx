import { UnitInfo } from '@/types/interfaces'
import { Calendar, Clock, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from './ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Separator } from './ui/separator'

interface ReservationDetailsStepProps {
    form: any
    unit: UnitInfo
}

export const ReservationDetailsStep = ({ form, unit }: ReservationDetailsStepProps) => {
    const [availableTimes, setAvailableTimes] = useState<string[]>([])
    const [selectedDate, setSelectedDate] = useState<string>('')

    const generateAvailableTimes = (date: string) => {
        if (!date) return []

        const dateObj = new Date(date)
        const dayOfWeek = dateObj.getDay()

        const dayWorkingHours = unit.working_hours.filter(
            (wh: any) => wh.day_of_week === dayOfWeek && !wh.is_closed
        )

        if (dayWorkingHours.length === 0) return []

        const times: string[] = []
        dayWorkingHours.forEach((wh: any) => {
            const [openingHour, openingMinute] = wh.opening_time.split(':').map(Number)
            const [closingHour, closingMinute] = wh.closing_time.split(':').map(Number)

            let currentHour = openingHour
            let currentMinute = openingMinute

            while (
                currentHour < closingHour ||
                (currentHour === closingHour && currentMinute < closingMinute)
            ) {
                const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
                times.push(timeStr)

                currentMinute += 30
                if (currentMinute >= 60) {
                    currentMinute = 0
                    currentHour += 1
                }
            }
        })

        return times
    }

    useEffect(() => {
        const date = form.watch('date')
        if (date && date !== selectedDate) {
            setSelectedDate(date)
            const times = generateAvailableTimes(date)
            setAvailableTimes(times)

            if (times.length === 0) {
                form.setError('date', {
                    type: 'manual',
                    message: 'O restaurante está fechado nesta data',
                })
            } else {
                form.clearErrors('date')
            }
        }
    }, [form.watch('date')])

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium">
                <Calendar size={20} className="text-primary" />
                <h2>Detalhes da Reserva</h2>
            </div>
            <Separator />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1">
                                <Calendar size={16} className="text-primary" />
                                Data
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]} // Não permite datas passadas
                                    {...field}
                                    className="rounded-lg"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1">
                                <Clock size={16} className="text-primary" />
                                Horário
                            </FormLabel>
                            <FormControl>
                                <Input type="time" {...field} className="rounded-lg" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="amount_of_people"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1">
                                <Users size={16} className="text-primary" />
                                Qtd. de pessoas
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min="1"
                                    max="20"
                                    placeholder="Número de pessoas"
                                    className="rounded-lg"
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amount_of_hours"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1">
                                <Clock size={16} className="text-primary" />
                                Duração (horas)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min="1"
                                    max="4"
                                    placeholder="Duração em horas"
                                    className="rounded-lg"
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {availableTimes.length > 0 && (
                <div className="rounded-lg bg-rose-50 p-4 dark:bg-rose-950/30">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                        <Clock className="h-5 w-5" />
                        <p className="text-sm font-medium">Horários disponíveis</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {availableTimes.map((time) => (
                            <Button
                                key={time}
                                type="button"
                                className={`rounded-lg px-3 py-1 text-xs font-medium shadow-sm transition-colors ${
                                    form.watch('time') === time
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-white hover:bg-rose-100 dark:bg-rose-900/40 dark:hover:bg-rose-900/70'
                                }`}
                                onClick={() => form.setValue('time', time)}
                                variant="outline"
                            >
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {availableTimes.length === 0 && selectedDate && (
                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/30">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <Clock className="h-5 w-5" />
                        <p className="text-sm font-medium">Nenhum horário disponível nesta data</p>
                    </div>
                </div>
            )}
        </div>
    )
}
