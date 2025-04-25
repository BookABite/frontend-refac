'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import {
    DropdownMenu,
    DropdownMenuContent,
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
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

interface TeamSwitcherProps {
    selectedUnit: string
    setSelectedUnit: React.Dispatch<React.SetStateAction<string>>
}

export function TeamSwitcher({ selectedUnit, setSelectedUnit }: TeamSwitcherProps) {
    const { isMobile } = useSidebar()
    const { user, isLoading } = useAuth()

    React.useEffect(() => {
        if (user?.unit_ids?.length && !selectedUnit) {
            setSelectedUnit(user.unit_ids[0])
        }
    }, [user, selectedUnit])

    if (isLoading || !user) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <div className="grid flex-1 gap-1 text-left">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    const activeUnit =
        user.group?.units?.find((unit: any) => unit.unit_id === selectedUnit) ||
        user.group?.units?.[0]

    if (!activeUnit) {
        return null
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <span className="text-xl font-bold">
                                    {activeUnit.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{activeUnit.name}</span>
                                <span className="truncate text-xs">Unidade</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            <span className="flex flex-col">
                                <p className="text-sm font-medium">Grupo:</p>
                                <p className="text-xs font-normal text-black">{user.group?.name}</p>
                            </span>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            Unidades
                        </DropdownMenuLabel>
                        {user.group?.units?.map((unit: any) => (
                            <DropdownMenuItem
                                key={unit.unit_id}
                                onClick={() => setSelectedUnit(unit.unit_id)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border cursor-pointer">
                                    <span className="text-xs font-medium">
                                        {unit.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                {unit.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
