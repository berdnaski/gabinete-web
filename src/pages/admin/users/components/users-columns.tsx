import type { User } from "@/api/users"
import { UserRole, UserRoleLabel } from "@/api/users/types"
import { useAdminDisableUser, useAdminEnableUser } from "@/api/admin/hooks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names"
import type { ColumnDef } from "@tanstack/react-table"
import { Loader2, UserCheck, UserX } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { UserEditSheet } from "./user-edit-sheet"

function EnableButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useAdminEnableUser()

  function handleConfirm() {
    mutate(userId, {
      onSuccess: () => { toast.success("Usuário reativado com sucesso."); setOpen(false) },
      onError: () => toast.error("Erro ao reativar usuário."),
    })
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1 text-xs h-7 text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
        onClick={() => setOpen(true)}
      >
        <UserCheck className="size-3" />
        Ativar
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reativar usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              O usuário voltará a ter acesso à plataforma normalmente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : "Reativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function DisableButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useAdminDisableUser()

  function handleConfirm() {
    mutate(userId, {
      onSuccess: () => { toast.success("Usuário desativado com sucesso."); setOpen(false) },
      onError: () => toast.error("Erro ao desativar usuário."),
    })
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1 text-xs h-7 text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800"
        onClick={() => setOpen(true)}
      >
        <UserX className="size-3" />
        Desativar
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              O usuário perderá o acesso à plataforma. Você poderá reativá-lo a qualquer momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : "Desativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function getUsersColumns(currentUserId: string): ColumnDef<User>[] { return [
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
            <>
              {u.id !== currentUserId && <DisableButton userId={u.id} />}
              <UserEditSheet userId={u.id} />
            </>
          )}
        </div>
      )
    },
  }
]}
