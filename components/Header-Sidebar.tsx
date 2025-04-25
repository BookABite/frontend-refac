import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { RefreshCw } from 'lucide-react'
import Image from 'next/image'

interface HeaderProps {
    fetchBookings: () => void
    setIsLoading: (value: boolean) => void
}

export function Header({ fetchBookings, setIsLoading }: HeaderProps) {
    return (
        <header className="flex h-10 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList className="w-full">
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbPage className="uppercase text-zinc-300 dark:text-zinc-600">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/logo.png"
                                        alt="Logo"
                                        width={32}
                                        height={32}
                                        className="h-8 w-8 rounded-full"
                                    />
                                    Bem vindo ao BookaBite
                                </div>
                            </BreadcrumbPage>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator className="hidden md:block" />

                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-zinc-300">
                                <Button
                                    variant="default"
                                    className="group absolute right-4 top-2 flex w-[150px] items-center gap-1 dark:text-zinc-200"
                                    onClick={() => {
                                        setIsLoading(true)
                                        fetchBookings()
                                    }}
                                >
                                    Atualizar Dados
                                    <RefreshCw className="h-6 w-6 group-hover:animate-spin" />
                                </Button>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}
