import { Cake, EqualApproximately, Mail, Phone, User, Users } from 'lucide-react'
import { Loader } from 'lucide-react'
import Image from 'next/image'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Separator } from './ui/separator'

interface PersonalInfoStepProps {
    form: any
    loading: boolean
    selectedCountry: string
    setSelectedCountry: (value: string) => void
    getCountryFlag: (phoneCode: string) => string
    sortedCountries: any[]
    error: any
}

export const PersonalInfoStep = ({
    form,
    loading,
    selectedCountry,
    setSelectedCountry,
    getCountryFlag,
    sortedCountries,
    error,
}: PersonalInfoStepProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium">
                <Users size={20} className="text-primary" />
                <h2>Dados Pessoais</h2>
            </div>
            <Separator />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1">
                                <User size={16} className="text-primary" />
                                Nome
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Digite o seu nome"
                                    className="rounded-lg"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1">
                                <EqualApproximately size={16} className="text-primary" />
                                Sobrenome
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Digite o seu sobrenome"
                                    className="rounded-lg"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-1">
                            <Mail size={16} className="text-primary" />
                            Email
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="Digite o seu email"
                                className="rounded-lg"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="space-y-2">
                <FormLabel className="flex items-center gap-1">
                    <Phone size={16} className="text-primary" />
                    Telefone
                </FormLabel>
                <div className="flex gap-2">
                    <FormField
                        control={form.control}
                        name="country_code"
                        render={({ field }) => (
                            <FormItem className="w-[130px]">
                                <Select
                                    disabled={loading}
                                    onValueChange={(value) => {
                                        field.onChange(value)
                                        setSelectedCountry(value)
                                    }}
                                    defaultValue="+55"
                                >
                                    <FormControl>
                                        <SelectTrigger className="rounded-lg">
                                            {loading ? (
                                                <Loader size={16} className="animate-spin" />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src={getCountryFlag(
                                                            selectedCountry || '+55'
                                                        )}
                                                        alt={`Flag of ${
                                                            sortedCountries.find(
                                                                (c) =>
                                                                    c.phoneCode === selectedCountry
                                                            )?.name || 'Unknown'
                                                        }`}
                                                        width={30}
                                                        height={30}
                                                        className="rounded-sm"
                                                    />
                                                    <span>{selectedCountry || '+55'}</span>
                                                </div>
                                            )}
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-[200px]">
                                        {sortedCountries.map((country, index) => (
                                            <SelectItem
                                                key={country.code}
                                                value={country.phoneCode}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src={country.flag || '/default-flag.png'}
                                                        alt={`Flag of ${country.name}`}
                                                        width={30}
                                                        height={30}
                                                        className="rounded-sm"
                                                    />
                                                    <span>{country.phoneCode}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Digite o seu telefone"
                                        className="rounded-lg"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {error && (
                    <p className="text-sm text-destructive">Erro ao carregar códigos dos países</p>
                )}
            </div>

            <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-1">
                            <Cake size={16} className="text-primary" />
                            Data de Aniversário
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="date"
                                {...field}
                                placeholder="Digite a data de aniversário"
                                className="rounded-lg"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
