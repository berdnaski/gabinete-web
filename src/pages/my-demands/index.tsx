import { useGetMyDemands, useGetMyDemandsSummary } from "@/api/demands/hooks"
import { useAuth } from "@/hooks/use-auth"
import { usePageTitle } from "@/hooks/use-page-title"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  ClipboardList,
  Loader2,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { Link } from "react-router-dom"
import { ActivityChart } from "./components/activity-chart"
import { RecentDemands } from "./components/recent-demands"
import { ResolutionRing } from "./components/resolution-ring"
import { StatusBreakdown } from "./components/status-breakdown"

function SectionCard({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}
      style={style}
    >
      {children}
    </div>
  )
}

function CardHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
      <Icon className="size-3.5 text-muted-foreground shrink-0" />
      <span className="text-xs font-semibold text-foreground">{title}</span>
      {subtitle && <span className="text-xs text-muted-foreground ml-auto">{subtitle}</span>}
    </div>
  )
}

function StatTile({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  accent?: "emerald" | "amber" | "blue"
}) {
  const accentClass = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    blue: "text-primary",
  }

  return (
    <div className="flex flex-col gap-0.5 px-4 py-3.5 border-b border-border last:border-b-0">
      <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className={cn("text-2xl font-bold tabular-nums leading-none mt-0.5", accent ? accentClass[accent] : "text-foreground")}>
        {value}
      </span>
      {sub && <span className="text-xs text-muted-foreground leading-tight mt-0.5">{sub}</span>}
    </div>
  )
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-muted/60", className)} />
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 flex flex-col items-center gap-3">
          <SkeletonBlock className="size-36 rounded-full" />
          <SkeletonBlock className="h-3 w-32" />
        </div>
        <div className="md:col-span-3 rounded-xl border border-border bg-card flex flex-col">
          {[0, 1, 2].map((i) => (
            <div key={i} className="px-4 py-3.5 border-b border-border last:border-b-0 flex flex-col gap-1.5">
              <SkeletonBlock className="h-2 w-20" />
              <SkeletonBlock className="h-5 w-10" />
              <SkeletonBlock className="h-2 w-28" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card">
            <div className="h-10 border-b border-border px-4 flex items-center">
              <SkeletonBlock className="h-3 w-24" />
            </div>
            <div className="p-4">
              <SkeletonBlock className="h-28 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MyDemands() {
  const { user } = useAuth()
  const { data: summary, isLoading: isLoadingSummary } = useGetMyDemandsSummary()
  const { data: demandsData, isLoading: isLoadingDemands } = useGetMyDemands({ limit: 8 })

  usePageTitle("Minhas Demandas")

  const firstName = user?.name?.split(" ")[0] ?? "Cidadão"
  const recentDemands = demandsData?.pages[0]?.items ?? []

  const resolvedCount = summary?.statusBreakdown.find((s) => s.status === "RESOLVED")?.count ?? 0
  const activeCount =
    (summary?.statusBreakdown.find((s) => s.status === "IN_ANALYSIS")?.count ?? 0) +
    (summary?.statusBreakdown.find((s) => s.status === "IN_PROGRESS")?.count ?? 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold text-foreground">Minhas demandas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Olá,{" "}
            <span className="font-medium text-foreground">{firstName}</span> — acompanhe suas
            solicitações aqui.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <Plus className="size-3" />
          Nova demanda
        </Link>
      </header>

      {isLoadingSummary ? (
        <LoadingSkeleton />
      ) : !summary ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="size-14 rounded-full bg-muted flex items-center justify-center">
            <ClipboardList className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">Erro ao carregar dados</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-fade-slide-in">
            <SectionCard className="md:col-span-2 flex flex-col items-center justify-center p-6 gap-1">
              <ResolutionRing
                rate={summary.resolutionRate}
                resolved={resolvedCount}
                total={summary.totalDemands}
              />
            </SectionCard>

            <SectionCard className="md:col-span-3 flex flex-col">
              <StatTile
                label="Total registradas"
                value={summary.totalDemands}
                sub={summary.totalDemands === 0 ? "Registre sua primeira demanda" : "desde o início"}
                accent="blue"
              />
              <StatTile
                label="Em andamento"
                value={activeCount}
                sub={activeCount > 0 ? "em análise ou em progresso" : "nenhuma em andamento"}
                accent="amber"
              />
              <StatTile
                label="Tempo médio de resolução"
                value={summary.avgDaysToResolve !== null ? `${summary.avgDaysToResolve} dias` : "—"}
                sub={
                  summary.avgDaysToResolve !== null
                    ? "para demandas resolvidas"
                    : "sem demandas resolvidas ainda"
                }
                accent="emerald"
              />
            </SectionCard>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-slide-in"
            style={{ animationDelay: "60ms" }}
          >
            <SectionCard>
              <CardHeader icon={TrendingUp} title="Atividade" subtitle="últimos 6 meses" />
              <div className="p-4">
                {summary.monthlyActivity.every((m) => m.count === 0) ? (
                  <div className="h-28 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Sem atividade neste período</p>
                  </div>
                ) : (
                  <ActivityChart data={summary.monthlyActivity} />
                )}
              </div>
            </SectionCard>

            <SectionCard>
              <CardHeader
                icon={Sparkles}
                title="Por categoria"
                subtitle={`${summary.categoryBreakdown.length} tipo${summary.categoryBreakdown.length !== 1 ? "s" : ""}`}
              />
              <div className="flex flex-col divide-y divide-border">
                {summary.categoryBreakdown.length === 0 ? (
                  <div className="h-28 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Sem dados de categoria</p>
                  </div>
                ) : (
                  summary.categoryBreakdown.map((cat, i) => {
                    const maxCount = summary.categoryBreakdown[0]?.count ?? 1
                    const widthPct = maxCount > 0 ? Math.round((cat.count / maxCount) * 100) : 0
                    return (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                        <span className="text-xs text-muted-foreground truncate w-28 shrink-0">
                          {cat.name}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary/60 transition-all duration-500"
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-foreground tabular-nums w-4 text-right shrink-0">
                          {cat.count}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </SectionCard>
          </div>

          <SectionCard style={{ animationDelay: "120ms" }} className="animate-fade-slide-in">
            <CardHeader icon={BarChart3} title="Distribuição por status" />
            <div className="px-4 py-4">
              <StatusBreakdown data={summary.statusBreakdown} />
            </div>
          </SectionCard>
        </>
      )}

      <SectionCard style={{ animationDelay: "160ms" }} className="animate-fade-slide-in">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
          <ClipboardList className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-semibold text-foreground">Demandas recentes</span>
          <Link
            to="/"
            className="ml-auto text-xs text-primary hover:underline transition-colors"
          >
            Ver feed
          </Link>
        </div>

        {isLoadingDemands ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <RecentDemands demands={recentDemands} />
        )}
      </SectionCard>
    </div>
  )
}
