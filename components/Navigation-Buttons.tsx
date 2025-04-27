import { ArrowLeft, ArrowRight, CookingPot, Loader } from 'lucide-react'

import { Button } from './ui/button'

interface NavigationButtonsProps {
    currentStep: number
    totalSteps: number
    isLoading: boolean
    onPrevious: () => void
    onNext: () => void
}

export const NavigationButtons = ({
    currentStep,
    totalSteps,
    isLoading,
    onPrevious,
    onNext,
}: NavigationButtonsProps) => {
    return (
        <div className="flex flex-col gap-2 justify-between items-center w-full">
            {currentStep > 1 ? (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onPrevious}
                    className="w-full rounded-lg dark:text-white"
                >
                    <ArrowLeft />
                    Voltar
                </Button>
            ) : (
                <div className="w-full"></div>
            )}

            {currentStep < totalSteps && (
                <Button
                    type="button"
                    onClick={onNext}
                    className="w-full rounded-lg dark:text-white"
                >
                    <ArrowRight />
                    Próximo
                </Button>
            )}
        </div>
    )
}
