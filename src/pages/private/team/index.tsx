import { useGetCabinetMembers } from "@/api/cabinets/hooks"
import type { CabinetMember } from "@/api/cabinets/types"
import { Loading } from "@/components/loading"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { usePageTitle } from "@/hooks/use-page-title"
import { cn } from "@/lib/utils"
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names"
import { Crown, LayoutList, MoreHorizontal, Search, Shield, UserRound } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

const ROLE_CONFIG = {
  OWNER: {
    label: "Responsável",
    icon: Crown,
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    iconClass: "text-amber-500",
  },
  STAFF: {
    label: "Membro",
    icon: Shield,
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
    iconClass: "text-blue-500",
  },
} as const

function MemberRow({ member }: { member: CabinetMember }) {
  const navigate = useNavigate()
  const config = ROLE_CONFIG[member.role]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Avatar className="size-9 shrink-0">
        <AvatarImage src={member.userAvatarUrl ?? undefined} />
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
          {getFirstLettersFromNames(member.userName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground truncate">
            {member.userName}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-2xs font-medium border shrink-0",
              config.className,
            )}
          >
            <Icon className={cn("size-2.5", config.iconClass)} />
            {config.label}
          </span>
        </div>
        {member.userEmail && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {member.userEmail}
          </p>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => navigate(`/demands?assigneeMemberId=${member.id}`)}
          >
            <LayoutList className="size-3.5" />
            Ver demandas atribuídas
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function Team() {
  const { setTitle } = usePageTitle()
  const { cabinet } = useAuth()
  const [search, setSearch] = useState("")

  useEffect(() => {
    setTitle({ title: "Equipe", description: "Membros do gabinete" })
  }, [])

  const { data: members = [], isLoading } = useGetCabinetMembers(cabinet?.slug)

  const filtered = useMemo(() => {
    if (!search.trim()) return members
    const q = search.toLowerCase()
    return members.filter(
      (m) =>
        m.userName.toLowerCase().includes(q) ||
        (m.userEmail ?? "").toLowerCase().includes(q),
    )
  }, [members, search])

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-base font-semibold text-foreground">Equipe</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {cabinet?.name ?? ""}
          {!isLoading && members.length > 0 && (
            <span>
              {" "}· {members.length} {members.length === 1 ? "membro" : "membros"}
            </span>
          )}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar membro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          {!isLoading && members.length > 0 && (
            <span className="font-mono text-xs tabular-nums text-muted-foreground/40 shrink-0">
              {String(filtered.length).padStart(2, "0")}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loading className="text-primary size-5" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-3">
              <UserRound className="size-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {search ? "Nenhum resultado encontrado" : "Nenhum membro encontrado"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {search ? "Tente outro termo de busca." : "Convide membros nas configurações."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filtered.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
