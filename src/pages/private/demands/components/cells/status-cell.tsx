import { useUpdateDemandStatus } from "@/api/demands/hooks"
import type { Demand } from "@/api/demands/types"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Row } from "@tanstack/react-table"
import { DEMAND_STATUS_CONFIG, STATUS_OPTIONS } from "../demand-utils"

export function StatusCell({ row }: { row: Row<Demand> }) {
  const demand = row.original
  const config = DEMAND_STATUS_CONFIG[demand.status]
  const { mutate: updateStatus, isPending } = useUpdateDemandStatus()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isPending}>
        <button className="outline-none cursor-pointer group">
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium px-2.5 py-0.5 transition-all group-hover:opacity-80 active:scale-95",
              config.className,
              isPending && "opacity-50 animate-pulse",
            )}
          >
            {config.label}
          </Badge>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {STATUS_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            disabled={demand.status === opt.value}
            onClick={() => updateStatus({ id: demand.id, status: opt.value })}
            className={cn(demand.status === opt.value && "bg-accent text-primary font-semibold")}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
