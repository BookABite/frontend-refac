'use client'

import { Input } from '@/components/ui/input'
import { Clock } from 'lucide-react'

interface TimePickerProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export const TimePicker = ({ value, onChange, disabled = false }: TimePickerProps) => {
    return (
        <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-zinc-950 dark:text-zinc-300" />
            <Input
                type="time"
                value={value ? new Date(value).toTimeString().slice(0, 5) : ''}
                onChange={(e: any) => {
                    const [hours, minutes] = e.target.value.split(':')
                    const date = new Date()
                    date.setHours(Number(hours), Number(minutes), 0)
                    onChange(date.toISOString())
                }}
                className="w-24 text-zinc-950 dark:text-zinc-300"
                disabled={disabled}
            />
        </div>
    )
}
