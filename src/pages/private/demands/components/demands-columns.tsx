import { useUpdateDemand, useUpdateDemandStatus } from "@/api/demands/hooks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Demand } from "@/api/demands/types"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
	CalendarIcon,
	CopyIcon,
	EyeIcon,
	MapPinIcon,
	MessageSquareIcon,
	MoreHorizontalIcon,
	PencilIcon,
	TagsIcon,
	Trash2Icon
} from "lucide-react"
import { DemandPriority } from "./demand-priority"
import { DEMAND_STATUS_CONFIG, PRIORITY_OPTIONS, STATUS_OPTIONS } from "./demand-utils"

function PriorityCell({ row }: { row: Row<Demand> }) {
	const demand = row.original
	const priority = demand.priority || "LOW"
	const { mutate: updateDemand, isPending } = useUpdateDemand()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild disabled={isPending}>
				<button className="outline-none cursor-pointer group">
					<DemandPriority variant={priority} />
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
							priority === opt.value && "bg-accent text-primary font-semibold"
						)}
					>
						{opt.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function StatusCell({ row }: { row: Row<Demand> }) {
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
							demand.status === opt.value && "bg-accent text-primary font-semibold"
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
					<span className="font-semibold">{d.title}</span>
					<span className="text-muted-foreground text-xs truncate max-w-md">{d.description}</span>
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
					<span className="text-muted-foregground">{r.name}</span>
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
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<CalendarIcon className="size-3.5 text-muted-foreground shrink-0" />
						{d.createdAt && format(new Date(d.createdAt), "dd/MM/yyyy", { locale: ptBR })}
					</div>
					<div className="flex items-center gap-1.5 text-zinc-400">
						<MapPinIcon className="size-3.5 text-muted-foreground shrink-0" />
						<span className="truncate">{d.address || "Não informado"}</span>
					</div>
				</div>
			)
		},
	},
	{
		id: "actions",
		size: 100,
		cell: () => (
			<div className="flex items-center justify-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="w-9 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 cursor-pointer"
						>
							<MoreHorizontalIcon className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-44">
						<DropdownMenuItem>
							<EyeIcon className="size-3.5 text-zinc-400" />
							Ver detalhes
						</DropdownMenuItem>
						<DropdownMenuItem>
							<MessageSquareIcon className="size-3.5 text-zinc-400" />
							Comentar
						</DropdownMenuItem>
						<DropdownMenuItem>
							<PencilIcon className="size-3.5 text-zinc-400" />
							Editar
						</DropdownMenuItem>
						<DropdownMenuItem>
							<CopyIcon className="size-3.5 text-zinc-400" />
							Duplicar
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive">
							<Trash2Icon className="size-3.5" />
							Excluir
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		),
	},
]
