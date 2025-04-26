import { BotMessageSquare, Building2, CalendarClock, Cog, PieChart, UserSquare } from 'lucide-react'

const data = {
    navMain: [
        {
            title: 'Dashboard',
            value: 'dashboard',
            icon: PieChart,
            isActive: true,
            items: [
                {
                    title: 'Visão Geral',
                    value: 'dashboard/overview',
                },
            ],
        },
        {
            title: 'Reservas',
            value: 'bookings',
            icon: CalendarClock,
            items: [
                {
                    title: 'Mesas Reservadas',
                    value: '/bookings/seating',
                },
            ],
        },
        {
            title: 'Clientes',
            value: 'clients',
            icon: UserSquare,
            items: [
                {
                    title: 'Lista de Clientes',
                    value: '/clients/list',
                },
            ],
        },
        {
            title: 'Chat',
            value: 'chat',
            icon: BotMessageSquare,
            items: [
                {
                    title: 'Iniciar Chat',
                    value: '/chat/new',
                },
            ],
        },
        {
            title: 'Configuração',
            value: 'settings',
            icon: Cog,
            items: [
                {
                    title: 'Perfil Grupo',
                    value: '/settings/group',
                },
                {
                    title: 'Perfil Unidade',
                    value: '/settings/unit',
                },
                {
                    title: 'Controle de Horários',
                    value: '/settings/hours',
                },
            ],
        },
    ],
    user: {
        name: 'Usuário',
        email: 'usuario@example.com',
        avatar: '/avatars/default.jpg',
    },
}

export default data
