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
  Loader2,
  Star,
  ThumbsUp,
  TrendingUp,
  User,
  Zap,
} from "lucide-react"
import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { DemandPriority } from "../demands/components/demand-priority"

const BRAND = {
  primary: "#0058F3",
  blue2: "#008EFF",
  green: "#34D144",
  greenMuted: "#34D14420",
  primaryMuted: "#0058F310",
}

const CAT_COLORS = ["#EF4444", "#F59E0B", "#0058F3", "#34D144", "#8B5CF6", "#06B6D4"]

const PRIORITY_STRIPE: Record<string, string> = {
  URGENT: "bg-red-500",
  HIGH: "bg-orange-400",
  MEDIUM: "bg-primary",
  LOW: "bg-border",
}

const trendConfig: ChartConfig = {
  created: { label: "Recebidas", color: BRAND.primary },
  resolved: { label: "Resolvidas", color: BRAND.green },
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
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl space-y-1.5 min-w-28">
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((item, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm shrink-0" style={{ background: item.color }} />
            <span className="text-muted-foreground">{item.name}</span>
          </div>
          <span className="font-mono font-semibold tabular-nums text-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function ChartLegend({
  payload,
}: {
  payload?: Array<{ value: string; color?: string }>
}) {
  if (!payload?.length) return null
  return (
    <div className="flex items-center justify-end gap-4 pb-1">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="size-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
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
  const resolvedCount = cabinetData?.resolved_count ?? 0
  const score = cabinetData?.score ?? 0
  const resolutionRate = demandCount > 0 ? Math.round((resolvedCount / demandCount) * 100) : 0

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
    const cats = dashboardSummary?.categories ?? []
    const total = cats.reduce((s, c) => s + c.total, 0)
    return cats.slice(0, 6).map((c, i) => ({
      ...c,
      color: CAT_COLORS[i % CAT_COLORS.length],
      pct: total > 0 ? Math.round((c.total / total) * 100) : 0,
    }))
  }, [dashboardSummary?.categories])

  const resolutionBadge =
    resolutionRate >= 70
      ? { text: "Acima da meta", variant: "success" as const }
      : resolutionRate >= 40
        ? { text: "Em progresso", variant: "warning" as const }
        : null

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold font-brand text-foreground tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{getFormattedDate()}</p>
        </div>
        {score > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
            <Star className="size-3 fill-primary text-primary" />
            <span className="text-xs font-bold font-mono tabular-nums text-primary">{score}</span>
            <span className="text-2xs text-primary/60">pts</span>
          </div>
        )}
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          icon={<ClipboardList className="size-4.5" />}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          label="Total de Demandas"
          value={String(demandCount)}
          accentColor={BRAND.primary}
          loading={!cabinetData}
          onClick={() => navigate("/demands")}
        />
        <KpiCard
          icon={<TrendingUp className="size-4.5" />}
          iconBg={resolutionRate >= 70 ? "bg-[#34D144]/10" : "bg-amber-50 dark:bg-amber-950/30"}
          iconColor={resolutionRate >= 70 ? "text-[#34D144]" : "text-amber-500"}
          label="Taxa de Resolução"
          value={`${resolutionRate}%`}
          badge={resolutionBadge ?? undefined}
          accentColor={resolutionRate >= 70 ? BRAND.green : "#F59E0B"}
          loading={!cabinetData}
        />
        <KpiCard
          icon={<Zap className="size-4.5" />}
          iconBg={(metrics?.new ?? 0) > 0 ? "bg-amber-50 dark:bg-amber-950/30" : "bg-muted/50"}
          iconColor={(metrics?.new ?? 0) > 0 ? "text-amber-500" : "text-muted-foreground"}
          label="Novas (24h)"
          value={String(metrics?.new ?? 0)}
          badge={(metrics?.new ?? 0) > 0 ? { text: "+hoje", variant: "warning" } : undefined}
          accentColor={(metrics?.new ?? 0) > 0 ? "#F59E0B" : undefined}
          loading={metricsLoading}
        />
        <KpiCard
          icon={<AlertTriangle className="size-4.5" />}
          iconBg={(metrics?.urgent ?? 0) > 0 ? "bg-red-50 dark:bg-red-950/30" : "bg-muted/50"}
          iconColor={(metrics?.urgent ?? 0) > 0 ? "text-red-500" : "text-muted-foreground"}
          label="Urgentes Abertas"
          value={String(metrics?.urgent ?? 0)}
          badge={(metrics?.urgent ?? 0) > 0 ? { text: "atenção!", variant: "danger" } : undefined}
          accentColor={(metrics?.urgent ?? 0) > 0 ? "#EF4444" : undefined}
          loading={metricsLoading}
        />
      </div>

      {/* Volume chart + Principais Problemas */}
      <div className="grid gap-3 lg:grid-cols-3">
        {/* Dual-series bar chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-start justify-between px-5 py-4 border-b border-border/50">
            <div>
              <h2 className="text-sm font-bold font-brand text-foreground">Volume de Demandas</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Últimos 14 dias de atividade</p>
            </div>
            {hasTrendData && (
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full" style={{ background: BRAND.primary }} />
                    <span className="text-xs text-muted-foreground">Recebidas</span>
                    <span className="font-mono text-xs font-bold tabular-nums text-foreground">
                      {trendCreatedTotal}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full" style={{ background: BRAND.green }} />
                    <span className="text-xs text-muted-foreground">Resolvidas</span>
                    <span className="font-mono text-xs font-bold tabular-nums text-foreground">
                      {trendResolvedTotal}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {trendLoading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : !hasTrendData ? (
            <div className="flex flex-col items-center justify-center h-60 gap-2">
              <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
                <ClipboardList className="size-4 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Sem atividade recente</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nenhuma demanda criada nos últimos 14 dias
                </p>
              </div>
            </div>
          ) : (
            <ChartContainer config={trendConfig} className="h-60 w-full px-2 pt-4 pb-2">
              <BarChart
                data={trendData}
                margin={{ top: 0, right: 8, left: -16, bottom: 0 }}
                barCategoryGap="30%"
                barGap={2}
              >
                <defs>
                  <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND.primary} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={BRAND.blue2} stopOpacity={0.65} />
                  </linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND.green} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={BRAND.green} stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  className="text-border"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "currentColor" }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  interval={1}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "currentColor" }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={22}
                />
                <ChartTooltip
                  cursor={{ fill: "currentColor", className: "text-muted/20" }}
                  content={<ChartTip labelKey="label" />}
                />
                <Bar
                  dataKey="created"
                  name="Recebidas"
                  fill="url(#createdGrad)"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={20}
                />
                <Bar
                  dataKey="resolved"
                  name="Resolvidas"
                  fill="url(#resolvedGrad)"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={20}
                />
              </BarChart>
            </ChartContainer>
          )}
        </div>

        {/* Principais Problemas */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50">
            <h2 className="text-sm font-bold font-brand text-foreground">Principais Problemas</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Categorias mais recorrentes</p>
          </div>
          {summaryLoading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : categoryData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 gap-2 px-5 text-center">
              <span className="text-xs text-muted-foreground">Nenhuma categoria ainda</span>
            </div>
          ) : (
            <div className="px-5 py-4 flex flex-col gap-4">
              {categoryData.map((cat) => (
                <div key={cat.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="size-2 rounded-full shrink-0"
                        style={{ background: cat.color }}
                      />
                      <span className="text-xs font-medium text-foreground truncate">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-bold font-mono tabular-nums text-foreground">
                        {cat.total}
                      </span>
                      <span className="text-2xs text-muted-foreground/60 w-7 text-right tabular-nums">
                        {cat.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${cat.pct}%`, background: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Radares de Urgência */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <span className="text-base leading-none select-none">🔥</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-brand text-foreground leading-none">
                  Radares de Urgência
                </h2>
                <span className="text-xs text-muted-foreground">(Mais apoiadas hoje)</span>
              </div>
            </div>
            {urgentTotal > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-red-500/10 text-red-500 text-2xs font-bold tabular-nums">
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
            Ver todas as urgências
            <ArrowRight className="size-3" />
          </Button>
        </div>

        {urgentLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : urgentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2.5">
            <div className="size-10 rounded-xl bg-[#34D144]/10 flex items-center justify-center">
              <CheckCircle2 className="size-4.5" style={{ color: BRAND.green }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Nenhuma demanda urgente</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ótimo! Sem alertas críticos no momento.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="hidden sm:grid grid-cols-[1fr_120px_140px_32px] gap-x-4 px-5 py-2.5 border-b border-border/30 bg-muted/20">
              <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                LOCALIZAÇÃO & PROBLEMA
              </span>
              <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                IMPACTO POPULAR
              </span>
              <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                STATUS
              </span>
              <span />
            </div>
            <div className="divide-y divide-border/40">
              {urgentList.map((demand) => (
                <UrgencyRow key={demand.id} demand={demand} onNavigate={navigate} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* My Demands */}
      <AssignedDemandsCard
        demands={myDemandsList}
        total={myDemandsTotal}
        isLoading={myDemandsLoading}
        currentMemberId={currentMember?.id}
        onNavigate={navigate}
      />
    </div>
  )
}

function KpiCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  badge,
  accentColor,
  loading,
  onClick,
}: {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  label: string
  value: string
  badge?: { text: string; variant: "success" | "warning" | "danger" | "info" }
  accentColor?: string
  loading?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "relative w-full rounded-xl border border-border bg-card px-4 pt-3.5 pb-4 flex flex-col gap-2.5 text-left overflow-hidden transition-all duration-200",
        onClick ? "hover:bg-muted/30 hover:border-border/70 cursor-pointer" : "cursor-default",
      )}
    >
      {accentColor && (
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: accentColor }} />
      )}
      <div className="flex items-start justify-between gap-2">
        <div className={cn("flex items-center justify-center size-9 rounded-lg shrink-0", iconBg)}>
          <span className={iconColor}>{icon}</span>
        </div>
        {badge && <KpiBadge text={badge.text} variant={badge.variant} />}
      </div>
      {loading ? (
        <Loader2 className="size-3.5 text-muted-foreground animate-spin mt-1" />
      ) : (
        <div>
          <p className="text-2xl font-bold font-brand tabular-nums text-foreground leading-none tracking-tight">
            {value}
          </p>
          <p className="text-xs text-muted-foreground leading-tight mt-1.5">{label}</p>
        </div>
      )}
    </button>
  )
}

function KpiBadge({
  text,
  variant,
}: {
  text: string
  variant: "success" | "warning" | "danger" | "info"
}) {
  const styles: Record<string, string> = {
    success: "bg-[#34D144]/10 text-[#34D144] border-[#34D144]/20",
    warning:
      "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    danger:
      "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
    info: "bg-primary/10 text-primary border-primary/20",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded-full border text-2xs font-semibold",
        styles[variant],
      )}
    >
      {text}
    </span>
  )
}

function UrgencyRow({
  demand,
  onNavigate,
}: {
  demand: Demand
  onNavigate: (path: string) => void
}) {
  return (
    <button
      className="group w-full grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_120px_140px_32px] gap-x-4 items-center px-5 py-3.5 hover:bg-muted/30 transition-colors text-left"
      onClick={() => onNavigate(`/comments/${demand.id}`)}
    >
      {/* Title + location */}
      <div className="min-w-0 flex items-center gap-3">
        <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="size-3.5 text-red-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground line-clamp-1">{demand.title}</p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {demand.category && (
              <span className="text-xs text-muted-foreground">{demand.category.name}</span>
            )}
            {demand.neighborhood && (
              <>
                <span className="text-muted-foreground/30 text-xs">·</span>
                <span className="text-xs text-muted-foreground">{demand.neighborhood}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Impacto Popular (apoios) */}
      <div className="hidden sm:flex items-center gap-1.5">
        <ThumbsUp className="size-3 text-muted-foreground" />
        <span className="text-sm font-bold font-brand tabular-nums text-foreground">
          {demand.likesCount}
        </span>
        <span className="text-xs text-muted-foreground">apoios</span>
      </div>

      {/* Status */}
      <div className="hidden sm:flex items-center">
        <DemandStatusBadge status={demand.status} />
      </div>

      {/* Action */}
      <div className="flex items-center justify-end">
        <div className="size-7 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </button>
  )
}

function AssignedDemandsCard({
  demands,
  total,
  isLoading,
  currentMemberId,
  onNavigate,
}: {
  demands: Demand[]
  total: number
  isLoading: boolean
  currentMemberId?: string
  onNavigate: (path: string) => void
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="size-6 rounded-md bg-muted flex items-center justify-center">
            <User className="size-3.5 text-muted-foreground" />
          </div>
          <h2 className="text-sm font-bold font-brand text-foreground">Minhas Demandas</h2>
          {total > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary/10 text-primary text-2xs font-bold tabular-nums">
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
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
          <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
            <ClipboardList className="size-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Nenhuma demanda atribuída</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Quando uma demanda for atribuída a você, aparecerá aqui.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {demands.map((demand, i) => (
            <DemandRow key={demand.id} demand={demand} index={i} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  )
}

function DemandRow({
  demand,
  index,
  onNavigate,
}: {
  demand: Demand
  index: number
  onNavigate: (path: string) => void
}) {
  const stripeClass = demand.priority ? (PRIORITY_STRIPE[demand.priority] ?? "bg-border") : "bg-border"

  return (
    <button
      className="group relative w-full flex items-center gap-3 pl-4 pr-5 py-3.5 hover:bg-muted/30 transition-colors text-left"
      onClick={() => onNavigate(`/comments/${demand.id}`)}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className={cn("absolute left-0 inset-y-0 w-0.5", stripeClass)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground line-clamp-1 leading-snug">{demand.title}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <DemandStatusBadge status={demand.status} />
          {demand.category && (
            <span className="text-xs text-muted-foreground">{demand.category.name}</span>
          )}
          <span className="text-xs text-muted-foreground">{formatDateToNow(demand.createdAt)}</span>
        </div>
      </div>
      {demand.priority && (
        <div className="shrink-0">
          <DemandPriority variant={demand.priority} />
        </div>
      )}
      <ArrowRight className="size-3.5 text-border group-hover:text-muted-foreground transition-colors shrink-0" />
    </button>
  )
}
