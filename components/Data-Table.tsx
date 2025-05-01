'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Booking } from '@/types/interfaces'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    ArrowUpDown,
    ChevronDown,
    ChevronsLeft,
    ChevronsRight,
    ContactRound,
    Filter,
    Salad,
    Search,
    Users,
} from 'lucide-react'
import * as React from 'react'

export const columns: ColumnDef<Booking>[] = [
    {
        id: 'select',
        header: ({ table }: any) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Selecione todas as linhas"
            />
        ),
        cell: ({ row }: any) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: any) => row.toggleSelected(!!value)}
                aria-label="Selecione esta linha"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'first_name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Nome
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue('first_name')}</div>,
    },
    {
        accessorKey: 'last_name',
        header: 'Sobrenome',
        cell: ({ row }) => <div>{row.getValue('last_name')}</div>,
    },
    {
        accessorKey: 'amount_of_people',
        header: 'Pessoas',
        cell: ({ row }) => <div className="text-start">{row.getValue('amount_of_people')}</div>,
    },
    {
        accessorKey: 'start_time',
        header: 'Horário',
        cell: ({ row }) => {
            const startTime = row.getValue('start_time') as string
            const [hours, minutes] = startTime.split(':')
            return <div className="text-start">{`${hours}:${minutes}`}</div>
        },
    },
    {
        accessorKey: 'reservation_date',
        header: 'Data',
        cell: ({ row }) => {
            const date = new Date(row.getValue('reservation_date'))
            return <div className="text-start">{date.toLocaleDateString('pt-BR')}</div>
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status')
            return <div className="text-start capitalize">{status as string}</div>
        },
    },
]

export interface DataTableProps {
    bookings: Booking[]
    isLoading?: boolean
    sizeClients: number
}

export function DataTable({ bookings, isLoading, sizeClients }: DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: bookings,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageSize: sizeClients,
            },
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="flex w-full h-full flex-col rounded-lg border-none bg-white/90 p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-zinc-900/90">
            <div className="flex flex-col items-start justify-center mb-4">
                <p className="flex gap-2 text-xl items-center font-bold uppercase">
                    <ContactRound size={20} />
                    Clientes
                </p>
                <p className="text-sm font-light text-zinc-300">
                    Visualização dos clientes cadastrados
                </p>
            </div>
            {isLoading ? (
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-9 w-64 rounded-md" />
                        <Skeleton className="h-9 w-32 rounded-md" />
                    </div>

                    <div className="mt-4 flex-1 space-y-3">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <div className="grid w-full gap-3">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Skeleton key={index} className="h-12 w-full rounded-md" />
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <Skeleton className="h-5 w-64 rounded-md" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-24 rounded-md" />
                            <Skeleton className="h-8 w-24 rounded-md" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between gap-2">
                        <div className="relative w-full max-w-xs">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Filtrar clientes..."
                                value={
                                    (table.getColumn('first_name')?.getFilterValue() as string) ??
                                    ''
                                }
                                onChange={(event) =>
                                    table
                                        .getColumn('first_name')
                                        ?.setFilterValue(event.target.value)
                                }
                                className="w-full rounded-lg border-zinc-200 bg-zinc-50 pl-9 text-sm ring-offset-white placeholder:text-zinc-400 focus-visible:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/50 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-800"
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-auto flex items-center gap-1 whitespace-nowrap rounded-lg border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                >
                                    <Filter className="h-3.5 w-3.5" />
                                    Colunas <ChevronDown className="h-3.5 w-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="rounded-lg border-zinc-200 dark:border-zinc-800"
                            >
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="mt-3 flex-1 overflow-auto rounded-lg border border-zinc-100 dark:border-zinc-800">
                        <Table>
                            <TableHeader className="bg-zinc-50 dark:bg-zinc-800/50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow
                                        key={headerGroup.id}
                                        className="border-zinc-100 hover:bg-transparent dark:border-zinc-800"
                                    >
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="h-10 px-4 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && 'selected'}
                                            className="border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell
                                                    key={cell.id}
                                                    className="px-4 py-3 text-sm"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center text-zinc-500 dark:text-zinc-400"
                                        >
                                            Sem resultados
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-3 flex items-center justify-between py-2">
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {table.getFilteredSelectedRowModel().rows.length} de{' '}
                            {table.getFilteredRowModel().rows.length} linha(s) selecionada
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="h-8 rounded-lg border-zinc-200 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                <ChevronsLeft className="mr-1 h-3.5 w-3.5" />
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="h-8 rounded-lg border-zinc-200 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Próximo
                                <ChevronsRight className="ml-1 h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
