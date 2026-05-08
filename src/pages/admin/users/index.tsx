import { usePageTitle } from "@/hooks/use-page-title"
import { useEffect } from "react"
import { UsersTable } from "./components/users-table"

export function AdminUsers() {
  const { setTitle } = usePageTitle()

  useEffect(() => {
    setTitle({ title: "Usuários", description: "Listagem e gerenciamento" })
  }, [setTitle])

  return (
    <div className="flex flex-col gap-4">
      <UsersTable />
    </div>
  )
}

