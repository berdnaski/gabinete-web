import type { CabinetMetrics, Cabinet } from "@/api/cabinets/types"
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
import {
  Building2,
  ChevronDown,
  ExternalLink,
  Facebook,
  FileText,
  Instagram,
  LogIn,
  LogOut,
  Mail,
  MessageSquarePlus,
  Settings,
  ShieldCheck,
  Twitter,
} from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import Logo from "@/assets/logo.png"
import { PublicDemandForm } from "./public-demand-form"

// â”€â”€â”€ Accountability bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function AccountabilityBar({
  metrics,
  accent,
}: {
  metrics: CabinetMetrics | undefined
  accent: string
}) {
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
    resolvedPct >= 60 ? "#059669" : resolvedPct >= 30 ? "#d97706" : "#94a3b8"

  return (
    <div className="mt-5 pt-5 border-t border-border/40">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xs font-semibold text-muted-foreground/70 uppercase tracking-widest">
          Resolutividade do mandato
        </span>
        <span className="text-xs font-bold tabular-nums" style={{ color: resolvedColor }}>
          {Math.round(resolvedPct)}% concluÃ­das
        </span>
      </div>

      <div className="relative h-2 w-full rounded-full bg-slate-100 dark:bg-muted overflow-hidden">
        {RESOLVED > 0 && (
          <div
            className="absolute left-0 top-0 h-full transition-all duration-700"
            style={{ width: `${resolvedPct}%`, backgroundColor: accent }}
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
        <LegendDot color={accent} label={`${RESOLVED} resolvidas`} />
        <LegendDot className="bg-amber-400" label={`${working} em andamento`} />
        <LegendDot
          className="bg-slate-200 dark:bg-muted-foreground/30"
          label={`${SUBMITTED + REJECTED + CANCELED} outras`}
        />
      </div>
    </div>
  )
}

function LegendDot({
  className,
  color,
  label,
}: {
  className?: string
  color?: string
  label: string
}) {
  return (
    <span className="flex items-center gap-1.5 text-2xs text-muted-foreground">
      <span
        className={cn("size-1.5 rounded-full shrink-0", className)}
        style={color ? { backgroundColor: color } : undefined}
      />
      {label}
    </span>
  )
}

// â”€â”€â”€ Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ Transparency score badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TransparencyBadge({ score, accent }: { score: number; accent: string }) {
  if (score === 0) return null
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold"
      style={{ borderColor: `${accent}40`, color: accent, backgroundColor: `${accent}10` }}
    >
      <ShieldCheck className="size-3.5 shrink-0" />
      {score}% de resolutividade
    </div>
  )
}

// â”€â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ProfileHeader({ accent }: { accent: string }) {
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
          <img src={Logo} alt="Gabinete App" className="w-24 sm:w-32" />
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
                    <AvatarImage src={user?.avatarUrl ?? undefined} />
                    <AvatarFallback
                      className="text-white font-semibold text-xs"
                      style={{ backgroundColor: accent }}
                    >
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
                      ConfiguraÃ§Ãµes
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
            <Button
              asChild
              size="sm"
              className="text-xs hidden sm:flex"
              style={{ backgroundColor: accent }}
            >
              <Link to="/sign-up">Criar conta</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

