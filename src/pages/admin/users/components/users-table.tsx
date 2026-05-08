import { useGetUsersPaginated } from "@/api/users/hooks"
import { DataTable, type DataTableFilterField } from "@/components/data-table"
import { TABLE_PARAM_KEYS, useDataTable } from "@/hooks/use-data-table"
import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { usersColumns } from "./users-columns"

const filterFields: DataTableFilterField[] = [
  {
    id: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "Admin", value: "ADMIN" },
      { label: "Membro", value: "MEMBER" },
      { label: "Cidadão", value: "CITIZEN" },
    ],
  },
]

export function UsersTable() {
  const columns = useMemo(() => usersColumns, [])
  const [searchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get(TABLE_PARAM_KEYS.PAGE) ?? 1))
  const limit = Math.max(1, Number(searchParams.get(TABLE_PARAM_KEYS.PER_PAGE) ?? 10))
  const rawSearch = (searchParams.get(TABLE_PARAM_KEYS.SEARCH) ?? "").trim()
  const search = rawSearch ? rawSearch : undefined
  const role = (searchParams.get("role") ?? "").trim() || undefined

  const { data, isLoading } = useGetUsersPaginated({ page, limit, search, role })

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
      searchPlaceholder="Buscar por id, nome ou email..."
    />
  )
}
