import { useGetUsersPaginated } from "@/api/users/hooks"
import { UserRole } from "@/api/users/types"
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
      { label: "Admin", value: UserRole.ADMIN },
      { label: "Membro", value: UserRole.MEMBER },
      { label: "Cidadão", value: UserRole.CITIZEN },
    ],
  },
  {
    id: "showInactive",
    label: "Status",
    type: "select",
    options: [
      { label: "Ativos", value: "false" },
      { label: "Inativos", value: "true" },
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
  const rawRole = (searchParams.get("role") ?? "").trim()
  const role = (Object.values(UserRole) as string[]).includes(rawRole)
    ? (rawRole as UserRole)
    : undefined
  const showInactive = searchParams.get("showInactive") === "true"

  const { data, isLoading } = useGetUsersPaginated({ page, limit, search, role, showInactive })

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
