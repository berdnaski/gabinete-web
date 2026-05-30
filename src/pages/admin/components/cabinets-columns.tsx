import type { Cabinet } from "@/api/cabinets/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { CabinetEditSheet } from "./cabinet-edit-sheet"
import { DisableCabinetDialog } from "./disable-cabinet-dialog"

export const cabinetsColumns: ColumnDef<Cabinet>[] = [
  {
    accessorKey: "name",
    header: "Gabinete",
    cell: ({ row }) => {
      const c = row.original
      return (
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={c.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xs">
              {getFirstLettersFromNames(c.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-semibold text-foreground truncate">{c.name}</span>
            <span className="text-xs text-muted-foreground truncate">{c.slug}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 220,
    cell: ({ row }) => {
      const value = row.original.email
      if (!value) return <span className="text-xs text-muted-foreground/50">—</span>
      return <span className="text-sm text-muted-foreground">{value}</span>
    },
  },
  {
    accessorKey: "score",
    header: "Score",
    size: 90,
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-nums text-muted-foreground">
        {row.original.score ?? 0}
      </span>
    ),
  },
  {
    accessorKey: "demand_count",
    header: "Demandas",
    size: 110,
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-nums text-muted-foreground">
        {row.original.demand_count ?? 0}
      </span>
    ),
  },
  {
    accessorKey: "in_progress_count",
    header: "Em Progresso",
    size: 140,
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-nums text-muted-foreground">
        {row.original.in_progress_count ?? 0}
      </span>
    ),
  },
  {
    accessorKey: "resolved_count",
    header: "Resolvidas",
    size: 120,
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-nums text-muted-foreground">
        {row.original.resolved_count ?? 0}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    size: 120,
    cell: ({ row }) => {
      const c = row.original
      return (
        <div className="flex items-center justify-end gap-1.5">
          <CabinetEditSheet cabinetId={c.id} />
          <DisableCabinetDialog cabinet={c} />
          <Link
            to={`/${c.slug}`}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Abrir <ArrowRight className="size-3" />
          </Link>
        </div>
      )
    },
  },
]
