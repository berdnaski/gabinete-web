import type { User } from "@/api/users"
import { UserRole, UserRoleLabel } from "@/api/users/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { UserEditSheet } from "./user-edit-sheet"

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
            <span className="text-sm font-semibold text-foreground truncate">{u.name}</span>
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
    size: 140,
    cell: ({ row }) => {
      const u = row.original
      return (
        <div className="flex items-center justify-end gap-1.5">
          <UserEditSheet userId={u.id} />
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
