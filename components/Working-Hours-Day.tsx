'use client'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { TimePicker } from './Timer-Picker'

type WorkingHour = {
    day_of_week: number
    opening_time: string
    closing_time: string
    is_closed: boolean
}

interface WorkingHoursDayProps {
    workingHour: WorkingHour
    dayLabel: string
    onUpdate: (field: keyof WorkingHour, value: any) => void
}

export const WorkingHoursDay = ({ workingHour, dayLabel, onUpdate }: WorkingHoursDayProps) => {
    return (
        <div className="flex items-center p-3 rounded-lg bg-background border">
            <div className="flex-1 min-w-32">
                <p className="font-medium text-zinc-950 dark:text-zinc-300">{dayLabel}</p>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={!workingHour.is_closed}
                        onCheckedChange={(checked: any) => onUpdate('is_closed', !checked)}
                    />
                    <span className="text-sm text-muted-foreground">
                        {workingHour.is_closed ? 'Fechado' : 'Aberto'}
                    </span>
                </div>

                {!workingHour.is_closed && (
                    <>
                        <div className="grid gap-1">
                            <Label className="text-xs text-zinc-950 dark:text-zinc-300">
                                Abertura
                            </Label>
                            <TimePicker
                                value={workingHour.opening_time}
                                onChange={(value: any) => onUpdate('opening_time', value)}
                                disabled={workingHour.is_closed}
                            />
                        </div>

                        <div className="grid gap-1">
                            <Label className="text-xs text-zinc-950 dark:text-zinc-300">
                                Fechamento
                            </Label>
                            <TimePicker
                                value={workingHour.closing_time}
                                onChange={(value: any) => onUpdate('closing_time', value)}
                                disabled={workingHour.is_closed}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
