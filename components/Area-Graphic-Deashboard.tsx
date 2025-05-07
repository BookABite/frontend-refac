import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/utils'
import { BarChartIcon, Calendar } from 'lucide-react'
import { useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

import CustomTooltip from './Custom-Tooltip'

const chartConfig = {
    completedRevenue: {
        label: 'TOTAL',
        color: '#dc2626',
    },
    canceledRevenue: {
        label: 'CANCELADO',
        color: '#10b981',
    },
} satisfies ChartConfig

const chartData = [
    {
        name: 'Jan',
        completedRevenue: 18000,
        canceledRevenue: 2000,
    },
    {
        name: 'Feb',
        completedRevenue: 23500,
        canceledRevenue: 1500,
    },
    {
        name: 'Mar',
        completedRevenue: 19000,
        canceledRevenue: 3000,
    },
    {
        name: 'Abr',
        completedRevenue: 25500,
        canceledRevenue: 2500,
    },
    {
        name: 'Mai',
        completedRevenue: 29500,
        canceledRevenue: 500,
    },
    {
        name: 'Jun',
        completedRevenue: 23500,
        canceledRevenue: 3500,
    },
    {
        name: 'Jul',
        completedRevenue: 28500,
        canceledRevenue: 2500,
    },
    {
        name: 'Ago',
        completedRevenue: 31500,
        canceledRevenue: 1500,
    },
    {
        name: 'Set',
        completedRevenue: 25500,
        canceledRevenue: 2500,
    },
    {
        name: 'Out',
        completedRevenue: 18000,
        canceledRevenue: 2000,
    },
    {
        name: 'Nov',
        completedRevenue: 25500,
        canceledRevenue: 2500,
    },
    {
        name: 'Dez',
        completedRevenue: 31500,
        canceledRevenue: 1500,
    },
]

interface AreaDashboardProps {
    isLoading?: boolean
}

const AreaDashboard = ({ isLoading }: AreaDashboardProps) => {
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

    const filteredData =
        selectedMonth === null ? chartData : chartData.filter((data) => data.name === selectedMonth)

    return (
        <div className="h-full w-full">
            {isLoading ? (
                <Card className="h-full w-full rounded-lg border-none bg-white/90 shadow-sm dark:bg-zinc-900/90">
                    <CardHeader className="space-y-2 pb-4">
                        <CardTitle>
                            <Skeleton className="h-8 w-64 rounded-md" />
                        </CardTitle>
                        <CardDescription className="flex items-center justify-between">
                            <Skeleton className="h-4 w-80 rounded-md" />
                            <div className="flex gap-2 overflow-hidden">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="h-8 w-16 shrink-0 rounded-md" />
                                ))}
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center px-2 pb-6">
                        <Skeleton className="h-[150px] w-full rounded-lg" />
                    </CardContent>
                </Card>
            ) : (
                <Card className="h-full w-full rounded-lg border-none gap-2 bg-white/90 p-1 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-zinc-900/90">
                    <CardHeader className="px-5 pb-2 pt-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-lg font-medium text-zinc-800 dark:text-zinc-200">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50">
                                        <BarChartIcon className="h-5 w-5 text-primary" />
                                    </span>
                                    Análise de Reservas
                                </CardTitle>
                                <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Comparativo mensal entre reservas concluídas e canceladas
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <Button
                                    onClick={() => setSelectedMonth(null)}
                                    className={cn(
                                        'h-7 rounded-md border-zinc-200 px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800',
                                        selectedMonth === null &&
                                            'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/30'
                                    )}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Calendar className="mr-1 h-3 w-3" />
                                    Todos
                                </Button>

                                <div className="no-scrollbar flex items-center overflow-x-auto">
                                    {chartData.map((data) => (
                                        <Button
                                            key={data.name}
                                            onClick={() => setSelectedMonth(data.name)}
                                            className={cn(
                                                'ml-1 h-7 min-w-[42px] rounded-md border-zinc-200 px-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800',
                                                selectedMonth === data.name &&
                                                    'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/30'
                                            )}
                                            variant="outline"
                                            size="sm"
                                        >
                                            {data.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-2 py-0">
                        <div className="mt-2 rounded-lg px-1">
                            <ChartContainer config={chartConfig} className="h-[270px] w-full">
                                <BarChart
                                    data={filteredData}
                                    margin={{ top: 20, right: 20, left: 10, bottom: 16 }}
                                    barGap={4}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        horizontal={true}
                                        vertical={false}
                                        stroke="currentColor"
                                        className="stroke-zinc-200 dark:stroke-zinc-800"
                                    />

                                    <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: 'currentColor' }}
                                        tickMargin={12}
                                        minTickGap={20}
                                        className="text-xs text-zinc-500 dark:text-zinc-400"
                                    />

                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: 'rgba(0, 0, 0, 0.04)', radius: 4 }}
                                    />

                                    <Bar
                                        dataKey="canceledRevenue"
                                        fill="rgba(244, 63, 94, 0.85)"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={30}
                                        className="opacity-80 hover:opacity-100"
                                    />

                                    <Bar
                                        dataKey="completedRevenue"
                                        fill="rgba(16, 185, 129, 0.85)"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={30}
                                        className="opacity-80 hover:opacity-100"
                                    />

                                    <ChartLegend
                                        content={<ChartLegendContent />}
                                        verticalAlign="bottom"
                                        height={36}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            <style jsx global>{`
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    )
}

export default AreaDashboard
