import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
} from "lucide-react"

interface TablePaginationProps<TData> {
    table: Table<TData>
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
    const { pageIndex, pageSize } = table.getState().pagination
    const totalRows = table.getFilteredRowModel().rows.length
    const from = pageIndex * pageSize + 1
    const to = Math.min((pageIndex + 1) * pageSize, totalRows)

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 border-t border-zinc-100 bg-zinc-50/60">
            <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400 hidden sm:block">Linhas por página</span>
                <Select
                    value={`${pageSize}`}
                    onValueChange={value => table.setPageSize(Number(value))}
                >
                    <SelectTrigger className="h-8 w-16 border-zinc-200 text-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[5, 10, 20, 50].map(size => (
                            <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-500">
                    <span className="font-semibold text-zinc-700">{from}–{to}</span> de <span className="font-semibold text-zinc-700">{totalRows}</span>
                </span>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8 border-zinc-200 text-zinc-400 hover:text-zinc-700"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeftIcon className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8 border-zinc-200 text-zinc-400 hover:text-zinc-700"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeftIcon className="size-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                            const startPage = Math.max(0, Math.min(pageIndex - 2, table.getPageCount() - 5))
                            const p = startPage + i
                            return (
                                <button
                                    key={p}
                                    onClick={() => table.setPageIndex(p)}
                                    className={`size-8 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${pageIndex === p
                                            ? "bg-[#008EFF] text-white"
                                            : "border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
                                        }`}
                                >
                                    {p + 1}
                                </button>
                            )
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8 border-zinc-200 text-zinc-400 hover:text-zinc-700"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRightIcon className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8 border-zinc-200 text-zinc-400 hover:text-zinc-700"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRightIcon className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
