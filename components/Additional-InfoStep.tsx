import { format } from 'date-fns'
import { Telescope } from 'lucide-react'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Separator } from './ui/separator'
import { Textarea } from './ui/textarea'

interface AdditionalInfoStepProps {
    form: any
}

export const AdditionalInfoStep = ({ form }: AdditionalInfoStepProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium">
                <Telescope size={20} className="text-primary" />
                <h2>Informações Adicionais</h2>
            </div>
            <Separator />

            <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-1">Observações</FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                placeholder="Digite suas observações: alergias, restrições alimentares, comemoração especial, etc."
                                className="min-h-32 rounded-lg"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 font-medium">Resumo da Reserva</h3>
                <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Nome:</span>
                        <span>{`${form.watch('first_name')} ${form.watch('last_name')}`}</span>
                    </div>
                    <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Data:</span>
                        <span>
                            {form.watch('date')
                                ? format(new Date(form.watch('date')), 'dd/MM/yyyy')
                                : ''}
                        </span>
                    </div>
                    <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Horário:</span>
                        <span>{form.watch('time')}</span>
                    </div>
                    <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Pessoas:</span>
                        <span>{form.watch('amount_of_people')}</span>
                    </div>
                    <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Duração:</span>
                        <span>{form.watch('amount_of_hours')} hora(s)</span>
                    </div>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                    Ao finalizar sua reserva, você concorda com os termos e condições do
                    restaurante.
                </p>
            </div>
        </div>
    )
}
