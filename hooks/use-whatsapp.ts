import { useAuth } from '@/contexts/AuthContext'
import Ably from 'ably'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface WhatsAppSession {
    userId: string
    status: 'disconnected' | 'connecting' | 'connected'
    lastConnection?: Date
    qr?: string
}

export interface WhatsAppMessage {
    userId: string
    from: string
    message: string
    messageType: string
    timestamp: Date
    mediaUrl?: string
}

export const useWhatsApp = () => {
    const { user, token } = useAuth()
    const [session, setSession] = useState<WhatsAppSession | null>(null)
    const [ably, setAbly] = useState<Ably.Realtime | null>(null)
    const [channel, setChannel] = useState<Ably.RealtimeChannel | null>(null)
    const [messages, setMessages] = useState<WhatsAppMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchWithAuthRef = useRef(async (url: string, options: RequestInit = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...options.headers,
        }
        return fetch(url, { ...options, headers })
    })

    useEffect(() => {
        fetchWithAuthRef.current = async (url: string, options: RequestInit = {}) => {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                ...options.headers,
            }
            return fetch(url, { ...options, headers })
        }
    }, [token])

    const getSessionStatus = useCallback(async () => {
        try {
            console.log('Fetching session status...')
            const response = await fetchWithAuthRef.current('/api/whatsapp/get-session-status')
            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                const errorMessage = errorData?.error || response.statusText || 'Unknown error'
                console.error('Failed to get session status:', errorMessage, errorData)
                setError(`Failed to get session status: ${errorMessage}`)
                return
            }
            const data = await response.json()
            if (data.status) {
                setSession(data.status)
            }
            console.log('Session status data:', data)
        } catch (err) {
            console.error('Failed to get session status:', err)
        }
    }, [])

    const setupAblyEventListeners = useCallback(
        (channelInstance: Ably.RealtimeChannel, userId: string) => {
            console.log('Setting up Ably event listeners...')
            channelInstance.subscribe('qr', (message: any) => {
                console.log('QR code received:', message.data.qr)
                setSession((prev) => ({
                    ...(prev || { userId, status: 'connecting' }),
                    qr: message.data.qr,
                }))
            })

            console.log('Event qr registered')
            channelInstance.subscribe('ready', () => {
                console.log('Session is ready')
                setSession((prev) => ({
                    ...(prev || { userId, status: 'connected' }),
                    status: 'connected',
                    qr: undefined,
                }))
                getSessionStatus()
            })
            console.log('Event ready registered')
            channelInstance.subscribe('message', (message: any) => {
                setMessages((prev) => [...prev, message.data])
            })
            console.log('Event message registered')
            channelInstance.subscribe('sessionUpdate', (message: any) => {
                console.log('Session update received:', message.data)
                setSession(message.data)
            })
            console.log('Event sessionUpdate registered')
            channelInstance.subscribe('logout', () => {
                setSession((prev) => ({
                    ...(prev || { userId, status: 'disconnected' }),
                    status: 'disconnected',
                    qr: undefined,
                }))
            })

            channelInstance.subscribe('connectionFailed', (message: any) => {
                setError(`Connection failed: ${message.data.error}`)
                setSession((prev) => ({
                    ...(prev || { userId, status: 'disconnected' }),
                    status: 'disconnected',
                }))
            })

            channelInstance.subscribe('qrTimeout', () => {
                setError('QR code expired. Please try again.')
                setSession((prev) => ({
                    ...(prev || { userId, status: 'disconnected' }),
                    status: 'disconnected',
                    qr: undefined,
                }))
            })
            console.log('All Ably event listeners setup')
        },
        [getSessionStatus]
    )

    const initializeAbly = useCallback(async () => {
        try {
            console.log('Initializing Ably connection...')
            setIsLoading(true)
            const response = await fetchWithAuthRef.current(`api/ably?userId=${user?.group_id}`)
            const tokenDetails = await response.json()
            console.log('Ably token details:', tokenDetails)
            const ablyInstance = new Ably.Realtime({ tokenDetails })
            setAbly(ablyInstance)
            const clientId = tokenDetails.clientId
            const channelName = `whatsapp:${clientId}`
            const channelInstance = ablyInstance.channels.get(channelName)
            setChannel(channelInstance)
            console.log('Ably connection and channel setup successful.')
            setupAblyEventListeners(channelInstance, clientId)
            console.log('initializeAbly function completed.')
            setIsLoading(false)
        } catch (err) {
            if (err instanceof Error) {
                console.error('Error during Ably initialization:', err.message)
            } else {
                console.error('An unknown error occurred during Ably initialization:', err)
            }
            setError('Failed to initialize Ably connection')
            setIsLoading(false)
            console.error('Ably initialization error:', err)
        }
    }, [user?.group_id, setupAblyEventListeners])

    const startSession = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await fetchWithAuthRef.current('/api/whatsapp/start-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user?.group_id }),
            })

            const data = await response.json()

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                const errorMessage = errorData?.error || response.statusText || 'Unknown error'
                console.error('Failed to start WhatsApp session:', errorMessage, errorData)
                setError(`Failed to start WhatsApp session: ${errorMessage}`)
                setIsLoading(false)
                return
            }

            if (data.qr) {
                setSession({
                    userId: user?.group_id || 'current_user',
                    status: 'connecting',
                    qr: data.qr,
                })
            } else if (data.status === 'connected') {
                setSession({
                    userId: user?.group_id || 'current_user',
                    status: 'connected',
                    qr: undefined,
                })
            }

            setIsLoading(false)
            return data
        } catch (err) {
            setError('Failed to start WhatsApp session')
            setIsLoading(false)
            console.error('Start session error:', err)
            throw err
        }
    }, [user?.group_id])

    const sendMessage = async (to: string, message: string) => {
        try {
            setIsLoading(true)
            setError(null)
            await fetchWithAuthRef.current('/api/whatsapp/send-message', {
                method: 'POST',
                body: JSON.stringify({ to, message }),
            })
            setIsLoading(false)
        } catch (err) {
            setError('Failed to send message')
            setIsLoading(false)
            console.error('Send message error:', err)
        }
    }

    const sendMedia = async (
        to: string,
        file: File,
        mediaType: 'image' | 'video' | 'audio' | 'document',
        caption?: string
    ) => {
        try {
            setIsLoading(true)
            setError(null)
            const formData = new FormData()
            formData.append('media', file)
            formData.append('to', to)
            formData.append('mediaType', mediaType)
            if (caption) {
                formData.append('caption', caption)
            }
            await fetchWithAuthRef.current('/api/send-media', {
                method: 'POST',
                body: formData,
            })
            setIsLoading(false)
        } catch (err) {
            setError('Failed to send media')
            setIsLoading(false)
            console.error('Send media error:', err)
        }
    }

    const logout = async () => {
        try {
            setIsLoading(true)
            await fetchWithAuthRef.current('/api/logout', {
                method: 'POST',
            })
            setSession(null)
            setMessages([])
            setIsLoading(false)
        } catch (err) {
            setError('Failed to logout')
            setIsLoading(false)
            console.error('Logout error:', err)
        }
    }

    useEffect(() => {
        if (user?.group_id) {
            initializeAbly()
            getSessionStatus()
        }
        return () => {
            if (channel) {
                channel.unsubscribe()
            }
            if (ably) {
                ably.close()
            }
        }
    }, [initializeAbly, user?.group_id])

    return {
        session,
        messages,
        isLoading,
        error,
        startSession,
        sendMessage,
        sendMedia,
        logout,
    }
}

export default useWhatsApp
