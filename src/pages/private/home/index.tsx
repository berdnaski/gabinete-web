import { useGetCabinetBySlug, useGetCabinetMetrics, useGetCabinetTrendDetailed } from "@/api/cabinets/hooks"
import { useGetCabinetDashboardSummary, useGetDemandsByCabinetSlug } from "@/api/demands/hooks"
import { type Demand } from "@/api/demands/types"
import { DemandStatusBadge } from "@/components/demand-status-badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { useAuth } from "@/hooks/use-auth"
import { useCurrentMember } from "@/hooks/use-current-member"
import { usePageTitle } from "@/hooks/use-page-title"
import { cn } from "@/lib/utils"
import { formatDateToNow } from "@/utils/format-date-to-now"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Download,
  Loader2,
  Star,
  ThumbsUp,
  TrendingUp,
  User,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { DemandPriority } from "../demands/components/demand-priority"

const BRAND = {
  primary: "#0058F3",
  blue2: "#008EFF",
  green: "#34D144",
}

const CAT_COLORS = ["#EF4444", "#F59E0B", "#0058F3", "#34D144", "#8B5CF6", "#06B6D4"]

const trendConfig: ChartConfig = {
  created: { label: "Recebidas", color: BRAND.primary },
  resolved: { label: "Resolvidas", color: BRAND.green },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 14, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Bom dia"
  if (h < 18) return "Boa tarde"
  return "Boa noite"
}

function getFormattedDate(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date())
}

function getMonthYear(): string {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date())
}

