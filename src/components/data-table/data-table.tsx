import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getPaginationRowModel,
    type RowSelectionState,
    type PaginationState,
    type OnChangeFn,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Ghost, SearchIcon, Trash2, X } from "lucide-react"
import type { ReactNode } from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { TablePagination } from "./table-pagination"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    toolbarButton?: ReactNode
    filterSlot?: ReactNode
    searchPlaceholder?: string
    enableRowSelection?: boolean
    onBulkDelete?: (selectedRows: TData[]) => void
    manualPagination?: boolean
    pageCount?: number
    pagination?: PaginationState
    onPaginationChange?: OnChangeFn<PaginationState>

    searchValue?: string
    onSearchChange?: (value: string) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    toolbarButton,
    filterSlot,
    searchPlaceholder = "Pesquisar...",
    enableRowSelection = false,
    onBulkDelete,
    manualPagination,
    pageCount,
    pagination,
    onPaginationChange,
    searchValue: externalSearchValue,
    onSearchChange,
}: DataTableProps<TData, TValue>) {
    const [internalSearchValue, setInternalSearchValue] = useState("")
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    const searchValue = externalSearchValue !== undefined ? externalSearchValue : internalSearchValue
    const handleSearchChange = (value: string) => {
        if (onSearchChange) {
            onSearchChange(value)
        } else {
            setInternalSearchValue(value)
        }
    }

    const selectColumn: ColumnDef<TData, TValue> = {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Selecionar todos"
                className="data-[state=checked]:bg-[#008EFF] data-[state=checked]:border-[#008EFF] data-[state=indeterminate]:bg-[#008EFF] data-[state=indeterminate]:border-[#008EFF]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
                aria-label="Selecionar linha"
                className="data-[state=checked]:bg-[#008EFF] data-[state=checked]:border-[#008EFF]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 44,
    }

    const tableColumns = enableRowSelection ? [selectColumn, ...columns] : columns

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: manualPagination ? undefined : getFilteredRowModel(),
        getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
        manualPagination,
        pageCount,
        onPaginationChange,
        enableRowSelection,
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
            pagination,
            globalFilter: manualPagination ? undefined : searchValue,
        },
    })

    const selectedRows = table.getFilteredSelectedRowModel().rows.map(r => r.original)
    const hasSelection = selectedRows.length > 0

    return (
        <div className="rounded-xl border border-zinc-200/70 bg-white shadow-sm overflow-hidden">
            <div className="flex flex-wrap gap-3 items-center justify-between px-5 py-4 border-b border-zinc-100">
                <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={e => handleSearchChange(e.target.value)}
                            className="pl-9 h-9 w-96 bg-white border-zinc-200 text-sm placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-[#008EFF]/40 focus-visible:border-[#008EFF]"
                        />
                        {searchValue && (
                            <button
                                onClick={() => handleSearchChange("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 rounded text-zinc-400 hover:text-zinc-700 cursor-pointer"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>

                    {hasSelection && onBulkDelete && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => { onBulkDelete(selectedRows); setRowSelection({}) }}
                            className="gap-2 h-9"
                        >
                            <Trash2 className="size-4" />
                            Excluir {selectedRows.length} {selectedRows.length === 1 ? "item" : "itens"}
                        </Button>
                    )}
                    {filterSlot}
                </div>
                {toolbarButton}
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id} className="bg-zinc-50/80 hover:bg-zinc-50/80 border-zinc-100">
                                {headerGroup.headers.map(header => (
                                    <TableHead
                                        key={header.id}
                                        className="text-xs font-semibold text-zinc-400 uppercase tracking-wider py-3"
                                        style={{ width: header.column.columnDef.size }}
                                    >
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    className={cn(
                                        "border-zinc-100 transition-colors",
                                        row.getIsSelected() ? "bg-[#008EFF]/4 hover:bg-[#008EFF]/6" : "hover:bg-zinc-50/70"
                                    )}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} className="py-4 text-sm text-zinc-700">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={tableColumns.length} className="h-40 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 text-zinc-400">
                                        <Ghost className="size-8" />
                                        <p className="text-sm">Nenhum resultado encontrado</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <TablePagination table={table} />
        </div>
    )
}
