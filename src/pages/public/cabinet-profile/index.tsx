import { useGetCabinetBySlug, useGetCabinetMembers, useGetCabinetMetrics } from "@/api/cabinets/hooks"
import { useGetDemandsByCabinetSlug } from "@/api/demands/hooks"
import { Loading } from "@/components/loading"
import { Post } from "@/components/post"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names"
import { Building2, FileText, LogIn, Mail } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import Logo from "@/assets/logo.png"

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-lg sm:text-xl font-bold tabular-nums text-foreground leading-none">
        {value.toLocaleString("pt-BR")}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}

function ProfileNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-background/90 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link to="/">
          <img src={Logo} alt="Gabinete" className="h-6 w-auto" />
        </Link>
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
      </div>
    </header>
  )
}

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
        <ProfileNav />
        <div className="flex justify-center items-center min-h-screen">
          <Loading className="text-primary size-6" />
        </div>
      </>
    )
  }

  if (!cabinet) {
    return (
      <>
        <ProfileNav />
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
          <div className="size-16 rounded-2xl bg-muted flex items-center justify-center">
            <Building2 className="size-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Gabinete não encontrado</h1>
            <p className="text-sm text-muted-foreground mt-1">
              O gabinete <span className="font-mono">@{slug}</span> não existe ou pode ter sido desativado.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/gabinetes">Ver todos os gabinetes</Link>
          </Button>
        </div>
      </>
    )
  }

  const inProgressCount = metrics?.statusCounts?.IN_PROGRESS ?? cabinet.in_progress_count ?? 0
  const resolvedCount = metrics?.statusCounts?.RESOLVED ?? cabinet.resolved_count ?? 0
  const totalDemands = metrics?.total ?? cabinet.demand_count ?? 0

  return (
    <>
      <ProfileNav />
      <div className="min-h-screen bg-background pt-12">
        {/* Banner */}
        <div className="w-full h-40 sm:h-52 bg-gradient-to-br from-[#0058F3] via-[#1a6ef5] to-[#60a5fa] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="max-w-2xl mx-auto px-4">
          {/* Avatar + follow row */}
          <div className="flex items-end justify-between -mt-12 sm:-mt-14">
            <Avatar
              className={cn(
                "size-24 sm:size-28 shrink-0",
                "ring-4 ring-background",
              )}
            >
              <AvatarImage src={cabinet.avatarUrl} />
              <AvatarFallback className="bg-primary text-white font-bold text-2xl">
                {getFirstLettersFromNames(cabinet.name)}
              </AvatarFallback>
            </Avatar>
            <div className="mb-1">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="text-xs font-semibold rounded-full px-4 border-foreground/20 hover:border-foreground/40"
              >
                <Link to="/login">Acompanhar</Link>
              </Button>
            </div>
          </div>

          {/* Profile info */}
          <div className="mt-3">
            <h1 className="text-xl font-bold text-foreground leading-tight">{cabinet.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5 font-mono">@{cabinet.slug}</p>

            {cabinet.description && (
              <p className="text-sm text-foreground/80 mt-3 leading-relaxed">
                {cabinet.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
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
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-6 mt-5 pt-4 border-t border-border">
            <Stat value={totalDemands} label="Demandas" />
            <Stat value={resolvedCount} label="Resolvidas" />
            <Stat value={inProgressCount} label="Em progresso" />
            <Stat value={membersList.length} label="Membros" />
          </div>

          {/* Team members */}
          {membersList.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                Equipe
              </p>
              <div className="flex flex-wrap gap-2">
                {membersList.slice(0, 8).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-1.5 bg-muted/50 rounded-full pl-1 pr-3 py-1"
                  >
                    <Avatar className="size-5">
                      <AvatarImage src={member.userAvatarUrl ?? undefined} />
                      <AvatarFallback className="text-2xs bg-primary/10 text-primary font-semibold">
                        {getFirstLettersFromNames(member.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground/80 truncate max-w-[110px]">
                      {member.userName}
                    </span>
                    {member.role === "OWNER" && (
                      <span className="ml-0.5 text-2xs text-primary font-bold leading-none">●</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demands feed */}
          <div className="mt-6 mb-16">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Demandas públicas</h2>
              {!isLoadingDemands && (
                <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 tabular-nums">
                  {demandsData?.meta?.total ?? demands.length}
                </span>
              )}
            </div>

            {isLoadingDemands ? (
              <div className="flex justify-center py-10">
                <Loading className="text-primary size-5" />
              </div>
            ) : demands.length === 0 ? (
              <div className="bg-card rounded-xl border border-border flex flex-col items-center justify-center py-14 gap-3 text-center">
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
              <div className="flex flex-col gap-3">
                {demands.map((demand) => (
                  <Post key={demand.id} demand={demand} showStatus />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
