import type { ColumnDef, Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
    EyeIcon,
    MessageSquareIcon,
    MoreHorizontalIcon,
    CalendarIcon,
    MapPinIcon,
    PencilIcon,
    Trash2Icon,
    CopyIcon,
    TagsIcon
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Demand } from "@/types/demand-types"
import { DEMAND_STATUS_CONFIG, STATUS_OPTIONS, DEMAND_PRIORITY_CONFIG, PRIORITY_OPTIONS } from "./demand-utils"
import { useUpdateDemandStatus, useUpdateDemand } from "@/api/demands/hooks"
import { cn } from "@/lib/utils"

const PriorityCell = ({ row }: { row: Row<Demand> }) => {
    const demand = row.original
    const priority = demand.priority || "LOW"
    const config = DEMAND_PRIORITY_CONFIG[priority]
    const { mutate: updateDemand, isPending } = useUpdateDemand()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isPending}>
                <button className="outline-none cursor-pointer group">
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-[10px] font-bold px-2 py-0 uppercase transition-all group-hover:opacity-80 active:scale-95",
                            config.className,
                            isPending && "opacity-50 animate-pulse"
                        )}
                    >
                        {config.label}
                    </Badge>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
                {PRIORITY_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                        key={opt.value}
                        disabled={priority === opt.value}
                        onClick={() => updateDemand({ id: demand.id, data: { priority: opt.value } })}
                        className={cn(
                            "cursor-pointer",
                            priority === opt.value && "bg-zinc-50 text-[#008EFF] font-semibold"
                        )}
                    >
                        {opt.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const StatusCell = ({ row }: { row: Row<Demand> }) => {
    const demand = row.original
    const config = DEMAND_STATUS_CONFIG[demand.status]
    const { mutate: updateStatus, isPending } = useUpdateDemandStatus()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isPending}>
                <button className="outline-none cursor-pointer group">
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-xs font-medium px-2.5 py-0.5 transition-all group-hover:opacity-80 active:scale-95",
                            config.className,
                            isPending && "opacity-50 animate-pulse"
                        )}
                    >
                        {config.label}
                    </Badge>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
                {STATUS_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                        key={opt.value}
                        disabled={demand.status === opt.value}
                        onClick={() => updateStatus({ id: demand.id, status: opt.value })}
                        className={cn(
                            "cursor-pointer",
                            demand.status === opt.value && "bg-zinc-50 text-[#008EFF] font-semibold"
                        )}
                    >
                        {opt.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const demandsColumns: ColumnDef<Demand>[] = [
    {
        accessorKey: "title",
        header: "Demanda",
        cell: ({ row }) => {
            const d = row.original
            return (
                <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-semibold text-zinc-900">{d.title}</span>
                    <span className="text-zinc-400 text-xs truncate max-w-md">{d.description}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "category",
        header: "Categoria",
        size: 140,
        cell: ({ row }) => {
            const category = row.original.category
            if (!category) return null
            return (
                <div className="flex items-center gap-2 text-zinc-600">
                    <TagsIcon className="size-3.5 text-zinc-300 shrink-0" />
                    <span className="text-sm">{category.name}</span>
                </div>
            )
        },
    },
    {
        id: "priority",
        header: "Prioridade",
        size: 130,
        cell: (props) => <PriorityCell {...props} />,
    },
    {
        id: "status",
        header: "Status",
        size: 150,
        cell: (props) => <StatusCell {...props} />,
    },
    {
        accessorKey: "reporter",
        header: "Relator",
        size: 180,
        cell: ({ row }) => {
            const r = row.original.reporter
            if (!r) return null
            return (
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full flex items-center justify-center text-sm font-bold bg-zinc-100 text-zinc-600">
                        {r.name.charAt(0)}
                    </div>
                    <span className="text-zinc-700">{r.name}</span>
                </div>
            )
        },
    },
    {
        id: "date_location",
        header: "Data / Local",
        size: 170,
        cell: ({ row }) => {
            const d = row.original
            return (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-zinc-600">
                        <CalendarIcon className="size-3.5 text-zinc-400 shrink-0" />
                        {d.createdAt && format(new Date(d.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                        <MapPinIcon className="size-3.5 text-zinc-300 shrink-0" />
                        <span className="truncate">{d.address || "Não informado"}</span>
                    </div>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center w-full">Ações</div>,
        size: 100,
        cell: () => (
            <div className="flex items-center justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 cursor-pointer"
                        >
                            <MoreHorizontalIcon className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                            <EyeIcon className="size-3.5 text-zinc-400" />
                            Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                            <MessageSquareIcon className="size-3.5 text-zinc-400" />
                            Comentar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                            <PencilIcon className="size-3.5 text-zinc-400" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                            <CopyIcon className="size-3.5 text-zinc-400" />
                            Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50">
                            <Trash2Icon className="size-3.5" />
                            Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
]
