import { useGetCabinetReport } from "@/api/demands/hooks"
import type { CabinetReport, DemandStatus as DemandStatusType } from "@/api/demands/types"
import { DemandStatus } from "@/api/demands/types"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useAuth } from "@/hooks/use-auth"
import { usePageTitle } from "@/hooks/use-page-title"
import { cn } from "@/lib/utils"
import { format, subDays, subMonths, subYears } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  CheckCircle2,
  Download,
  FileDown,
  Loader2,
  BarChart3,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

const STATUS_CONFIG: Record<DemandStatusType, { label: string; color: string; bg: string }> = {
  [DemandStatus.SUBMITTED]:   { label: "Enviada",       color: "#94a3b8", bg: "bg-slate-400" },
  [DemandStatus.IN_ANALYSIS]: { label: "Em análise",    color: "#3b82f6", bg: "bg-blue-500" },
  [DemandStatus.IN_PROGRESS]: { label: "Em progresso",  color: "#f59e0b", bg: "bg-amber-500" },
  [DemandStatus.RESOLVED]:    { label: "Finalizada",    color: "#22c55e", bg: "bg-emerald-500" },
  [DemandStatus.REJECTED]:    { label: "Rejeitada",     color: "#ef4444", bg: "bg-red-500" },
  [DemandStatus.CANCELED]:    { label: "Cancelada",     color: "#a1a1aa", bg: "bg-zinc-400" },
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  URGENT: { label: "Urgente", color: "#ef4444", bg: "bg-red-500" },
  HIGH:   { label: "Alta",    color: "#f97316", bg: "bg-orange-500" },
  MEDIUM: { label: "Média",   color: "#0058F3", bg: "bg-primary" },
  LOW:    { label: "Baixa",   color: "#94a3b8", bg: "bg-slate-400" },
}

type Period = "7d" | "30d" | "90d" | "6m" | "1a"

const PERIODS: { key: Period; label: string }[] = [
  { key: "7d",  label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "90d", label: "90 dias" },
  { key: "6m",  label: "6 meses" },
  { key: "1a",  label: "1 ano" },
]

function getPeriodDates(period: Period): { startDate: string; endDate: string } {
  const end = new Date()
  let start: Date

  if (period === "7d")  start = subDays(end, 7)
  else if (period === "30d") start = subDays(end, 30)
  else if (period === "90d") start = subDays(end, 90)
  else if (period === "6m")  start = subMonths(end, 6)
  else start = subYears(end, 1)

  return {
    startDate: format(start, "yyyy-MM-dd"),
    endDate: format(end, "yyyy-MM-dd"),
  }
}

function formatPeriodLabel(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  return `${format(s, "dd 'de' MMM 'de' yyyy", { locale: ptBR })} – ${format(e, "dd 'de' MMM 'de' yyyy", { locale: ptBR })}`
}

function formatShortDate(dateStr: string) {
  return format(new Date(dateStr + "T12:00:00"), "dd/MM", { locale: ptBR })
}

