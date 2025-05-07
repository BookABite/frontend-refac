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
    Search,
} from 'lucide-react'
import * as React from 'react'

// Colunas predefinidas que podem ser reutilizadas
export const createSelectColumn = <T,>(): ColumnDef<T> => ({
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
})

export const createNameColumn = <T,>(): ColumnDef<T> => ({
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
})

export const createLastNameColumn = <T,>(): ColumnDef<T> => ({
    accessorKey: 'last_name',
    header: 'Sobrenome',
    cell: ({ row }) => <div>{row.getValue('last_name')}</div>,
})

export const createPhoneColumn = <T,>(): ColumnDef<T> => ({
    accessorKey: 'phone',
    header: 'Telefone',
    cell: ({ row }) => {
        const phone = row.getValue('phone') as string
        const formattedPhone = phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        return (
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    className="rounded-lg p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => {
                        window.open(`https://api.whatsapp.com/send?phone=${phone}`, '_blank')
                    }}
                    aria-label="Enviar mensagem no WhatsApp"
                >
                    <svg
                        fill="#2bc700"
                        className="h-3 w-3"
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 308 308"
                        stroke="#2bc700"
                    >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            {' '}
                            <g id="XMLID_468_">
                                <path
                                    id="XMLID_469_"
                                    d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156 c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687 c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887 c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153 c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348 c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802 c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922 c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0 c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458 C233.168,179.508,230.845,178.393,227.904,176.981z"
                                ></path>{' '}
                                <path
                                    id="XMLID_470_"
                                    d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716 c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396 c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188 l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677 c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867 C276.546,215.678,222.799,268.994,156.734,268.994z"
                                ></path>{' '}
                            </g>{' '}
                        </g>
                    </svg>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {formattedPhone}
                    </span>
                </Button>
            </div>
        )
    },
})

export const createPeopleColumn = <T,>(): ColumnDef<T> => ({
    accessorKey: 'amount_of_people',
    header: 'Pessoas',
    cell: ({ row }) => <div className="text-start">{row.getValue('amount_of_people')}</div>,
})

export const createTimeColumn = <T,>(): ColumnDef<T> => ({
    accessorKey: 'start_time',
    header: 'Horário',
    cell: ({ row }) => {
        const startTime = row.getValue('start_time') as string
        const [hours, minutes] = startTime.split(':')
        return <div className="text-start">{`${hours}:${minutes}`}</div>
    },
})

export const createDateColumn = <T,>(): ColumnDef<T> => ({
    accessorKey: 'reservation_date',
    header: 'Data',
    cell: ({ row }) => {
        const date = new Date(row.getValue('reservation_date'))
        return <div className="text-start">{date.toLocaleDateString('pt-BR')}</div>
    },
})

export const createStatusColumn = <T,>(): ColumnDef<T> => ({
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const status = row.getValue('status')
        return <div className="text-start capitalize">{status as string}</div>
    },
})

// Tipo para o mapeamento de colunas disponíveis
export type AvailableColumns =
    | 'select'
    | 'first_name'
    | 'last_name'
    | 'phone'
    | 'amount_of_people'
    | 'start_time'
    | 'reservation_date'
    | 'status'

// Função auxiliar para obter as colunas selecionadas
export function getSelectedColumns<T>(selectedColumns: AvailableColumns[]): ColumnDef<T>[] {
    const columnMap: Record<string, () => ColumnDef<T>> = {
        select: createSelectColumn,
        first_name: createNameColumn,
        last_name: createLastNameColumn,
        phone: createPhoneColumn,
        amount_of_people: createPeopleColumn,
        start_time: createTimeColumn,
        reservation_date: createDateColumn,
        status: createStatusColumn,
    }

    return selectedColumns.map((columnName) => columnMap[columnName]())
}

export interface DataTableProps<T> {
    data: T[]
    columns: AvailableColumns[] | ColumnDef<T>[]
    isLoading?: boolean
    pageSize?: number
    title?: string
    subtitle?: string
    filterField?: string
    filterPlaceholder?: string
    icon?: React.ReactNode
}

export function DataTable<T>({
    data,
    columns,
    isLoading,
    pageSize = 10,
    filterField,
    filterPlaceholder = 'Filtrar...',
}: DataTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const tableColumns = React.useMemo(() => {
        if (!columns || columns.length === 0) {
            return [] as ColumnDef<T>[]
        }

        if (typeof columns[0] === 'string') {
            return getSelectedColumns<T>(columns as AvailableColumns[])
        }

        return columns as ColumnDef<T>[]
    }, [columns])

    const table = useReactTable({
        data,
        columns: tableColumns,
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
                pageSize,
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
                        {filterField && (
                            <div className="relative w-full max-w-xs">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                                <Input
                                    placeholder={filterPlaceholder}
                                    value={
                                        (table
                                            .getColumn(filterField)
                                            ?.getFilterValue() as string) ?? ''
                                    }
                                    onChange={(event) =>
                                        table
                                            .getColumn(filterField)
                                            ?.setFilterValue(event.target.value)
                                    }
                                    className="w-full rounded-lg border-zinc-200 bg-zinc-50 pl-9 text-sm ring-offset-white placeholder:text-zinc-400 focus-visible:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/50 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-800"
                                />
                            </div>
                        )}

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
                                            colSpan={tableColumns.length}
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
