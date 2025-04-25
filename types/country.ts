import { Country } from './interfaces'

export class CountryService {
    private static BASE_URL = 'https://restcountries.com/v3'

    static async getAllCountries(): Promise<Country[]> {
        try {
            const response = await fetch(`${this.BASE_URL}/all?fields=name,idd,cca2,flag`)

            if (!response.ok) {
                throw new Error('Failed to fetch countries')
            }

            const data = await response.json()

            return data
                .filter((country: any) => country.idd?.root && country.idd.root.trim() !== '')
                .map((country: any) => ({
                    name: country.name.common,
                    code: country.cca2,
                    phoneCode: country.idd.root + (country.idd.suffixes?.[0] || ''),
                    flag: `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`,
                }))
        } catch (error) {
            console.error('Error fetching countries:', error)
            throw error
        }
    }
}
