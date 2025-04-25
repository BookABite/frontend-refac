'use client'

import { Button } from '@/components/ui/button'
import { Calendar, Clock, Trash2 } from 'lucide-react'

type BlockedHour = {
    start_datetime: string
    end_datetime: string
    reason: string
    id?: string
}

interface BlockedHourItemProps {
    blockedHour: BlockedHour
    onRemove: (id: string) => void
}

export const BlockedHourItem = ({ blockedHour, onRemove }: BlockedHourItemProps) => {
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                        {new Date(blockedHour.start_datetime).toLocaleDateString('pt-BR')} -{' '}
                        {new Date(blockedHour.end_datetime).toLocaleDateString('pt-BR')}
                    </span>
                </div>

                <div className="flex items-center mt-1 space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                        {new Date(blockedHour.start_datetime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(blockedHour.end_datetime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">{blockedHour.reason}</p>
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => blockedHour.id && onRemove(blockedHour.id)}
            >
                <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
        </div>
    )
}
