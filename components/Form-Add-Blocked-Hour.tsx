'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'

type BlockedHour = {
    start_datetime: string
    end_datetime: string
    reason: string
}

interface AddBlockedHourFormProps {
    newBlockedHour: BlockedHour
    onAdd: () => void
    onChange: (field: keyof BlockedHour, value: string) => void
}

export const AddBlockedHourForm = ({
    newBlockedHour,
    onAdd,
    onChange,
}: AddBlockedHourFormProps) => {
    return (
        <div className="grid gap-4 p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-zinc-950 dark:text-zinc-300">
                Adicionar Novo Bloqueio
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="start-date" className="text-zinc-950 dark:text-zinc-300">
                        Data e Hora de Início
                    </Label>
                    <Input
                        id="start-date"
                        type="datetime-local"
                        value={
                            newBlockedHour.start_datetime
                                ? new Date(newBlockedHour.start_datetime).toISOString().slice(0, 16)
                                : ''
                        }
                        onChange={(e: any) => {
                            const date = new Date(e.target.value)
                            onChange('start_datetime', date.toISOString())
                        }}
                        className="text-zinc-950 dark:text-zinc-300"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="end-date text-zinc-950 dark:text-zinc-300">
                        Data e Hora de Término
                    </Label>
                    <Input
                        id="end-date"
                        type="datetime-local"
                        value={
                            newBlockedHour.end_datetime
                                ? new Date(newBlockedHour.end_datetime).toISOString().slice(0, 16)
                                : ''
                        }
                        onChange={(e: any) => {
                            const date = new Date(e.target.value)
                            onChange('end_datetime', date.toISOString())
                        }}
                        className="text-zinc-950 dark:text-zinc-300"
                    />
                </div>
            </div>

            <div className="grid gap-2 text-zinc-950 dark:text-zinc-300">
                <Label htmlFor="reason">Motivo</Label>
                <Input
                    id="reason"
                    placeholder="Ex: Manutenção, Feriado, Evento privado..."
                    value={newBlockedHour.reason}
                    onChange={(e: any) => onChange('reason', e.target.value)}
                />
            </div>

            <div className="flex justify-end">
                <Button onClick={onAdd} className="text-zinc-300">
                    <Plus className="w-4 h-4" />
                    Adicionar Bloqueio
                </Button>
            </div>
        </div>
    )
}
