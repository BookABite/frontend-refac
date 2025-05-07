'use client'

import { NavMain } from '@/components/Nav-Main'
import { NavUser } from '@/components/Nav-User'
import { TeamSwitcher } from '@/components/Unit-Switcher'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar'
import data from '@/types/dashboard-data'
import * as React from 'react'

export function AppSidebar({
    selectedUnit,
    setSelectedUnit,
    setActiveSction,
    custom_user_id,
    unitId,
    onUnitChange,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    selectedUnit: string
    setSelectedUnit: React.Dispatch<React.SetStateAction<string>>
    setActiveSction: React.Dispatch<React.SetStateAction<string>>
    custom_user_id: string
    unitId: string
    onUnitChange: (value: string) => void
}) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher selectedUnit={selectedUnit} setSelectedUnit={setSelectedUnit} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} setActiveSction={setActiveSction} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    custom_user_id={custom_user_id}
                    unitId={unitId}
                    onUnitChange={onUnitChange}
                />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
