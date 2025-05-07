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
    custom_user_id: string
    unit_ids: string[]
    group?: GroupData
}

interface AuthContextType {
    user: UserData | null
    token: string | null
    isLoading: boolean
    isAuthenticated: boolean
    refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const [user, setUser] = useState<UserData | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
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
            setIsLoading(true)
            const response = await fetch('/api/auth/permissions')

            if (response.ok) {
                const userData = await response.json()

                const groupData = userData.group_id ? await fetchGroupData(userData.group_id) : null

                setUser({
                    ...userData,
                    group: groupData,
                })
                setIsAuthenticated(true)
            } else {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch permissions')
            }
        } catch (error) {
            console.error('Auth error:', error)
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            setUser(null)
            setIsAuthenticated(false)
            router.push('/login')
        } finally {
            setIsLoading(false)
        }
    }

    const refreshUserData = async () => {
        setIsLoading(true)
        await fetchUserData()
    }

    useEffect(() => {
        const getTokenFromCookie = () => {
            return (
                document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('access_token='))
                    ?.split('=')[1] || null
            )
        }

        const checkAuth = async () => {
            const token = getTokenFromCookie()
            setToken(token)

            if (token) {
                await fetchUserData()
            } else {
                setIsAuthenticated(false)
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated, refreshUserData }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