function exportCSV(report: CabinetReport, cabinetName: string) {
  const lines: string[][] = [
    [`Relatório de Demandas – ${cabinetName}`],
    [`Período`, `${report.period.start.split("T")[0]} a ${report.period.end.split("T")[0]}`],
    [],
    ["RESUMO"],
    ["Indicador", "Valor"],
    ["Total no período", String(report.summary.totalInPeriod)],
    ["Resolvidas", String(report.summary.resolvedInPeriod)],
    ["Taxa de resolução", `${report.summary.resolutionRate}%`],
    ["Em aberto", String(report.summary.openCount)],
    ["Rejeitadas", String(report.summary.rejectedCount)],
    ["Canceladas", String(report.summary.canceledCount)],
    ["Resultados registrados", String(report.resultsInPeriod)],
    [],
    ["DISTRIBUIÇÃO POR STATUS"],
    ["Status", "Quantidade", "Percentual"],
    ...report.byStatus.map(s => [STATUS_CONFIG[s.status]?.label ?? s.status, String(s.count), `${s.percentage}%`]),
    [],
    ["DISTRIBUIÇÃO POR PRIORIDADE"],
    ["Prioridade", "Quantidade", "Percentual"],
    ...report.byPriority.map(p => [PRIORITY_CONFIG[p.priority]?.label ?? p.priority, String(p.count), `${p.percentage}%`]),
    [],
    ["CATEGORIAS"],
    ["Categoria", "Quantidade", "Percentual"],
    ...report.byCategory.map(c => [c.name, String(c.count), `${c.percentage}%`]),
    [],
    ["BAIRROS COM MAIS DEMANDAS"],
    ["Bairro", "Quantidade"],
    ...report.byNeighborhood.map(n => [n.neighborhood, String(n.count)]),
    [],
    ["TENDÊNCIA DIÁRIA"],
    ["Data", "Recebidas", "Resolvidas"],
    ...report.trend.map(t => [t.date, String(t.created), String(t.resolved)]),
  ]

  const csv = lines.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n")
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `relatorio-${cabinetName.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function Reports() {
  const { setTitle } = usePageTitle()
  const { cabinet } = useAuth()

  useEffect(() => {
    setTitle({ title: "Relatórios" })
  }, [setTitle])
  const [period, setPeriod] = useState<Period>("30d")
  const dates = useMemo(() => getPeriodDates(period), [period])

  const { data: report, isLoading } = useGetCabinetReport({
    slug: cabinet?.slug ?? "",
    startDate: dates.startDate,
    endDate: dates.endDate,
    enabled: !!cabinet?.slug,
  })

  const trendData = useMemo(() => {
    if (!report) return []
    const days = report.trend.length
    if (days <= 60) return report.trend.map(t => ({ ...t, label: formatShortDate(t.date) }))
    if (days <= 180) {
      const weekly: typeof report.trend = []
      for (let i = 0; i < days; i += 7) {
        const slice = report.trend.slice(i, i + 7)
        weekly.push({
          date: slice[0].date,
          created: slice.reduce((s, d) => s + d.created, 0),
          resolved: slice.reduce((s, d) => s + d.resolved, 0),
        })
      }
      return weekly.map(t => ({ ...t, label: formatShortDate(t.date) }))
    }
    const monthly: typeof report.trend = []
    for (let i = 0; i < days; i += 30) {
      const slice = report.trend.slice(i, i + 30)
      monthly.push({
        date: slice[0].date,
        created: slice.reduce((s, d) => s + d.created, 0),
        resolved: slice.reduce((s, d) => s + d.resolved, 0),
      })
    }
    return monthly.map(t => ({
      ...t,
      label: format(new Date(t.date + "T12:00:00"), "MMM/yy", { locale: ptBR }),
    }))
  }, [report])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Relatórios</h1>
          {report && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatPeriodLabel(report.period.start, report.period.end)}
            </p>
          )}
        </div>
        {report && (
          <div className="report-controls flex items-center gap-2">
            <button
              onClick={() => exportCSV(report, cabinet?.name ?? "gabinete")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors shrink-0"
            >
              <Download className="size-3.5" />
              CSV
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors shrink-0"
            >
              <FileDown className="size-3.5" />
              PDF
            </button>
          </div>
        )}
      </div>

      <div className="report-controls inline-flex items-center rounded-lg border border-border bg-muted/30 p-0.5 gap-0.5">
        {PERIODS.map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              period === p.key
                ? "bg-background text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {report && !isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
            <KpiCard label="Recebidas" value={report.summary.totalInPeriod} />
            <KpiCard
              label="Resolvidas"
              value={report.summary.resolvedInPeriod}
              sub={report.summary.resolutionRate > 0 ? `${report.summary.resolutionRate}% do total` : undefined}
              accent="emerald"
            />
            <KpiCard
              label="Em aberto"
              value={report.summary.openCount}
              accent={report.summary.openCount > 0 ? "amber" : undefined}
            />
            <KpiCard
              label="Resultados"
              value={report.resultsInPeriod}
              icon={<CheckCircle2 className="size-3.5 text-emerald-500" />}
            />
          </div>

          {report.byStatus.length > 0 && (
            <ReportSection number="01" title="Distribuição por status">
              <div className="space-y-2.5">
                {report.byStatus
                  .sort((a, b) => b.count - a.count)
                  .map(s => {
                    const cfg = STATUS_CONFIG[s.status]
                    return (
                      <DistBar
                        key={s.status}
                        label={cfg?.label ?? s.status}
                        count={s.count}
                        percentage={s.percentage}
                        color={cfg?.bg ?? "bg-muted-foreground/40"}
                        total={report.summary.totalInPeriod}
                      />
                    )
                  })}
              </div>
            </ReportSection>
          )}

          {report.byPriority.length > 0 && (
            <ReportSection number="02" title="Distribuição por prioridade">
              <div className="space-y-2.5">
                {report.byPriority
                  .sort((a, b) => b.count - a.count)
                  .map(p => {
                    const cfg = PRIORITY_CONFIG[p.priority]
                    return (
                      <DistBar
                        key={p.priority}
                        label={cfg?.label ?? p.priority}
                        count={p.count}
                        percentage={p.percentage}
                        color={cfg?.bg ?? "bg-muted-foreground/40"}
                        total={report.summary.totalInPeriod}
                      />
                    )
                  })}
              </div>
            </ReportSection>
          )}

          {report.byCategory.length > 0 && (
            <ReportSection number="03" title="Por categoria">
              <div className="space-y-2">
                {report.byCategory.map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="text-xs tabular-nums text-muted-foreground/50 w-4 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm text-foreground truncate">{c.name}</span>
                        <span className="text-xs tabular-nums text-muted-foreground shrink-0">
                          {c.count} · {c.percentage}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/70 transition-all duration-500"
                          style={{ width: `${c.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ReportSection>
          )}

          {report.byNeighborhood.length > 0 && (
            <ReportSection number="04" title="Bairros com mais demandas">
              <div className="space-y-1.5">
                {report.byNeighborhood.map((n, i) => {
                  const max = report.byNeighborhood[0].count
                  return (
                    <div key={n.neighborhood} className="flex items-center gap-3">
                      <span className="text-xs tabular-nums text-muted-foreground/50 w-4 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm text-foreground truncate">{n.neighborhood}</span>
                          <span className="text-xs tabular-nums text-muted-foreground shrink-0">{n.count}</span>
                        </div>
                        <div className="h-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-muted-foreground/30 transition-all duration-500"
                            style={{ width: `${Math.round((n.count / max) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ReportSection>
          )}

          {trendData.length > 0 && (
            <ReportSection number="05" title="Volume ao longo do tempo" icon={<BarChart3 className="size-3.5" />}>
              <div className="flex items-center gap-4 mb-4">
                <LegendDot color="bg-primary" label="Recebidas" />
                <LegendDot color="bg-emerald-500" label="Resolvidas" />
              </div>
              <ChartContainer
                config={{
                  created:  { label: "Recebidas",  color: "#0058F3" },
                  resolved: { label: "Resolvidas", color: "#22c55e" },
                }}
                className="h-52 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                    <defs>
                      <linearGradient id="grad-created" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#0058F3" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0058F3" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="grad-resolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.6} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null
                        return (
                          <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-md text-xs">
                            <p className="font-medium text-foreground mb-1">{label}</p>
                            {payload.map((p, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full shrink-0" style={{ background: p.color }} />
                                <span className="text-muted-foreground">{p.name}:</span>
                                <span className="font-medium text-foreground">{p.value}</span>
                              </div>
                            ))}
                          </div>
                        )
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="created"
                      name="Recebidas"
                      stroke="#0058F3"
                      strokeWidth={2}
                      fill="url(#grad-created)"
                      dot={false}
                      activeDot={{ r: 3, fill: "#0058F3" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      name="Resolvidas"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fill="url(#grad-resolved)"
                      dot={false}
                      activeDot={{ r: 3, fill: "#22c55e" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </ReportSection>
          )}

          {report.summary.totalInPeriod === 0 && (
            <div className="rounded-xl border border-border bg-muted/20 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">Nenhuma demanda no período selecionado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function KpiCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string
  value: number
  sub?: string
  accent?: "emerald" | "amber"
  icon?: React.ReactNode
}) {
  return (
    <div className="bg-background px-4 py-4 flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span
        className={cn(
          "text-2xl font-semibold tabular-nums leading-none",
          accent === "emerald" && "text-emerald-600 dark:text-emerald-400",
          accent === "amber" && value > 0 && "text-amber-600 dark:text-amber-400",
        )}
      >
        {value.toLocaleString("pt-BR")}
      </span>
      {sub && <span className="text-xs text-muted-foreground/70 leading-none">{sub}</span>}
    </div>
  )
}

function ReportSection({
  number,
  title,
  icon,
  children,
}: {
  number: string
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold tabular-nums text-muted-foreground/40">{number}</span>
        {icon}
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function DistBar({
  label,
  count,
  percentage,
  color,
  total,
}: {
  label: string
  count: number
  percentage: number
  color: string
  total: number
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0">
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: total > 0 ? `${percentage}%` : "0%" }}
        />
      </div>
      <div className="w-16 text-right shrink-0">
        <span className="text-xs tabular-nums text-muted-foreground">
          {count} <span className="text-muted-foreground/50">({percentage}%)</span>
        </span>
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("size-2 rounded-full shrink-0", color)} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
