import { useGetDemandsByCabinetSlug, useUpdateDemandProgress } from "@/api/demands/hooks"
import { DemandStatus, type Demand } from "@/api/demands/types"
import { DemandDetailSheet } from "@/components/demand-detail-sheet"
import { DemandStatusBadge } from "@/components/demand-status-badge"
import { UpdateProgressDialog } from "@/components/update-progress-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useCurrentMember } from "@/hooks/use-current-member"
import { usePageTitle } from "@/hooks/use-page-title"
import { cn } from "@/lib/utils"
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names"
import { formatDateToNow } from "@/utils/format-date-to-now"
import { DEMAND_STATUS_CONFIG } from "../demands/components/demand-utils"
import { DemandPriority } from "../demands/components/demand-priority"
import {
	CalendarIcon,
	CheckCircle2,
	ChevronRight,
	ClipboardList,
	Clock,
	Kanban,
	List,
	Loader2,
	TagIcon,
	TrendingUp,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const KANBAN_COLUMNS: { status: DemandStatus; dotClass: string }[] = [
	{ status: DemandStatus.SUBMITTED, dotClass: "bg-slate-400" },
	{ status: DemandStatus.IN_ANALYSIS, dotClass: "bg-blue-500" },
	{ status: DemandStatus.IN_PROGRESS, dotClass: "bg-amber-500" },
	{ status: DemandStatus.RESOLVED, dotClass: "bg-emerald-500" },
	{ status: DemandStatus.REJECTED, dotClass: "bg-red-500" },
	{ status: DemandStatus.CANCELED, dotClass: "bg-zinc-400" },
]

const STATUSES_REQUIRING_NOTE: DemandStatus[] = [DemandStatus.REJECTED, DemandStatus.CANCELED]

type StatusGroup = {
	key: string
	label: string
	statuses: DemandStatus[]
	icon: React.ElementType
	dotClass: string
}

const STATUS_GROUPS: StatusGroup[] = [
	{
		key: "pending",
		label: "Pendentes",
		statuses: [DemandStatus.SUBMITTED, DemandStatus.IN_ANALYSIS],
		icon: ClipboardList,
		dotClass: "bg-blue-500",
	},
	{
		key: "in_progress",
		label: "Em Andamento",
		statuses: [DemandStatus.IN_PROGRESS],
		icon: Clock,
		dotClass: "bg-amber-500",
	},
	{
		key: "done",
		label: "Concluídas",
		statuses: [DemandStatus.RESOLVED, DemandStatus.REJECTED, DemandStatus.CANCELED],
		icon: CheckCircle2,
		dotClass: "bg-emerald-500",
	},
]

interface KanbanCardProps {
	demand: Demand
	draggingId: string | null
	onOpenDetail: (d: Demand) => void
	onDragStart: (e: React.DragEvent, d: Demand) => void
	onDragEnd: () => void
}

function KanbanCard({ demand, draggingId, onOpenDetail, onDragStart, onDragEnd }: KanbanCardProps) {
	const isDragging = draggingId === demand.id

	return (
		<div
			draggable
			onDragStart={(e) => onDragStart(e, demand)}
			onDragEnd={onDragEnd}
			onClick={() => onOpenDetail(demand)}
			className={cn(
				"group bg-card rounded-xl border border-border/60 p-3 select-none",
				"cursor-grab active:cursor-grabbing",
				"shadow-sm hover:shadow-md hover:border-border transition-all duration-150",
				isDragging && "opacity-30 scale-95",
			)}
		>
			<p className="text-sm font-medium text-foreground leading-snug line-clamp-3 mb-2">
				{demand.title}
			</p>

			{demand.priority && (
				<div className="mb-2">
					<DemandPriority variant={demand.priority} />
				</div>
			)}

			{demand.category && (
				<div className="flex items-center gap-1 mb-2">
					<TagIcon className="size-3 text-muted-foreground/50 shrink-0" />
					<span className="text-xs text-muted-foreground/70 truncate">{demand.category.name}</span>
				</div>
			)}

			<div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
				{demand.reporter ? (
					<div className="flex items-center gap-1.5 min-w-0">
						<Avatar className="size-5 shrink-0">
							<AvatarImage src={demand.reporter.avatarUrl} />
							<AvatarFallback className="text-2xs bg-primary/10 text-primary font-bold">
								{demand.reporter.name.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<span className="text-xs text-muted-foreground truncate">{demand.reporter.name}</span>
					</div>
				) : (
					<div />
				)}
				<div className="flex items-center gap-1 shrink-0">
					<CalendarIcon className="size-3 text-muted-foreground/50" />
					<span className="text-xs text-muted-foreground/70">{formatDateToNow(demand.createdAt)}</span>
				</div>
			</div>
		</div>
	)
}

interface KanbanColumnProps {
	status: DemandStatus
	dotClass: string
	demands: Demand[]
	draggingId: string | null
	isOver: boolean
	onDragStart: (e: React.DragEvent, d: Demand) => void
	onDragEnd: () => void
	onDragOver: (e: React.DragEvent, s: DemandStatus) => void
	onDragLeave: (e: React.DragEvent) => void
	onDrop: (e: React.DragEvent, s: DemandStatus) => void
	onOpenDetail: (d: Demand) => void
}

function KanbanColumn({
	status, dotClass, demands, draggingId, isOver,
	onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop, onOpenDetail,
}: KanbanColumnProps) {
	const config = DEMAND_STATUS_CONFIG[status]

	return (
		<div
			className={cn(
				"flex flex-col min-w-52 w-52 rounded-2xl border border-border/50 bg-muted/20 shrink-0 transition-all duration-150",
				isOver && "border-primary/30 bg-primary/5 ring-2 ring-primary/15",
			)}
			onDragOver={(e) => onDragOver(e, status)}
			onDragLeave={onDragLeave}
			onDrop={(e) => onDrop(e, status)}
		>
			<div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-border/30">
				<span className={cn("size-2 rounded-full shrink-0", dotClass)} />
				<span className="text-2xs font-bold text-muted-foreground/80 uppercase tracking-widest flex-1 truncate">
					{config.label}
				</span>
				<span className={cn(
					"inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-2xs font-bold tabular-nums",
					demands.length > 0 ? "bg-muted text-muted-foreground" : "text-muted-foreground/30",
				)}>
					{demands.length}
				</span>
			</div>

			<div className="flex flex-col gap-2 p-2.5 flex-1 min-h-28">
				{demands.length === 0 ? (
					<div className="flex items-center justify-center flex-1 py-8">
						<p className={cn(
							"text-xs select-none transition-colors",
							isOver ? "text-primary/40" : "text-muted-foreground/30",
						)}>
							{isOver ? "Soltar aqui" : "Vazio"}
						</p>
					</div>
				) : (
					demands.map((demand) => (
						<KanbanCard
							key={demand.id}
							demand={demand}
							draggingId={draggingId}
							onOpenDetail={onOpenDetail}
							onDragStart={onDragStart}
							onDragEnd={onDragEnd}
						/>
					))
				)}
			</div>
		</div>
	)
}

interface KanbanBoardProps {
	demands: Demand[]
	onOpenDetail: (d: Demand) => void
}

function KanbanBoard({ demands, onOpenDetail }: KanbanBoardProps) {
	const [draggingId, setDraggingId] = useState<string | null>(null)
	const [overColumn, setOverColumn] = useState<DemandStatus | null>(null)
	const [pendingMove, setPendingMove] = useState<{ demand: Demand; toStatus: DemandStatus } | null>(null)
	const { mutate: updateProgress } = useUpdateDemandProgress()

	const byStatus = useMemo(() => {
		const map = Object.fromEntries(
			Object.values(DemandStatus).map((s) => [s, [] as Demand[]]),
		) as Record<DemandStatus, Demand[]>
		demands.forEach((d) => map[d.status]?.push(d))
		return map
	}, [demands])

	function handleDragStart(e: React.DragEvent, demand: Demand) {
		setDraggingId(demand.id)
		e.dataTransfer.setData("demandId", demand.id)
		e.dataTransfer.setData("fromStatus", demand.status)
		e.dataTransfer.effectAllowed = "move"
	}

	function handleDragEnd() {
		setDraggingId(null)
		setOverColumn(null)
	}

	function handleDragOver(e: React.DragEvent, status: DemandStatus) {
		e.preventDefault()
		e.dataTransfer.dropEffect = "move"
		setOverColumn(status)
	}

	function handleDragLeave(e: React.DragEvent) {
		if (!e.currentTarget.contains(e.relatedTarget as Node)) {
			setOverColumn(null)
		}
	}

	function handleDrop(e: React.DragEvent, toStatus: DemandStatus) {
		e.preventDefault()
		const demandId = e.dataTransfer.getData("demandId")
		const fromStatus = e.dataTransfer.getData("fromStatus") as DemandStatus
		setOverColumn(null)
		setDraggingId(null)

		if (!demandId || fromStatus === toStatus) return
		const demand = demands.find((d) => d.id === demandId)
		if (!demand) return

		if (STATUSES_REQUIRING_NOTE.includes(toStatus)) {
			setPendingMove({ demand, toStatus })
		} else {
			updateProgress({ id: demandId, status: toStatus })
		}
	}

	return (
		<>
			<div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4">
				{KANBAN_COLUMNS.map((col) => (
					<KanbanColumn
						key={col.status}
						status={col.status}
						dotClass={col.dotClass}
						demands={byStatus[col.status]}
						draggingId={draggingId}
						isOver={overColumn === col.status}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onOpenDetail={onOpenDetail}
					/>
				))}
			</div>

			{pendingMove && (
				<UpdateProgressDialog
					demandId={pendingMove.demand.id}
					demandTitle={pendingMove.demand.title}
					currentStatus={pendingMove.demand.status}
					defaultStatus={pendingMove.toStatus}
					open={!!pendingMove}
					onOpenChange={(open) => !open && setPendingMove(null)}
				/>
			)}
		</>
	)
}

function DemandListCard({
	demand,
	onOpenDetail,
	onOpenProgress,
}: {
	demand: Demand
	onOpenDetail: (d: Demand) => void
	onOpenProgress: (d: Demand) => void
}) {
	return (
		<div className="flex items-start gap-3.5 px-4 py-3.5">
			{demand.reporter ? (
				<Avatar className="size-8 shrink-0 mt-0.5">
					<AvatarImage src={demand.reporter.avatarUrl} />
					<AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
						{getFirstLettersFromNames(demand.reporter.name)}
					</AvatarFallback>
				</Avatar>
			) : (
				<div className="size-8 rounded-full bg-muted shrink-0 mt-0.5" />
			)}

			<button className="flex-1 min-w-0 text-left" onClick={() => onOpenDetail(demand)}>
				<div className="flex items-start justify-between gap-2">
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold text-foreground leading-snug line-clamp-1">
							{demand.title}
						</p>
						<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{demand.description}</p>
						<div className="flex items-center gap-3 mt-1.5 flex-wrap">
							<DemandStatusBadge status={demand.status} />
							{demand.category && (
								<span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
									<TagIcon className="size-3" />
									{demand.category.name}
								</span>
							)}
							<span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
								<CalendarIcon className="size-3" />
								{formatDateToNow(demand.createdAt)}
							</span>
						</div>
					</div>
					<ChevronRight className="size-4 text-muted-foreground/50 shrink-0 mt-0.5" />
				</div>
			</button>

			<div className="flex flex-col items-end gap-2 shrink-0">
				{demand.priority && <DemandPriority variant={demand.priority} />}
				<Button
					size="sm"
					variant="outline"
					className="h-7 gap-1.5 text-xs"
					onClick={(e) => { e.stopPropagation(); onOpenProgress(demand) }}
				>
					<TrendingUp className="size-3.5" />
					Atualizar
				</Button>
			</div>
		</div>
	)
}

function ListView({
	grouped,
	onOpenDetail,
	onOpenProgress,
}: {
	grouped: (StatusGroup & { items: Demand[] })[]
	onOpenDetail: (d: Demand) => void
	onOpenProgress: (d: Demand) => void
}) {
	return (
		<div className="flex flex-col gap-4">
			{grouped.map((group) => {
				if (group.items.length === 0) return null
				const Icon = group.icon
				return (
					<div key={group.key} className="rounded-xl border border-border bg-card overflow-hidden">
						<div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/20">
							<span className={cn("size-2 rounded-full shrink-0", group.dotClass)} />
							<Icon className="size-3.5 text-muted-foreground" />
							<span className="text-xs font-semibold text-foreground">{group.label}</span>
							<span className="ml-auto inline-flex items-center justify-center size-5 rounded-full bg-muted text-muted-foreground text-2xs font-bold">
								{group.items.length}
							</span>
						</div>
						<div className="divide-y divide-border">
							{group.items.map((demand) => (
								<DemandListCard
									key={demand.id}
									demand={demand}
									onOpenDetail={onOpenDetail}
									onOpenProgress={onOpenProgress}
								/>
							))}
						</div>
					</div>
				)
			})}
		</div>
	)
}

export function MyTasks() {
	const { setTitle } = usePageTitle()
	const { cabinet } = useAuth()
	const { currentMember } = useCurrentMember()
	const [detailDemand, setDetailDemand] = useState<Demand | null>(null)
	const [progressDemand, setProgressDemand] = useState<Demand | null>(null)
	const [view, setView] = useState<"list" | "kanban">("list")

	useEffect(() => {
		setTitle({ title: "Minhas Tarefas", description: "Demandas atribuídas a você" })
	}, [])

	const { data: demands, isLoading } = useGetDemandsByCabinetSlug({
		slug: cabinet?.slug as string,
		assigneeMemberId: currentMember?.id,
		limit: 100,
		page: 1,
	})

	const allDemands = demands?.items ?? []
	const total = allDemands.length

	const grouped = useMemo(
		() => STATUS_GROUPS.map((group) => ({
			...group,
			items: allDemands.filter((d) => group.statuses.includes(d.status)),
		})),
		[allDemands],
	)

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-32">
				<Loader2 className="size-6 text-muted-foreground animate-spin" />
			</div>
		)
	}

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-base font-semibold text-foreground">Minhas Tarefas</h1>
						<p className="text-sm text-muted-foreground">
							Demandas atribuídas a você no gabinete {cabinet?.name ?? ""}.
						</p>
					</div>
					<div className="flex items-center gap-3 shrink-0">
						{total > 0 && (
							<div className="text-right">
								<p className="text-xl font-bold text-foreground">{total}</p>
								<p className="text-xs text-muted-foreground">{total === 1 ? "demanda" : "demandas"}</p>
							</div>
						)}
						{total > 0 && (
							<div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
								<button
									onClick={() => setView("list")}
									className={cn(
										"flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
										view === "list"
											? "bg-background text-foreground shadow-sm"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									<List className="size-3.5" />
									Lista
								</button>
								<button
									onClick={() => setView("kanban")}
									className={cn(
										"flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
										view === "kanban"
											? "bg-background text-foreground shadow-sm"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									<Kanban className="size-3.5" />
									Kanban
								</button>
							</div>
						)}
					</div>
				</div>

				{total === 0 ? (
					<div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center py-20 text-center gap-3">
						<div className="size-14 rounded-full bg-muted flex items-center justify-center">
							<ClipboardList className="size-6 text-muted-foreground" />
						</div>
						<div>
							<p className="text-sm font-semibold text-foreground">Nenhuma demanda atribuída</p>
							<p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
								Quando uma demanda for atribuída a você, ela aparecerá aqui organizada por status.
							</p>
						</div>
					</div>
				) : view === "list" ? (
					<ListView
						grouped={grouped}
						onOpenDetail={setDetailDemand}
						onOpenProgress={setProgressDemand}
					/>
				) : (
					<KanbanBoard demands={allDemands} onOpenDetail={setDetailDemand} />
				)}
			</div>

			<DemandDetailSheet
				demand={detailDemand}
				open={!!detailDemand}
				onOpenChange={(open) => !open && setDetailDemand(null)}
			/>

			{progressDemand && (
				<UpdateProgressDialog
					demandId={progressDemand.id}
					demandTitle={progressDemand.title}
					currentStatus={progressDemand.status}
					open={!!progressDemand}
					onOpenChange={(open) => !open && setProgressDemand(null)}
				/>
			)}
		</>
	)
}
