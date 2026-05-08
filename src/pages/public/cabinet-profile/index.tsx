import type { CabinetMetrics } from "@/api/cabinets/types"
import { useGetCabinetBySlug, useGetCabinetMembers, useGetCabinetMetrics } from "@/api/cabinets/hooks"
import { useGetDemandsByCabinetSlug } from "@/api/demands/hooks"
import { Loading } from "@/components/loading"
import { Post } from "@/components/post"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names"
import { Building2, ChevronDown, FileText, LogIn, LogOut, Mail, Settings } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import Logo from "@/assets/logo.png"

// ─── Accountability bar (signature element) ──────────────────────────────────

function AccountabilityBar({ metrics }: { metrics: CabinetMetrics | undefined }) {
  if (!metrics?.statusCounts) return null

  const {
    RESOLVED = 0,
    IN_PROGRESS = 0,
    IN_ANALYSIS = 0,
    SUBMITTED = 0,
    REJECTED = 0,
    CANCELED = 0,
  } = metrics.statusCounts

  const total = RESOLVED + IN_PROGRESS + IN_ANALYSIS + SUBMITTED + REJECTED + CANCELED
  if (total === 0) return null

  const working = IN_PROGRESS + IN_ANALYSIS
  const resolvedPct = (RESOLVED / total) * 100
  const workingPct = (working / total) * 100

  const resolvedColor =
    resolvedPct >= 60
      ? "#059669"
      : resolvedPct >= 30
      ? "#d97706"
      : "#94a3b8"

  return (
    <div className="mt-5 pt-5 border-t border-border/40">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xs font-semibold text-muted-foreground/70 uppercase tracking-widest">
          Resolutividade do mandato
        </span>
        <span className="text-xs font-bold tabular-nums" style={{ color: resolvedColor }}>
          {Math.round(resolvedPct)}% concluídas
        </span>
      </div>

      <div className="relative h-2 w-full rounded-full bg-slate-100 dark:bg-muted overflow-hidden">
        {RESOLVED > 0 && (
          <div
            className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${resolvedPct}%` }}
          />
        )}
        {working > 0 && (
          <div
            className="absolute top-0 h-full bg-amber-400 transition-all duration-700"
            style={{ left: `${resolvedPct}%`, width: `${workingPct}%` }}
          />
        )}
      </div>

      <div className="flex items-center gap-5 mt-2.5">
        <LegendDot className="bg-emerald-500" label={`${RESOLVED} resolvidas`} />
        <LegendDot className="bg-amber-400" label={`${working} em andamento`} />
        <LegendDot className="bg-slate-200 dark:bg-muted-foreground/30" label={`${SUBMITTED + REJECTED + CANCELED} outras`} />
      </div>
    </div>
  )
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-2xs text-muted-foreground">
      <span className={cn("size-1.5 rounded-full shrink-0", className)} />
      {label}
    </span>
  )
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex-1 text-center py-1">
      <p className="text-xl font-bold tabular-nums text-foreground leading-none">
        {value.toLocaleString("pt-BR")}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

function StatDivider() {
  return <div className="w-px h-8 bg-border/50 shrink-0" />
}

// ─── Header ──────────────────────────────────────────────────────────────────

function ProfileHeader() {
  const { isAuthenticated, user, logout } = useAuth()

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="shrink-0">
          <img src={Logo} alt="Gabinete Digital" className="w-24 sm:w-32" />
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-xs hidden sm:flex">
              <Link to="/home">Ir para o app</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1 p-1.5 rounded-full hover:bg-muted transition-colors focus:outline-none"
                >
                  <Avatar size="default">
                    <AvatarFallback className="bg-primary text-white font-semibold text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mt-1 rounded-xl shadow-md">
                <div className="px-3 py-2.5 border-b border-border/50">
                  <p className="text-sm font-semibold truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <DropdownMenuItem asChild className="gap-2 rounded-lg">
                    <Link to="/settings">
                      <Settings className="size-4" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="gap-2 rounded-lg text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                  >
                    <LogOut className="size-4" />
                    Sair
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Button asChild variant="ghost" size="sm" className="text-xs gap-1.5">
              <Link to="/login">
                <LogIn className="size-3.5" />
                Entrar
              </Link>
            </Button>
            <Button asChild size="sm" className="text-xs hidden sm:flex">
              <Link to="/login">Registrar demanda</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function PublicCabinetProfile() {
  const { slug } = useParams() as { slug: string }
  const { data: cabinet, isLoading } = useGetCabinetBySlug(slug)
  const { data: metrics } = useGetCabinetMetrics(slug)
  const { data: members } = useGetCabinetMembers(slug)
  const { data: demandsData, isLoading: isLoadingDemands } = useGetDemandsByCabinetSlug({
    slug,
    page: 1,
    limit: 20,
  })

  const demands = demandsData?.items ?? []
  const membersList = members ?? []

  if (isLoading) {
    return (
      <>
        <ProfileHeader />
        <div className="flex justify-center items-center min-h-screen">
          <Loading className="text-primary size-6" />
        </div>
      </>
    )
  }

  if (!cabinet) {
    return (
      <>
        <ProfileHeader />
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
          <div className="size-14 rounded-2xl bg-muted flex items-center justify-center">
            <Building2 className="size-7 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Gabinete não encontrado</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              O gabinete{" "}
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">@{slug}</span>{" "}
              não existe ou foi desativado.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/gabinetes">Ver todos os gabinetes</Link>
          </Button>
        </div>
      </>
    )
  }

  const totalDemands = metrics?.total ?? cabinet.demand_count ?? 0
  const resolvedCount = metrics?.statusCounts?.RESOLVED ?? cabinet.resolved_count ?? 0
  const inProgressCount = metrics?.statusCounts?.IN_PROGRESS ?? cabinet.in_progress_count ?? 0

  return (
    <>
      <ProfileHeader />

      <div className="min-h-screen bg-muted/20 pt-14">
        {/* ── Banner ── */}
        <div
          className="relative w-full h-44 sm:h-52 overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, #001B69 0%, #0038B8 40%, #0058F3 75%, #1a6ef5 100%)",
          }}
        >
          {/* Diagonal line pattern — institutional letterhead feel */}
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="diag"
                x="0"
                y="0"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(30)"
              >
                <line x1="0" y1="0" x2="0" y2="48" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diag)" />
          </svg>
          {/* Radial glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 70% at 25% 60%, rgba(255,255,255,0.07) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* ── Avatar + follow row ── */}
          <div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-4">
            <Avatar
              className="size-24 sm:size-28 shrink-0 ring-[3px] ring-background shadow-xl"
            >
              <AvatarImage src={cabinet.avatarUrl} />
              <AvatarFallback className="bg-primary text-white font-bold text-2xl sm:text-3xl">
                {getFirstLettersFromNames(cabinet.name)}
              </AvatarFallback>
            </Avatar>
            <div className="mb-1.5">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="text-xs font-semibold rounded-full px-5 bg-background border-foreground/20 hover:bg-muted/60 shadow-sm"
              >
                <Link to="/login">Acompanhar</Link>
              </Button>
            </div>
          </div>

          {/* ── Profile card ── */}
          <div className="bg-background rounded-2xl border border-border/40 shadow-sm px-5 sm:px-6 pb-6 pt-5">
            {/* Name & handle */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight">
                {cabinet.name}
              </h1>
              <p className="text-sm text-muted-foreground font-mono mt-0.5 tracking-tight">
                @{cabinet.slug}
              </p>
            </div>

            {/* Bio */}
            {cabinet.description && (
              <p className="text-sm text-foreground/75 mt-3 leading-relaxed">
                {cabinet.description}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3">
              {cabinet.email && (
                <a
                  href={`mailto:${cabinet.email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="size-3.5 shrink-0" />
                  {cabinet.email}
                </a>
              )}
              {cabinet.score > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
                  {cabinet.score.toLocaleString("pt-BR")} pontos
                </span>
              )}
            </div>

            {/* Accountability bar */}
            <AccountabilityBar metrics={metrics} />

            {/* Stats strip */}
            <div className="flex items-center mt-5 pt-5 border-t border-border/40">
              <StatItem value={totalDemands} label="Demandas" />
              <StatDivider />
              <StatItem value={resolvedCount} label="Resolvidas" />
              <StatDivider />
              <StatItem value={inProgressCount} label="Em progresso" />
              <StatDivider />
              <StatItem value={membersList.length} label="Membros" />
            </div>
          </div>

          {/* ── Team ── */}
          {membersList.length > 0 && (
            <div className="mt-2.5 bg-background rounded-2xl border border-border/40 shadow-sm px-5 sm:px-6 py-4">
              <p className="text-2xs font-semibold text-muted-foreground/70 uppercase tracking-widest mb-3">
                Equipe
              </p>
              <div className="flex flex-wrap gap-2">
                {membersList.slice(0, 10).map((member) => (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full border",
                      member.role === "OWNER"
                        ? "border-primary/20 bg-primary/4"
                        : "border-border/50 bg-muted/30",
                    )}
                  >
                    <Avatar className="size-5 shrink-0">
                      <AvatarImage src={member.userAvatarUrl ?? undefined} />
                      <AvatarFallback
                        className={cn(
                          "text-2xs font-bold",
                          member.role === "OWNER"
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {getFirstLettersFromNames(member.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground/80 truncate max-w-25">
                      {member.userName}
                    </span>
                    {member.role === "OWNER" && (
                      <span className="text-2xs text-primary/80 font-semibold shrink-0">
                        responsável
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Demands feed ── */}
          <div className="mt-2.5 mb-16">
            <div className="bg-background rounded-2xl border border-border/40 shadow-sm">
              {/* Section header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">Demandas públicas</h2>
                  {!isLoadingDemands && (
                    <span className="text-2xs font-semibold text-muted-foreground bg-muted rounded-full px-2 py-0.5 tabular-nums">
                      {demandsData?.meta?.total ?? demands.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Feed */}
              <div className="p-4 sm:p-5">
                {isLoadingDemands ? (
                  <div className="flex justify-center py-10">
                    <Loading className="text-primary size-5" />
                  </div>
                ) : demands.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                    <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                      <FileText className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Sem demandas públicas</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Este gabinete ainda não registrou demandas.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {demands.map((demand) => (
                      <Post key={demand.id} demand={demand} showStatus />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
