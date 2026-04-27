import { useGetCabinetMembers } from "@/api/cabinets/hooks"
import { useGetDemandsByCabinetSlug } from "@/api/demands/hooks"
import type { DemandPriority, DemandStatus } from "@/api/demands/types"
import { DataTable, type DataTableFilterField } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useDataTable } from "@/hooks/use-data-table"
import { cn } from "@/lib/utils"
import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "./demand-utils"
import { demandsColumns } from "./demands-columns"
import { DemandsForm } from "./demands-form"

const filterFields: DataTableFilterField[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: STATUS_OPTIONS,
  },
  {
    id: "priority",
    label: "Prioridade",
    type: "select",
    options: PRIORITY_OPTIONS,
  },
]

export function DemandsTable() {
  const { cabinet, user } = useAuth()
  const columns = useMemo(() => demandsColumns, [])
  const [searchParams, setSearchParams] = useSearchParams()

  const assigneeMemberIdParam = searchParams.get("assigneeMemberId") ?? undefined

  const { data: members = [] } = useGetCabinetMembers(cabinet?.slug)
  const currentMember = useMemo(
    () => members.find((m) => m.userId === user?.id),
    [members, user?.id],
  )

  const isMyTasks = assigneeMemberIdParam === currentMember?.id

  function toggleMyTasks() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (isMyTasks) {
        next.delete("assigneeMemberId")
      } else if (currentMember) {
        next.set("assigneeMemberId", currentMember.id)
        next.delete("page")
      }
      return next
    })
  }

  const { data: demands, isLoading } = useGetDemandsByCabinetSlug({
    slug: cabinet?.slug as string,
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("per_page") ?? 10),
    search: searchParams.get("search") ?? undefined,
    status: (searchParams.get("status") as DemandStatus) || undefined,
    priority: (searchParams.get("priority") as DemandPriority) || undefined,
    assigneeMemberId: assigneeMemberIdParam,
  })

  const { table, ...tableState } = useDataTable({
    data: demands?.items ?? [],
    columns,
    rowCount: demands?.meta.total ?? 0,
    columnPinning: { right: ["actions"] },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "h-7 px-3 text-xs font-medium rounded-md transition-all",
              !isMyTasks
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => {
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev)
                next.delete("assigneeMemberId")
                next.delete("page")
                return next
              })
            }}
          >
            Todas
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={!currentMember}
            className={cn(
              "h-7 px-3 text-xs font-medium rounded-md transition-all",
              isMyTasks
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={toggleMyTasks}
          >
            Minhas tarefas
          </Button>
        </div>
        <DemandsForm sizeTrigger="default" />
      </div>
      <DataTable
        table={table}
        {...tableState}
        filterFields={filterFields}
        isLoading={isLoading}
        searchPlaceholder="Buscar por título ou descrição..."
      />
    </div>
  )
}
