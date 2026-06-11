import { useGetCabinetsPaginated } from "@/api/cabinets/hooks"
import { useAdminCabinetSubscriptionsSummary } from "@/api/plans/hooks"
import { DataTable, type DataTableFilterField } from "@/components/data-table"
import { useDataTable, TABLE_PARAM_KEYS } from "@/hooks/use-data-table"
import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { createCabinetsColumns } from "./cabinets-columns"

const filterFields: DataTableFilterField[] = [
  {
    id: "hasDemands",
    label: "Demandas",
    type: "select",
    options: [
      { label: "Com demandas", value: "true" },
      { label: "Sem demandas", value: "false" },
    ],
  },
]

export function CabinetsTable() {
  const { data: subscriptionsSummary = [] } = useAdminCabinetSubscriptionsSummary()

  const subscriptionMap = useMemo(
    () => new Map(subscriptionsSummary.map((s) => [s.cabinetId, { planName: s.planName, priceInCents: s.priceInCents }])),
    [subscriptionsSummary],
  )

  const columns = useMemo(() => createCabinetsColumns(subscriptionMap), [subscriptionMap])
  const [searchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get(TABLE_PARAM_KEYS.PAGE) ?? 1))
  const limit = Math.max(1, Number(searchParams.get(TABLE_PARAM_KEYS.PER_PAGE) ?? 10))
  const rawSearch = (searchParams.get(TABLE_PARAM_KEYS.SEARCH) ?? "").trim()
  const search = rawSearch ? rawSearch : undefined
  const rawHasDemands = searchParams.get("hasDemands") ?? undefined
  const hasDemands =
    rawHasDemands === "true" ? true : rawHasDemands === "false" ? false : undefined

  const { data, isLoading } = useGetCabinetsPaginated({
    page,
    limit,
    search,
    hasDemands,
  })

  const { table, ...tableState } = useDataTable({
    data: data?.items ?? [],
    columns,
    rowCount: data?.total ?? 0,
    columnPinning: { right: ["actions"] },
  })

  return (
    <DataTable
      table={table}
      {...tableState}
      filterFields={filterFields}
      isLoading={isLoading}
      searchPlaceholder="Buscar por nome, slug ou email..."
    />
  )
}