function ChartTip({
  active,
  payload,
  labelKey = "label",
}: {
  active?: boolean
  payload?: Array<{ name?: string; value: number; color?: string; payload: Record<string, string | number> }>
  labelKey?: string
}) {
  if (!active || !payload?.length) return null
  const label = String(payload[0].payload[labelKey] ?? "")
  return (
    <div className="rounded-xl border border-border/60 bg-background/98 px-3.5 py-3 shadow-lg shadow-black/[0.08] min-w-40 space-y-2.5">
      <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="h-px bg-border/50" />
      {payload.map((item, i) => (
        <div key={i} className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="text-xs text-muted-foreground">{item.name}</span>
          </div>
          <span className="font-mono text-sm font-bold tabular-nums text-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export function Home() {
  const { setTitle } = usePageTitle()
  const { user, cabinet } = useAuth()
  const { currentMember } = useCurrentMember()
  const navigate = useNavigate()

  useEffect(() => {
    setTitle({ title: "Início", description: "Visão geral do gabinete" })
  }, [setTitle])

  const { data: metrics, isLoading: metricsLoading } = useGetCabinetMetrics(cabinet?.slug)
  const { data: cabinetData } = useGetCabinetBySlug(cabinet?.slug)
  const { data: trendPoints, isLoading: trendLoading } = useGetCabinetTrendDetailed(cabinet?.slug, 14)
  const { data: dashboardSummary, isLoading: summaryLoading } = useGetCabinetDashboardSummary(cabinet?.slug)

  const { data: urgentDemands, isLoading: urgentLoading } = useGetDemandsByCabinetSlug({
    slug: cabinet?.slug as string,
    priority: "URGENT",
    limit: 6,
    page: 1,
    enabled: !!cabinet?.slug,
  })

  const { data: myDemands, isLoading: myDemandsLoading } = useGetDemandsByCabinetSlug({
    slug: cabinet?.slug as string,
    assigneeMemberId: currentMember?.id,
    limit: 5,
    page: 1,
    enabled: !!cabinet?.slug && !!currentMember?.id,
  })

  const myDemandsList = myDemands?.items ?? []
  const myDemandsTotal = myDemands?.meta.total ?? 0
  const urgentList = urgentDemands?.items ?? []
  const urgentTotal = urgentDemands?.meta.total ?? 0
  const firstName = user?.name?.split(" ")[0] ?? "usuário"

  const demandCount = cabinetData?.demand_count ?? 0
  const score = cabinetData?.score ?? 0
  const resolutionRate = cabinetData?.resolution_rate ?? 0

  const trendData = useMemo(() => {
    if (!trendPoints?.length) return []
    return trendPoints.map((p) => ({
      label: new Date(p.date + "T12:00:00").toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      created: p.created,
      resolved: p.resolved,
    }))
  }, [trendPoints])

  const hasTrendData = trendData.some((d) => d.created > 0 || d.resolved > 0)
  const trendCreatedTotal = trendData.reduce((s, d) => s + d.created, 0)
  const trendResolvedTotal = trendData.reduce((s, d) => s + d.resolved, 0)

  const categoryData = useMemo(() => {
    return (dashboardSummary?.categories ?? []).slice(0, 6).map((c, i) => ({
      ...c,
      color: CAT_COLORS[i % CAT_COLORS.length],
    }))
  }, [dashboardSummary?.categories])

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div className="flex flex-wrap items-start justify-between gap-3" variants={fadeUp} custom={0}>
        <div>
          <h1 className="text-2xl font-bold font-brand text-foreground tracking-tight leading-none">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 capitalize">
            {getGreeting()}, {firstName} · {getFormattedDate()}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {score > 0 && (
            <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-muted/60 border border-border text-xs font-semibold text-foreground">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {score} pts
            </div>
          )}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground capitalize">
            {getMonthYear()}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-7 text-xs text-muted-foreground"
            onClick={() => navigate("/relatorios")}
          >
            <Download className="size-3" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-2 gap-3 lg:grid-cols-4" variants={stagger}>
        <KpiCard
          icon={<ClipboardList className="size-4.5" />}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          label="Total de Demandas"
          value={String(demandCount)}
          loading={!cabinetData}
          onClick={() => navigate("/demands")}
        />
        <KpiCard
          icon={<TrendingUp className="size-4.5" />}
          iconBg={resolutionRate >= 70 ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-amber-50 dark:bg-amber-950/30"}
          iconColor={resolutionRate >= 70 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"}
          label="Taxa de Resolução"
          value={`${resolutionRate}%`}
          badge={
            resolutionRate >= 70
              ? { text: "Acima da meta", variant: "success" as const }
              : resolutionRate >= 40
                ? { text: "Em progresso", variant: "warning" as const }
                : undefined
          }
          loading={!cabinetData}
        />
        <KpiCard
          icon={<Zap className="size-4.5" />}
          iconBg={(metrics?.new ?? 0) > 0 ? "bg-amber-50 dark:bg-amber-950/30" : "bg-muted/50"}
          iconColor={(metrics?.new ?? 0) > 0 ? "text-amber-500" : "text-muted-foreground"}
          label="Novas (24h)"
          value={String(metrics?.new ?? 0)}
          badge={(metrics?.new ?? 0) > 0 ? { text: "+hoje", variant: "warning" } : undefined}
          loading={metricsLoading}
        />
        <KpiCard
          icon={<AlertTriangle className="size-4.5" />}
          iconBg={(metrics?.urgent ?? 0) > 0 ? "bg-red-50 dark:bg-red-950/30" : "bg-muted/50"}
          iconColor={(metrics?.urgent ?? 0) > 0 ? "text-red-500" : "text-muted-foreground"}
          label="Urgentes Abertas"
          value={String(metrics?.urgent ?? 0)}
          badge={(metrics?.urgent ?? 0) > 0 ? { text: "atenção", variant: "danger" } : undefined}
          loading={metricsLoading}
        />
      </motion.div>

      <motion.div className="grid gap-4 lg:grid-cols-3" variants={fadeUp} custom={0.15}>
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Volume de Demandas</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Últimos 14 dias de atividade</p>
            </div>
            {hasTrendData && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full" style={{ background: BRAND.primary }} />
                  <span className="text-xs text-muted-foreground">Recebidas</span>
                  <span className="font-mono text-xs font-bold tabular-nums text-foreground">{trendCreatedTotal}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full" style={{ background: BRAND.green }} />
                  <span className="text-xs text-muted-foreground">Resolvidas</span>
                  <span className="font-mono text-xs font-bold tabular-nums text-foreground">{trendResolvedTotal}</span>
                </div>
              </div>
            )}
          </div>

          {trendLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : !hasTrendData ? (
            <div className="flex flex-col items-center justify-center h-64 gap-2.5 text-center px-6">
              <ClipboardList className="size-8 text-muted-foreground/30" />
              <div>
                <p className="text-sm font-medium text-foreground">Sem atividade recente</p>
                <p className="text-xs text-muted-foreground mt-0.5">Nenhuma demanda criada nos últimos 14 dias</p>
              </div>
            </div>
          ) : (
            <ChartContainer config={trendConfig} className="h-64 w-full px-2 pt-5 pb-3">
              <BarChart
                data={trendData}
                margin={{ top: 0, right: 8, left: -12, bottom: 0 }}
                barCategoryGap="20%"
                barGap={3}
              >
                <defs>
                  <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND.primary} stopOpacity={1} />
                    <stop offset="100%" stopColor={BRAND.blue2} stopOpacity={0.55} />
                  </linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND.green} stopOpacity={1} />
                    <stop offset="100%" stopColor={BRAND.green} stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="2 4"
                  stroke="currentColor"
                  className="text-border"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  interval={1}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <ChartTooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.5, radius: 6 }}
                  content={<ChartTip labelKey="label" />}
                />
                <Bar dataKey="created" name="Recebidas" fill="url(#createdGrad)" radius={[5, 5, 2, 2]} maxBarSize={34} animationDuration={700} animationEasing="ease-out" />
                <Bar dataKey="resolved" name="Resolvidas" fill="url(#resolvedGrad)" radius={[5, 5, 2, 2]} maxBarSize={34} animationDuration={700} animationBegin={120} animationEasing="ease-out" />
              </BarChart>
            </ChartContainer>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50">
            <h2 className="text-sm font-semibold text-foreground">Principais Problemas</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Categorias mais recorrentes</p>
          </div>
          {summaryLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : categoryData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-2 px-6 text-center">
              <p className="text-xs text-muted-foreground">Nenhuma categoria ainda</p>
            </div>
          ) : (
            <div className="px-5 py-4 flex flex-col gap-4">
              {categoryData.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  className="flex flex-col gap-1.5"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="size-2 rounded-full shrink-0" style={{ background: cat.color }} />
                      <span className="text-sm text-foreground truncate">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold font-mono tabular-nums text-foreground">{cat.total}</span>
                      <span className="text-xs text-muted-foreground w-7 text-right tabular-nums">{cat.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: cat.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ delay: 0.35 + i * 0.05, duration: 0.55, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="rounded-2xl border border-border bg-card overflow-hidden"
        variants={fadeUp}
        custom={0.25}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <span className="text-lg leading-none select-none">🔥</span>
            <div>
              <h2 className="text-sm font-semibold text-foreground leading-none">Radares de Urgência</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Demandas urgentes mais apoiadas</p>
            </div>
            {urgentTotal > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-red-50 text-red-500 border border-red-100 text-xs font-bold tabular-nums dark:bg-red-950/30 dark:border-red-800">
                {urgentTotal > 99 ? "99+" : urgentTotal}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-primary hover:text-primary/80 font-medium"
            onClick={() => navigate("/demands?priority=URGENT")}
          >
            <span className="hidden sm:inline">Ver todas as urgências</span>
            <span className="sm:hidden">Ver todas</span>
            <ArrowRight className="size-3" />
          </Button>
        </div>

        {urgentLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : urgentList.length === 0 ? (
          <div className="flex items-center gap-3 px-6 py-8">
            <div className="size-9 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Nenhuma demanda urgente</p>
              <p className="text-xs text-muted-foreground mt-0.5">Ótimo! Sem alertas críticos no momento.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="hidden sm:grid grid-cols-[1fr_120px_160px_32px] gap-x-4 px-6 py-2.5 border-b border-border/20 bg-muted/20">
              <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground/60">Localização & Problema</span>
              <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground/60">Apoios</span>
              <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground/60">Status</span>
              <span />
            </div>
            <div className="divide-y divide-border/30">
              {urgentList.map((demand, i) => (
                <motion.div
                  key={demand.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.3, ease: "easeOut" }}
                >
                  <UrgencyRow demand={demand} onNavigate={navigate} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div variants={fadeUp} custom={0.35}>
        <AssignedDemandsCard
          demands={myDemandsList}
          total={myDemandsTotal}
          isLoading={myDemandsLoading}
          currentMemberId={currentMember?.id}
          onNavigate={navigate}
        />
      </motion.div>
    </motion.div>
  )
}

function KpiCard({
  icon, iconBg, iconColor, label, value, badge, loading, onClick,
}: {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  label: string
  value: string
  badge?: { text: string; variant: "success" | "warning" | "danger" | "info" }
  loading?: boolean
  onClick?: () => void
}) {
  return (
    <motion.button
      variants={cardVariant}
      onClick={onClick}
      disabled={!onClick}
      whileHover={onClick ? { y: -1, transition: { duration: 0.15 } } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      className={cn(
        "relative w-full rounded-2xl border border-border bg-card p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 text-left overflow-hidden",
        "transition-all duration-150",
        onClick ? "hover:shadow-md hover:border-border/60 cursor-pointer" : "cursor-default",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={cn("flex items-center justify-center size-9 rounded-xl shrink-0", iconBg)}>
          <span className={cn("flex items-center justify-center", iconColor)}>{icon}</span>
        </div>
        {badge && <KpiBadge text={badge.text} variant={badge.variant} />}
      </div>
      {loading ? (
        <div className="h-9 flex items-center">
          <Loader2 className="size-4 text-muted-foreground animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-2xl sm:text-3xl font-bold font-brand tabular-nums text-foreground leading-none tracking-tight">
            {value}
          </p>
          <p className="text-xs text-muted-foreground leading-snug">{label}</p>
        </div>
      )}
    </motion.button>
  )
}

function KpiBadge({ text, variant }: { text: string; variant: "success" | "warning" | "danger" | "info" }) {
  const styles: Record<string, string> = {
    success: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    danger: "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
    info: "bg-primary/5 text-primary border-primary/15",
  }
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-semibold", styles[variant])}>
      {text}
    </span>
  )
}

function UrgencyRow({ demand, onNavigate }: { demand: Demand; onNavigate: (path: string) => void }) {
  return (
    <button
      className="group w-full grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_120px_160px_32px] gap-x-4 items-center px-6 py-3.5 hover:bg-muted/30 transition-colors text-left"
      onClick={() => onNavigate(`/demand/${demand.id}`)}
    >
      <div className="min-w-0 flex items-center gap-3.5">
        <div className="size-8 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0 border border-red-100/50 dark:border-red-900">
          <AlertTriangle className="size-3.5 text-red-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground line-clamp-1">{demand.title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {demand.category && <span className="text-xs text-muted-foreground">{demand.category.name}</span>}
            {demand.neighborhood && (
              <>
                <span className="text-muted-foreground/30 text-xs">·</span>
                <span className="text-xs text-muted-foreground">{demand.neighborhood}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1.5">
        <ThumbsUp className="size-3 text-muted-foreground/60" />
        <span className="text-sm font-semibold font-mono tabular-nums text-foreground">{demand.likesCount}</span>
        <span className="text-xs text-muted-foreground">apoios</span>
      </div>
      <div className="hidden sm:flex items-center">
        <DemandStatusBadge status={demand.status} />
      </div>
      <div className="flex items-center justify-end">
        <ArrowRight className="size-3.5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
      </div>
    </button>
  )
}

function AssignedDemandsCard({
  demands, total, isLoading, currentMemberId, onNavigate,
}: {
  demands: Demand[]
  total: number
  isLoading: boolean
  currentMemberId?: string
  onNavigate: (path: string) => void
}) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-muted flex items-center justify-center">
            <User className="size-3.5 text-muted-foreground" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Minhas Demandas</h2>
          {total > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-xs font-bold tabular-nums">
              {total > 99 ? "99+" : total}
            </span>
          )}
        </div>
        {currentMemberId && total > 5 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onNavigate(`/demands?assigneeMemberId=${currentMemberId}`)}
          >
            Ver todas
            <ArrowRight className="size-3" />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="size-4 text-muted-foreground animate-spin" />
        </div>
      ) : demands.length === 0 ? (
        <div className="flex items-center gap-3 px-6 py-8">
          <ClipboardList className="size-8 text-muted-foreground/25" />
          <div>
            <p className="text-sm font-medium text-foreground">Nenhuma demanda atribuída</p>
            <p className="text-xs text-muted-foreground mt-0.5">Quando uma demanda for atribuída a você, aparecerá aqui.</p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border/30">
          {demands.map((demand, i) => (
            <motion.div
              key={demand.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.3, ease: "easeOut" }}
            >
              <DemandRow demand={demand} onNavigate={onNavigate} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function DemandRow({ demand, onNavigate }: { demand: Demand; onNavigate: (path: string) => void }) {
  return (
    <button
      className="group w-full flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 transition-colors text-left"
      onClick={() => onNavigate(`/demand/${demand.id}`)}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground line-clamp-1 leading-snug">{demand.title}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <DemandStatusBadge status={demand.status} />
          {demand.category && <span className="text-xs text-muted-foreground">{demand.category.name}</span>}
          <span className="text-xs text-muted-foreground">{formatDateToNow(demand.createdAt)}</span>
        </div>
      </div>
      {demand.priority && (
        <div className="shrink-0">
          <DemandPriority variant={demand.priority} />
        </div>
      )}
      <ArrowRight className="size-3.5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0" />
    </button>
  )
}
