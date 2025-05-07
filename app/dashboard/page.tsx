'use client'

import DashboardComponent from '@/components/Dashboard'
import { useAuth } from '@/contexts/AuthContext'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading && !isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <DotLottieReact
                    src="/loading.lottie"
                    autoplay
                    loop
                    style={{ width: '340px', height: '340px' }}
                />
                <p className="mt-4 text-lg text-gray-700 animate-pulse uppercase">
                    Carregando Informações...
                </p>
            </div>
        )
    }

    return <DashboardComponent />
}