// â”€â”€â”€ Banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CabinetBanner({ cabinet, accent }: { cabinet: Cabinet; accent: string }) {
  if (cabinet.bannerUrl) {
    return (
      <div className="relative w-full h-44 sm:h-56 md:h-72 lg:h-80 overflow-hidden">
        <img
          src={cabinet.bannerUrl}
          alt={`Banner de ${cabinet.name}`}
          className="w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3) 100%)",
          }}
        />
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-44 sm:h-56 md:h-72 lg:h-80 overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${accent}dd 0%, ${accent} 60%, ${accent}bb 100%)`,
      }}
    >
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
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="48"
              stroke="white"
              strokeWidth="0.5"
              strokeOpacity="0.12"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diag)" />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 25% 60%, rgba(255,255,255,0.07) 0%, transparent 70%)",
        }}
      />
    </div>
  )
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  const [demandFormOpen, setDemandFormOpen] = useState(false)

  const demands = demandsData?.items ?? []
  const membersList = members ?? []
  const accent = cabinet?.accentColor ?? "#0058F3"

  if (isLoading) {
    return (
      <>
        <ProfileHeader accent={accent} />
        <div className="flex justify-center items-center min-h-screen">
          <Loading className="text-primary size-6" />
        </div>
      </>
    )
  }

  if (!cabinet) {
    return (
      <>
        <ProfileHeader accent={accent} />
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
          <div className="size-14 rounded-2xl bg-muted flex items-center justify-center">
            <Building2 className="size-7 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Gabinete nÃ£o encontrado</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              O gabinete{" "}
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">@{slug}</span>{" "}
              nÃ£o existe ou foi desativado.
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
  const score = cabinet.transparencyScore ?? 0

  return (
    <>
      <ProfileHeader accent={accent} />

      <div className="min-h-screen bg-muted/20 pt-14">
        {/* â”€â”€ Banner â”€â”€ */}
        <CabinetBanner cabinet={cabinet} accent={accent} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* â”€â”€ Avatar + CTA row â”€â”€ */}
          <div className="flex items-end justify-between -mt-12 sm:-mt-14 md:-mt-16 mb-4">
            <Avatar className="size-24 sm:size-28 shrink-0 ring-[3px] ring-background shadow-xl">
              <AvatarImage src={cabinet.logoUrl ?? cabinet.avatarUrl ?? undefined} className={cabinet.logoUrl ? "object-contain p-1 bg-white" : "object-cover"} />
              <AvatarFallback
                className="text-white font-bold text-2xl sm:text-3xl"
                style={{ backgroundColor: accent }}
              >
                {getFirstLettersFromNames(cabinet.name)}
              </AvatarFallback>
            </Avatar>

            <div className="mb-1.5 flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setDemandFormOpen(true)}
                className="text-xs font-semibold gap-1.5"
                style={{ backgroundColor: accent, borderColor: accent }}
              >
                <MessageSquarePlus className="size-3.5" />
                Enviar demanda
              </Button>
            </div>
          </div>

          {/* â”€â”€ Profile card â”€â”€ */}
          <div className="bg-background rounded-2xl border border-border/40 shadow-sm px-5 sm:px-6 pb-6 pt-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight">
                {cabinet.name}
              </h1>
              <p className="text-sm text-muted-foreground font-mono mt-0.5 tracking-tight">
                @{cabinet.slug}
              </p>
              {cabinet.tagline && (
                <p className="text-sm font-medium mt-1.5" style={{ color: accent }}>
                  {cabinet.tagline}
                </p>
              )}
            </div>

            {cabinet.description && (
              <p className="text-sm text-foreground/75 mt-3 leading-relaxed">
                {cabinet.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
              {cabinet.email && (
                <a
                  href={`mailto:${cabinet.email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="size-3.5 shrink-0" />
                  {cabinet.email}
                </a>
              )}
              {cabinet.websiteUrl && (
                <a
                  href={cabinet.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="size-3.5 shrink-0" />
                  Site oficial
                </a>
              )}
              <TransparencyBadge score={score} accent={accent} />
            </div>

            {(cabinet.instagramUrl || cabinet.facebookUrl || cabinet.twitterUrl) && (
              <div className="flex items-center gap-2 mt-2">
                {cabinet.instagramUrl && (
                  <a
                    href={cabinet.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-7 rounded-full flex items-center justify-center border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="size-3.5" />
                  </a>
                )}
                {cabinet.facebookUrl && (
                  <a
                    href={cabinet.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-7 rounded-full flex items-center justify-center border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="size-3.5" />
                  </a>
                )}
                {cabinet.twitterUrl && (
                  <a
                    href={cabinet.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-7 rounded-full flex items-center justify-center border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    aria-label="X / Twitter"
                  >
                    <Twitter className="size-3.5" />
                  </a>
                )}
              </div>
            )}

            <AccountabilityBar metrics={metrics} accent={accent} />

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

          {/* â”€â”€ Team â”€â”€ */}
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
                        ? "border-border/50 bg-muted/20"
                        : "border-border/40 bg-muted/10",
                    )}
                    style={
                      member.role === "OWNER"
                        ? { borderColor: `${accent}30`, backgroundColor: `${accent}08` }
                        : undefined
                    }
                  >
                    <Avatar className="size-5 shrink-0">
                      <AvatarImage src={member.userAvatarUrl ?? undefined} />
                      <AvatarFallback
                        className={cn("text-2xs font-bold")}
                        style={
                          member.role === "OWNER"
                            ? { backgroundColor: accent, color: "#fff" }
                            : undefined
                        }
                      >
                        {getFirstLettersFromNames(member.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground/80 truncate max-w-25">
                      {member.userName}
                    </span>
                    {member.role === "OWNER" && (
                      <span
                        className="text-2xs font-semibold shrink-0"
                        style={{ color: accent }}
                      >
                        responsÃ¡vel
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* â”€â”€ Demands feed â”€â”€ */}
          <div className="mt-2.5 mb-16">
            <div className="bg-background rounded-2xl border border-border/40 shadow-sm">
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">Demandas pÃºblicas</h2>
                  {!isLoadingDemands && (
                    <span className="text-2xs font-semibold text-muted-foreground bg-muted rounded-full px-2 py-0.5 tabular-nums">
                      {demandsData?.meta?.total ?? demands.length}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1.5 h-7 px-3"
                  onClick={() => setDemandFormOpen(true)}
                >
                  <MessageSquarePlus className="size-3" />
                  Nova demanda
                </Button>
              </div>

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
                      <p className="text-sm font-semibold text-foreground">Sem demandas pÃºblicas</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Este gabinete ainda nÃ£o registrou demandas.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs mt-1"
                      onClick={() => setDemandFormOpen(true)}
                    >
                      Registrar primeira demanda
                    </Button>
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

      {/* â”€â”€ Demand form modal â”€â”€ */}
      <PublicDemandForm
        open={demandFormOpen}
        onOpenChange={setDemandFormOpen}
        cabinet={cabinet}
        accent={accent}
      />
    </>
  )
}

