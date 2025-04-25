const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null
    const completed = payload[0].payload.completedRevenue || 0
    const canceled = payload[0].payload.canceledRevenue || 0
    const total = payload[0].payload.totalRevenue || 0

    return (
        <div className="space-y-1 rounded-lg bg-background p-2 px-3">
            <p className="text-xl font-medium text-zinc-400">Mês: {payload[0].payload.name}</p>
            <div className="flex items-center justify-between gap-x-4">
                <div className="flex items-center justify-center gap-x-2">
                    <div className="size-2 rounded-full bg-red-500">
                        <div className="size-2 animate-ping rounded-full bg-red-500"></div>
                    </div>
                    <p className="text-sm uppercase text-white">Finalizados</p>
                </div>
                <p className="text-left text-sm font-medium text-zinc-400">
                    {Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    }).format(Number(completed))}
                </p>
            </div>
            <div className="flex items-center justify-between gap-x-4">
                <div className="flex items-center justify-center gap-x-2">
                    <div className="size-2 rounded-full bg-green-500">
                        <div className="size-2 animate-ping rounded-full bg-green-500"></div>
                    </div>
                    <p className="text-sm uppercase text-white">Confirmados</p>
                </div>
                <p className="text-left text-sm font-medium text-zinc-400">
                    {Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    }).format(Number(total))}
                </p>
            </div>
            <div className="flex items-center justify-between gap-x-4">
                <div className="flex items-center justify-center gap-x-2">
                    <div className="size-2 rounded-full bg-blue-500">
                        <div className="size-2 animate-ping rounded-full bg-blue-500"></div>
                    </div>
                    <p className="text-sm uppercase text-white">Cancelados</p>
                </div>
                <p className="text-left text-sm font-medium text-zinc-400">
                    {Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    }).format(Number(canceled))}
                </p>
            </div>
        </div>
    )
}

export default CustomTooltip
