import { useGetCabinetMembers } from "@/api/cabinets/hooks"
import { Loading } from "@/components/loading"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/hooks/use-auth"
import { usePageTitle } from "@/hooks/use-page-title"
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names"
import { Crown, Shield, UserRound, Users } from "lucide-react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

const ROLE_CONFIG = {
  OWNER: {
    label: "Responsável",
    icon: Crown,
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    iconClass: "text-amber-500",
  },
  STAFF: {
    label: "Membro",
    icon: Shield,
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
    iconClass: "text-blue-500",
  },
} as const

export function Team() {
  const { setTitle } = usePageTitle()
  const { cabinet } = useAuth()

  useEffect(() => {
    setTitle({ title: "Equipe", description: "Membros do gabinete" })
  }, [])

  const { data: members = [], isLoading } = useGetCabinetMembers(cabinet?.slug)

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Users className="size-4 text-primary" />
            <h1 className="text-base font-semibold text-foreground">Equipe</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Membros ativos do gabinete {cabinet?.name ?? ""}.
          </p>
        </div>
        {!isLoading && (
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-foreground">{members.length}</p>
            <p className="text-xs text-muted-foreground">{members.length === 1 ? "membro" : "membros"}</p>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loading className="text-primary size-5" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <UserRound className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">Nenhum membro encontrado</p>
            <p className="text-xs text-muted-foreground mt-1">Convide membros nas configurações.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Membro</TableHead>
                <TableHead>Cargo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
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
                        <span className="text-sm font-medium text-foreground">{member.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                        config.className,
                      )}>
                        <Icon className={cn("size-3", config.iconClass)} />
                        {config.label}
                      </span>
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
