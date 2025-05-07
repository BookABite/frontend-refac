import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { BadgeCheck, Bell, ChevronsUpDown, LogOut, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface UserData {
    name: string
    email: string
    avatar: string
    role?: string
    isStaff?: boolean
    groupName?: string
    unitName?: string
}

interface NavUserProps {
    custom_user_id: string
}

export function NavUser({ custom_user_id }: NavUserProps) {
    const router = useRouter()
    const { isMobile } = useSidebar()
    const [isLoading, setIsLoading] = useState(false)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [isLoadingUser, setIsLoadingUser] = useState(true)

    // Buscar dados do usuário da API
    useEffect(() => {
        const fetchUserData = async () => {
            if (!custom_user_id) return

            setIsLoadingUser(true)
            try {
                const response = await fetch(`/api/user/${custom_user_id}`)

                if (!response.ok) {
                    throw new Error('Falha ao carregar dados do usuário')
                }

                const data = await response.json()
                setUserData(data)
            } catch (error) {
                console.error('Erro ao carregar usuário:', error)
                toast.error('Não foi possível carregar os dados do usuário')
            } finally {
                setIsLoadingUser(false)
            }
        }

        fetchUserData()
    }, [custom_user_id])

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Logout failed')
            }

            router.refresh()
            router.push('/login')
        } catch (error) {
            console.error('Logout failed:', error)
            toast.error('Ocorreu um erro ao tentar fazer logout')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoadingUser || !userData) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" className="animate-pulse">
                        <div className="h-8 w-8 rounded-lg bg-gray-200" />
                        <div className="grid flex-1 gap-1">
                            <div className="h-4 w-24 rounded bg-gray-200" />
                            <div className="h-3 w-32 rounded bg-gray-200" />
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
    }

    const initials = getInitials(userData.name)

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={userData.avatar} alt={userData.name} />
                                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{userData.name}</span>
                                <span className="truncate text-xs">{userData.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={userData.avatar} alt={userData.name} />
                                    <AvatarFallback className="rounded-lg">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{userData.name}</span>
                                    <span className="truncate text-xs">{userData.email}</span>
                                    {userData.role && (
                                        <span className="truncate text-xs text-muted-foreground">
                                            {userData.role}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck className="mr-2 h-4 w-4" />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell className="mr-2 h-4 w-4" />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => handleLogout()}
                            disabled={isLoading}
                            className="data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 cursor-pointer"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
