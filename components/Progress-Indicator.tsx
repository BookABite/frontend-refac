import { Calendar, MessageSquare, Users } from 'lucide-react'

interface ProgressIndicatorProps {
    currentStep: number
    totalSteps: number
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
    return (
        <div className="mb-8">
            <div className="flex justify-between">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                                step === currentStep
                                    ? 'bg-primary text-primary-foreground'
                                    : step < currentStep
                                      ? 'bg-primary/20 text-primary'
                                      : 'bg-muted text-muted-foreground'
                            }`}
                        >
                            {step === 1 && <Users size={18} />}
                            {step === 2 && <Calendar size={18} />}
                            {step === 3 && <MessageSquare size={18} />}
                        </div>
                        <span
                            className={`mt-2 text-xs ${
                                step === currentStep
                                    ? 'font-medium text-primary'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            {step === 1 && 'Dados Pessoais'}
                            {step === 2 && 'Detalhes da Reserva'}
                            {step === 3 && 'Informações Adicionais'}
                        </span>
                    </div>
                ))}
            </div>
            <div className="relative mt-2">
                <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted"></div>
                <div
                    className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary transition-all"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>
            </div>
        </div>
    )
}
