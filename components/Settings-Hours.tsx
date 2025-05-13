'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { CalendarClock, CalendarCog, CalendarX2, Save } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { BlockedHourItem } from './Blocked-Hours'
import { AddBlockedHourForm } from './Form-Add-Blocked-Hour'
import { GroupInfo } from './Group-Info'
import { WorkingHoursDay } from './Working-Hours-Day'

type WorkingHour = {
    day_of_week: number
    opening_time: string
    closing_time: string
    is_closed: boolean
}

type BlockedHour = {
    start_datetime: string
    end_datetime: string
    reason: string
    id?: string
}

const weekDays = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' },
]

const SettingsHours = ({ user }: any) => {
    const group_id = user?.group_id || ''
    const [unitId, setUnitId] = useState(user?.group?.units[0]?.unit_id || '')

    const [workingHours, setWorkingHours] = useState<WorkingHour[]>(
        weekDays.map((day) => ({
            day_of_week: day.value,
            opening_time: '2025-04-11T09:00:00.000Z',
            closing_time: '2025-04-11T18:00:00.000Z',
            is_closed: day.value === 1,
        }))
    )

    const [blockedHours, setBlockedHours] = useState<BlockedHour[]>([])
    const [newBlockedHour, setNewBlockedHour] = useState<BlockedHour>({
        start_datetime: '',
        end_datetime: '',
        reason: '',
    })

    const saveWorkingHours = async () => {
        try {
            const response = await fetch(`/api/${group_id}/units/${unitId}/working-hours`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workingHours),
            })

            if (response.ok) {
                toast.success('Horários de funcionamento salvos com sucesso!')
            } else {
                throw new Error('Falha ao salvar os horários de funcionamento')
            }
        } catch (error) {
            toast.warning('Não foi possível salvar os horários de funcionamento.')
        }
    }

    const addBlockedHour = async () => {
        if (
            !newBlockedHour.start_datetime ||
            !newBlockedHour.end_datetime ||
            !newBlockedHour.reason
        ) {
            toast.warning('Preencha todos os campos para adicionar um horário bloqueado.')
            return
        }

        try {
            const response = await fetch(`/api/${group_id}/units/${unitId}/blocked-hours`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBlockedHour),
            })

            if (response.ok) {
                const data = await response.json()
                setBlockedHours([...blockedHours, { ...newBlockedHour, id: data.id }])
                setNewBlockedHour({
                    start_datetime: '',
                    end_datetime: '',
                    reason: '',
                })
                toast.success('Horário bloqueado adicionado com sucesso!')
            } else {
                throw new Error('Falha ao adicionar horário bloqueado')
            }
        } catch (error) {
            toast.error('Não foi possível adicionar o horário bloqueado.')
        }
    }

    const removeBlockedHour = (id: string) => {
        setBlockedHours(blockedHours.filter((hour) => hour.id !== id))
        toast.success('Horário bloqueado removido com sucesso!')
    }

    const updateWorkingHour = (index: number, field: keyof WorkingHour, value: any) => {
        const updatedHours = [...workingHours]
        updatedHours[index] = { ...updatedHours[index], [field]: value }
        setWorkingHours(updatedHours)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 12,
            },
        },
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <motion.div variants={itemVariants}>
                    <h1 className="flex gap-2 items-center text-3xl font-bold tracking-tight">
                        <CalendarCog />
                        Configurações
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Gerencie os horários de funcionamento e bloqueios da sua unidade.
                    </p>
                </motion.div>
            </CardHeader>

            <Separator />

            <motion.div
                className="container  mx-auto space-y-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <CardContent className="space-y-6">
                    <motion.div variants={itemVariants}>
                        <GroupInfo unitId={unitId} onUnitChange={setUnitId} user={user} />
                    </motion.div>
                    <Tabs defaultValue="working-hours" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="working-hours">
                                Horários de Funcionamento
                            </TabsTrigger>
                            <TabsTrigger value="blocked-hours">Horários Bloqueados</TabsTrigger>
                        </TabsList>

                        <TabsContent value="working-hours">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex gap-2 items-center">
                                        <CalendarClock />
                                        Horários de Funcionamento
                                    </CardTitle>
                                    <CardDescription>
                                        Configure os horários de abertura e fechamento de cada dia
                                        da semana.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <motion.div
                                        className="space-y-4"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {workingHours.map((workingHour, index) => {
                                            const dayLabel =
                                                weekDays.find(
                                                    (day) => day.value === workingHour.day_of_week
                                                )?.label || ''
                                            return (
                                                <WorkingHoursDay
                                                    key={workingHour.day_of_week}
                                                    workingHour={workingHour}
                                                    dayLabel={dayLabel}
                                                    onUpdate={(field, value) =>
                                                        updateWorkingHour(index, field, value)
                                                    }
                                                />
                                            )
                                        })}

                                        <div className="flex justify-end mt-6">
                                            <Button
                                                onClick={saveWorkingHours}
                                                className="dark:text-white"
                                            >
                                                <Save className="w-4 h-4" />
                                                Salvar Alterações
                                            </Button>
                                        </div>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="blocked-hours">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex gap-2 items-center text-zinc-950 dark:text-zinc-300">
                                        <CalendarX2 />
                                        Horários Bloqueados
                                    </CardTitle>
                                    <CardDescription>
                                        Adicione períodos específicos em que a unidade estará
                                        fechada ou indisponível.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <motion.div
                                        className="space-y-6"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <AddBlockedHourForm
                                            newBlockedHour={newBlockedHour}
                                            onAdd={addBlockedHour}
                                            onChange={(field, value) =>
                                                setNewBlockedHour({
                                                    ...newBlockedHour,
                                                    [field]: value,
                                                })
                                            }
                                        />

                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-zinc-950 dark:text-zinc-300">
                                                Bloqueios Ativos
                                            </h3>

                                            {blockedHours.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">
                                                    Nenhum horário bloqueado no momento.
                                                </p>
                                            ) : (
                                                <motion.div
                                                    className="space-y-2"
                                                    variants={containerVariants}
                                                >
                                                    {blockedHours.map((blockedHour, index) => (
                                                        <BlockedHourItem
                                                            key={blockedHour.id || index}
                                                            blockedHour={blockedHour}
                                                            onRemove={removeBlockedHour}
                                                        />
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </motion.div>
        </Card>
    )
}

export default SettingsHours
