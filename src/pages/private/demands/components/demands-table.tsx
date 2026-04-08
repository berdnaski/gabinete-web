import { DataTable, type DataTableFilterField } from "@/components/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import type { DemandPriority, DemandStatus } from "@/types/demand-types";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "./demand-utils";
import { demandsColumns } from "./demands-columns";
import { DemandsForm } from "./demands-form";
import { getMockDemands } from "./demands-mock";

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
  const columns = useMemo(() => demandsColumns, [])
  const [searchParams] = useSearchParams()

  const demands = getMockDemands({
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("per_page") ?? 10),
    search: searchParams.get("search") ?? undefined,
    status: (searchParams.get("status") as DemandStatus) || undefined,
    priority: (searchParams.get("priority") as DemandPriority) || undefined,
  })
  const isLoading = false

  const { table, ...tableState } = useDataTable({
    data: demands?.items ?? [],
    columns,
    rowCount: demands?.meta.total ?? 0,
    columnPinning: { right: ["actions"] },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
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
