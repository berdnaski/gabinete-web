import { cn } from "@/lib/utils"
import { type DemandStatus } from "@/api/demands/types"
import { DEMAND_STATUS_CONFIG } from "@/pages/private/demands/components/demand-utils"

interface DemandStatusBadgeProps {
  status: DemandStatus
  className?: string
}

export function DemandStatusBadge({ status, className }: DemandStatusBadgeProps) {
  const config = DEMAND_STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold leading-none",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
