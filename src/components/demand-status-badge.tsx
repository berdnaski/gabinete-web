import { cn } from "@/lib/utils"
import { type DemandStatus, DemandStatusLabel } from "@/api/demands/types"

const STATUS_STYLES: Record<DemandStatus, string> = {
  SUBMITTED: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  IN_ANALYSIS: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  IN_PROGRESS: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  RESOLVED: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  REJECTED: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
}

interface DemandStatusBadgeProps {
  status: DemandStatus
  className?: string
}

export function DemandStatusBadge({ status, className }: DemandStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none",
        STATUS_STYLES[status],
        className,
      )}
    >
      {DemandStatusLabel[status]}
    </span>
  )
}
