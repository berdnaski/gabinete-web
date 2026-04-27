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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/hooks/use-auth"
import { usePageTitle } from "@/hooks/use-page-title"
import { cn } from "@/lib/utils"
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names"
import { Crown, LayoutList, MailIcon, MoreHorizontal, Search, Shield, UserRound } from "lucide-react"
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

function MemberActionsCell({ member }: { member: CabinetMember }) {
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
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
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-base font-semibold text-foreground">Equipe</h1>
          <p className="text-sm text-muted-foreground">
            Membros ativos do gabinete {cabinet?.name ?? ""}.
          </p>
        </div>
        {!isLoading && (
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-foreground">{members.length}</p>
            <p className="text-xs text-muted-foreground">
              {members.length === 1 ? "membro" : "membros"}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar membro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loading className="text-primary size-5" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <UserRound className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {search ? "Nenhum resultado encontrado" : "Nenhum membro encontrado"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {search ? "Tente outro termo de busca." : "Convide membros nas configurações."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4 w-70">Membro</TableHead>
                <TableHead className="w-30">Cargo</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="w-15" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member) => {
                const config = ROLE_CONFIG[member.role]
                const Icon = config.icon
                return (
                  <TableRow key={member.id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 shrink-0">
                          <AvatarImage src={member.userAvatarUrl ?? undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {getFirstLettersFromNames(member.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">
                          {member.userName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                          config.className,
                        )}
                      >
                        <Icon className={cn("size-3", config.iconClass)} />
                        {config.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      {member.userEmail ? (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MailIcon className="size-3.5 shrink-0" />
                          <span className="truncate max-w-55">{member.userEmail}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <MemberActionsCell member={member} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
