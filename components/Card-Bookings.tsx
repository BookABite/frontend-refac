'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import React from 'react'

interface CardBookingsProps {
    totalRevenue: number
    title: string
    icon: React.ReactNode
    className: string
    isLoading?: boolean
}

const CardBookings = ({ totalRevenue, title, icon, className, isLoading }: CardBookingsProps) => {
    return (
        <>
            {isLoading ? (
                <Card className="rounded-lg border-none bg-white/5 shadow-sm backdrop-blur-sm transition-all duration-300 dark:bg-zinc-900/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between text-base font-medium text-zinc-400">
                            <Skeleton className="h-6 w-full" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex w-full items-center justify-between gap-2">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-10 rounded-lg" />
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="group relative overflow-hidden rounded-lg border-none bg-white/80 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-zinc-900/70 dark:hover:bg-zinc-900/80">
                    <div
                        className={`absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10 dark:from-transparent dark:via-white/5 dark:to-transparent dark:group-hover:opacity-20`}
                    />

                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between text-sm font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                            {title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-1">
                        <div className="flex w-full items-center justify-between">
                            <span className="font-sans text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                                {totalRevenue}
                            </span>
                            <div
                                className={`${className} flex h-10 w-10 items-center justify-center rounded-full bg-opacity-10 p-2 transition-transform duration-300 group-hover:scale-110`}
                            >
                                {icon}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}

export default CardBookings
