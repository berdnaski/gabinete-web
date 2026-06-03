import type { User } from "@/api/users"
import { UserRole, UserRoleLabel } from "@/api/users/types"
import { useAdminEnableUser } from "@/api/admin/hooks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowRight, Loader2, UserCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { UserEditSheet } from "./user-edit-sheet"

function EnableButton({ userId }: { userId: string }) {
  const { mutate, isPending } = useAdminEnableUser()

  function handleEnable() {
    mutate(userId, {
      onSuccess: () => toast.success("Usuário reativado com sucesso."),
      onError: () => toast.error("Erro ao reativar usuário."),
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1 text-xs h-7 text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
      onClick={handleEnable}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="size-3 animate-spin" /> : <UserCheck className="size-3" />}
      Ativar
    </Button>
  )
}

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Usuário",
    cell: ({ row }) => {
      const u = row.original
      return (
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={u.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xs">
              {getFirstLettersFromNames(u.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground truncate">{u.name}</span>
              {u.disabledAt && (
                <Badge variant="secondary" className="text-2xs px-1.5 py-0 shrink-0">Inativo</Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground truncate">{u.id}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 240,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
    size: 140,
    cell: ({ row }) => {
      const role = row.original.role as UserRole
      const label = UserRoleLabel[role] ?? row.original.role
      return <span className="text-sm text-muted-foreground">{label}</span>
    },
  },
  {
    accessorKey: "isCabinetMember",
    header: "Membro",
    size: 90,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.isCabinetMember ? "Sim" : "Não"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    size: 160,
    cell: ({ row }) => {
      const u = row.original
      return (
        <div className="flex items-center justify-end gap-1.5">
          {u.disabledAt ? (
            <EnableButton userId={u.id} />
          ) : (
            <UserEditSheet userId={u.id} />
          )}
          <Link
            to={`/profile/${u.id}`}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Abrir <ArrowRight className="size-3" />
          </Link>
        </div>
      )
    },
  },
]
