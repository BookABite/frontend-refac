export interface Group {
    group_id: string
    name: string
    cnpj: string
    email: string
    email_verified: string | null
    country_code: string
    phone: string
    logo: string
    banner_image: string
    description: string
    facebook_url: string
    instagram_url: string
    whatsapp_url: string
    twitter_url: string
    primary_currency: string
    time_zone: string
    tax_id: string
    subscription_plan: string
    subscription_start_date: string
    subscription_end_date: string
    adresses: Addresses[]
    units: Units[]
}

export interface Client {
    client_id: string
    name: string
    email: string
    phone: string
    birthday: string
    country_code: string
    created_at: string
    updated_at: string
}

export interface Booking {
    id: string
    reservation_hash: string
    first_name: string
    last_name: string
    amount_of_people: number
    amount_of_hours: number
    start_time: string
    end_time: string
    reservation_date: string
    email: string
    country_code: string
    phone: string
    birthday: string
    observation: string
    status: 'confirmed' | 'canceled' | string
}

export interface PaginatedResponse {
    count: number
    next_page: string | null
    previous_page: string | null
    results: Booking[]
}

export interface User {
    email: string
    is_superuser: boolean
    role: string
    group_id: string
    unit_ids: Units[]
    group?: Group[]
}

export interface Country {
    code: string
    name: string
    phoneCode: string
    flag?: string
}

export interface AuthContextData {
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export interface AuthProviderProps {
    children: React.ReactNode
}

export interface Units {
    name: string
    is_main_unit: boolean
    unit_id: string
}

export interface UnitInfo {
    unit_id: string
    cnpj: string
    name: string
    country_code: string
    phone: string
    email: string
    website: string
    description: string
    logo: string
    role: string
    address: Addresses[]
    restaurant: Group
    working_hours: WorkingHours[]
}

export interface Addresses {
    address_id: string
    cep: string
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    country: string
    complement: string
    maps_url: string
}

export interface WorkingHours {
    working_hours_id: string
    day_of_week: number
    opening_time: string
    closing_time: string
    is_closed: boolean
}

export type ClientBookingProps = {
    group_id: string
    unitId: string
    restaurant: UnitInfo
    working_hours: WorkingHours[]
}
