'use client'

import { UnitInfo } from '@/types/interfaces'
import { useRouter } from 'next/navigation'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

interface GroupData {
    group_id: string
    name: string
    cnpj: string
    email: string
    email_verified: string | null
    country_code: string
    phone: string
    logo: string
    units: UnitInfo[]
}

export interface UserData {
    email: string
    is_superuser: boolean
    role: string
    group_id: string
    unit_ids: string[]
    group?: GroupData
}

interface AuthContextType {
    user: UserData | null
    token: string | null
    isLoading: boolean
    refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const [user, setUser] = useState<UserData | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchGroupData = async (groupId: string) => {
        try {
            const response = await fetch(`/api/group/${groupId}`)
            if (response.ok) {
                return await response.json()
            }
            return null
        } catch (error) {
            console.error('Error fetching group data:', error)
            return null
        }
    }

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/auth/permissions')

            if (response.ok) {
                const userData = await response.json()
                const groupData = await fetchGroupData(userData.group_id)

                setUser({
                    ...userData,
                    group: groupData,
                })
            } else {
                throw new Error('Failed to fetch permissions')
            }
        } catch (error) {
            console.error('Error:', error)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const refreshUserData = async () => {
        setIsLoading(true)
        await fetchUserData()
    }

    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('access_token='))
            ?.split('=')[1]

        setToken(token ?? null)
        if (!token) {
            router.push('/login')
            setIsLoading(false)
        } else {
            fetchUserData()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, token, isLoading, refreshUserData }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
