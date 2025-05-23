'use client'

import { AppSidebar } from '@/components/App-Sidebar'
import { bookingColumns } from '@/components/ColumnDef-Booking-Client'
import { DashboardContent } from '@/components/Dashboard-Content'
import { DataTable } from '@/components/Data-Table'
import { GroupUpdate } from '@/components/Group-Update'
import { Header } from '@/components/Header-Sidebar'
import SettingsHours from '@/components/Settings-Hours'
import SeatingLayout from '@/components/Table-Bookings'
import { UnitUpdateForm } from '@/components/Unit-Update'
import WhatsAppIntegration from '@/components/Whatsapp-Integration'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { useFetchBookings } from '@/hooks/use-bookings'
import data from '@/types/dashboard-data'
import { Booking, Group } from '@/types/interfaces'
import { CalendarCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Dashboard() {
    const { user, isLoading, refreshUserData } = useAuth()
    const [group, setGroup] = useState<Group[]>([])
    const [selectedUnit, setSelectedUnit] = useState<string>(user?.unit_ids?.[2] || '')
    const [activeSection, setActiveSection] = useState('dashboard/overview')
    const { bookings, setIsLoading, refetch } = useFetchBookings(selectedUnit)

    const handleRefresh = async () => {
        try {
            setIsLoading(true)
            await refreshUserData()
            await refetch()
        } catch (error) {
            toast.error('Erro ao atualizar os dados')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        handleRefresh()
    }, [])

    useEffect(() => {
        if (!user?.group_id) return

        const fetchGroup = async () => {
            const response = await fetch(`/api/group/${user?.group_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await response.json()
            setGroup(data)
        }
        fetchGroup()
    }, [user?.group_id])

    const renderContent = () => {
        const menuItem = data.navMain.find((item) =>
            item.items.some((subItem) => subItem.value === activeSection)
        )

        if (!menuItem) {
            return <div className="p-4">Bem vindo ao BookaBite!</div>
        }

        const activeSubItem = menuItem.items.find((item) => item.value === activeSection)

        switch (activeSubItem?.value) {
            case 'dashboard/overview':
                return <DashboardContent bookings={bookings} isLoading={isLoading} group={group} />
            case '/bookings/seating':
                return (
                    <div className="flex h-full gap-4">
                        <SeatingLayout bookings={bookings} isLoading={isLoading} />
                    </div>
                )
            case '/bookings/calendar':
                return (
                    <div className="flex h-full gap-4">
                        {/* <SeatingLayout bookings={bookings} isLoading={isLoading} /> */}
                    </div>
                )
            case '/bookings/history':
                return (
                    <div className="flex h-full gap-4">
                        {/* <SeatingLayout bookings={bookings} isLoading={isLoading} /> */}
                    </div>
                )
            case '/clients/list':
                return (
                    <div className="flex w-full h-full gap-4">
                        <DataTable<Booking>
                            data={bookings}
                            columns={bookingColumns}
                            isLoading={isLoading}
                            pageSize={10}
                            filterField="first_name"
                            filterPlaceholder="Filtrar pelo nome"
                        />
                    </div>
                )
            case '/clients/add':
                return (
                    <div className="flex h-full gap-4">
                        {/* <DataTableUsers bookings={bookings} isLoading={isLoading} /> */}
                    </div>
                )
            case '/chat/new':
                return (
                    <div className="flex h-full w-full gap-4">{/* <WhatsAppIntegration /> */}</div>
                )
            case '/settings/group':
                return (
                    <div className="h-full w-full flex-1 gap-4">
                        <GroupUpdate groupId={user?.group_id || ''} />
                    </div>
                )
            case '/settings/unit':
                return (
                    <div className="h-full w-full flex-1 gap-4">
                        <UnitUpdateForm unitId={selectedUnit} />
                    </div>
                )
            case '/settings/preferences':
                return <div className="flex h-full gap-4">{/* <Settings /> */}</div>
            case '/settings/hours':
                return (
                    <div className="flex h-full gap-4">
                        <SettingsHours user={user} />
                    </div>
                )
            default:
                return <div className="p-4">Bem vindo ao BookaBite!</div>
        }
    }
    return (
        <SidebarProvider>
            <AppSidebar
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                setActiveSction={setActiveSection}
                custom_user_id={user?.custom_user_id || ''}
                unitId={selectedUnit}
                onUnitChange={handleRefresh}
            />
            <SidebarInset>
                <header className="flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <Header fetchBookings={handleRefresh} setIsLoading={setIsLoading} />
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
            </SidebarInset>
        </SidebarProvider>
    )
}
