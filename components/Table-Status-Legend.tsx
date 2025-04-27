import React from 'react'

export default function TableStatusLegend() {
    return (
        <div className="flex items-end justify-center gap-4">
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-emerald-100 border border-emerald-300" />
                <span className="text-sm font-light dark:text-zinc-300">Confirmado</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-blue-100 border border-blue-300" />
                <span className="text-sm font-light dark:text-zinc-300">Finalizado</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-rose-100 border border-rose-300" />
                <span className="text-sm font-light dark:text-zinc-300">Cancelado</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-100 border border-gray-300" />
                <span className="text-sm font-light dark:text-zinc-300">Livre</span>
            </div>
        </div>
    )
}
