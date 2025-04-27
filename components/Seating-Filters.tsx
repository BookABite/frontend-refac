'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
    BatteryChargingIcon,
    BatteryFull,
    BatteryLow,
    BatteryPlus,
    BatteryWarning,
} from 'lucide-react'
import { CalendarIcon } from 'lucide-react'

import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface SeatingFiltersProps {
    selectedTab: string
    onTabChange: (value: string) => void
    date: Date | undefined
    onDateChange: (date: Date | undefined) => void
}

export default function SeatingFilters({
    selectedTab,
    onTabChange,
    date,
    onDateChange,
}: SeatingFiltersProps) {
    return (
        <div className="flex justify-between items-center mb-4">
            <Tabs defaultValue="all" value={selectedTab} onValueChange={onTabChange}>
                <TabsList>
                    <TabsTrigger value="all" className="text-zinc-800 cursor-pointer">
                        <BatteryChargingIcon className="size-4" />
                        Todas
                    </TabsTrigger>
                    <TabsTrigger value="free" className="text-zinc-500 cursor-pointer">
                        <BatteryLow className="size-4" />
                        Livres
                    </TabsTrigger>
                    <TabsTrigger value="reserved" className="text-emerald-500 cursor-pointer">
                        <BatteryPlus className="size-4" />
                        Reservadas
                    </TabsTrigger>
                    <TabsTrigger value="concluded" className="text-blue-500 cursor-pointer">
                        <BatteryFull className="size-4" />
                        Concluídas
                    </TabsTrigger>
                    <TabsTrigger value="canceled" className="text-rose-500 cursor-pointer">
                        <BatteryWarning className="size-4" />
                        Canceladas
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'justify-start text-left font-normal',
                            date ? 'text-zinc-950' : 'text-zinc-500'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date
                            ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                            : 'Selecione uma data'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={onDateChange}
                        initialFocus
                        locale={ptBR}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
