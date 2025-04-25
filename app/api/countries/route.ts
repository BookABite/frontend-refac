'use server'

import { CountryService } from '@/types/country'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const countries = await CountryService.getAllCountries()

        return NextResponse.json(countries)
    } catch (error) {
        console.error('Error fetching countries:', error)
        return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 })
    }
}
