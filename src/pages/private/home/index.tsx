import { useGetCabinetMetrics } from "@/api/cabinets/hooks"
import { useGetDemandsByCabinetSlug } from "@/api/demands/hooks"
import { DemandStatusBadge } from "@/components/demand-status-badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useCurrentMember } from "@/hooks/use-current-member"
import { usePageTitle } from "@/hooks/use-page-title"
import { formatDateToNow } from "@/utils/format-date-to-now"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  Plus,
  Sparkles,
  Users,
} from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DemandPriority } from "../demands/components/demand-priority"

export function Home() {
  const { setTitle } = usePageTitle()
  const { user, cabinet } = useAuth()
  const { currentMember } = useCurrentMember()
  const navigate = useNavigate()

  useEffect(() => {
    setTitle({ title: "Dashboard", description: "Visão geral do gabinete" })
  }, [])

  const { data: metrics, isLoading: metricsLoading } = useGetCabinetMetrics(cabinet?.slug)

  const { data: myDemands, isLoading: myDemandsLoading } = useGetDemandsByCabinetSlug({
    slug: cabinet?.slug as string,
    assigneeMemberId: currentMember?.id,
    limit: 5,
    page: 1,
  })

  const myDemandsTotal = myDemands?.meta.total ?? 0
  const myDemandsList = myDemands?.items ?? []

  const firstName = user?.name?.split(" ")[0] ?? "usuário"

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <LayoutDashboard className="size-4 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground">
            Olá, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {cabinet?.name} · visão geral de hoje
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Minhas tarefas"
          value={myDemandsTotal}
          icon={<ClipboardList className="size-4 text-primary" />}
          loading={myDemandsLoading}
          onClick={() =>
            currentMember
              ? navigate(`/demands?assigneeMemberId=${currentMember.id}`)
              : undefined
          }
        />
        <KpiCard
          label="Urgentes abertas"
          value={metrics?.urgent ?? 0}
          icon={<AlertTriangle className="size-4 text-destructive" />}
          loading={metricsLoading}
          accent="destructive"
        />
        <KpiCard
          label="Novas (24h)"
          value={metrics?.new ?? 0}
          icon={<Sparkles className="size-4 text-amber-500" />}
          loading={metricsLoading}
          accent="amber"
        />
        <KpiCard
          label="Resolvidas este mês"
          value={metrics?.resolved ?? 0}
          icon={<CheckCircle2 className="size-4 text-emerald-500" />}
          loading={metricsLoading}
          accent="emerald"
        />
      </div>

      {/* My assigned demands */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <ClipboardList className="size-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Minhas demandas atribuídas</span>
            {myDemandsTotal > 0 && (
              <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary/10 text-primary text-2xs font-bold">
                {myDemandsTotal > 99 ? "99+" : myDemandsTotal}
              </span>
            )}
          </div>
          {currentMember && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => navigate(`/demands?assigneeMemberId=${currentMember.id}`)}
            >
              Ver todas
              <ArrowRight className="size-3" />
            </Button>
          )}
        </div>

        {myDemandsLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-5 text-muted-foreground animate-spin" />
          </div>
        ) : myDemandsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center">
              <ClipboardList className="size-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Nenhuma demanda atribuída</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Quando uma demanda for atribuída a você, ela aparecerá aqui.
            </p>
          </div>
        ) : (
          <div>
            {myDemandsList.map((demand, index) => (
              <div key={demand.id}>
                <button
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors text-left"
                  onClick={() => navigate(`/comments/${demand.id}`)}
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground truncate">
                        {demand.title}
                      </span>
                      <DemandStatusBadge status={demand.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {demand.category && <span>{demand.category.name}</span>}
                      <span>{formatDateToNow(demand.createdAt)}</span>
                    </div>
                  </div>
                  {demand.priority && (
                    <div className="shrink-0 mt-0.5">
                      <DemandPriority variant={demand.priority} />
                    </div>
                  )}
                </button>
                {index < myDemandsList.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold text-foreground">Ações rápidas</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border">
          <QuickAction
            icon={<ClipboardList className="size-4" />}
            label="Ver demandas"
            onClick={() => navigate("/demands")}
          />
          <QuickAction
            icon={<Plus className="size-4" />}
            label="Nova demanda"
            onClick={() => navigate("/demands?new=true")}
          />
          <QuickAction
            icon={<Users className="size-4" />}
            label="Ver equipe"
            onClick={() => navigate("/equipe")}
          />
        </div>
      </div>
    </div>
  )
}

interface KpiCardProps {
  label: string
  value: number
  icon: React.ReactNode
  loading?: boolean
  accent?: "default" | "destructive" | "amber" | "emerald"
  onClick?: () => void
}

function KpiCard({ label, value, icon, loading, accent = "default", onClick }: KpiCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`rounded-xl border border-border bg-card p-4 flex flex-col gap-3 text-left transition-colors ${onClick ? "hover:bg-muted/50 cursor-pointer" : "cursor-default"}`}
    >
      <div className="flex items-center justify-between">
        <div className={`size-8 rounded-lg flex items-center justify-center ${
          accent === "destructive" ? "bg-destructive/10" :
          accent === "amber" ? "bg-amber-500/10" :
          accent === "emerald" ? "bg-emerald-500/10" :
          "bg-primary/10"
        }`}>
          {icon}
        </div>
      </div>
      {loading ? (
        <Loader2 className="size-4 text-muted-foreground animate-spin" />
      ) : (
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      )}
    </button>
  )
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-card flex items-center gap-2.5 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left"
    >
      <div className="size-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
        {icon}
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <ArrowRight className="size-3.5 text-muted-foreground ml-auto shrink-0" />
    </button>
  )
}
