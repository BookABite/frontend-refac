import { Country } from '@/types/interfaces'
import { useEffect, useState } from 'react'

export function useCountries() {
    const [countries, setCountries] = useState<Country[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchCountries() {
            try {
                const response = await fetch('/api/countries')

                if (!response.ok) {
                    throw new Error('Failed to fetch countries')
                }

                const countries = await response.json()
                setCountries(countries)
            } catch (error) {
                setError('Failed to fetch countries')
            } finally {
                setLoading(false)
            }
        }

        fetchCountries()
    }, [])

    return { countries, loading, error }
}
