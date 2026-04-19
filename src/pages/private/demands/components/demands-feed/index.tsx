import { useGetDemands } from "@/api/demands/hooks"
import type { Demand } from "@/api/demands/types"
import { Separator } from "@/components/ui/separator"
import {
  PencilLineIcon
} from "lucide-react"
import { useMemo, useState } from "react"
import { DemandCard } from "../demand-card"
import { DemandsFilterV2, type DemandsFilterValue } from "../demands-filter-v2"
import { DialogDemandForm } from "../dialog-demand-form"


function EmptyState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="size-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
        <PencilLineIcon className="size-6 text-zinc-300" />
      </div>
      <p className="text-sm font-semibold text-zinc-700">
        {search ? `Nenhum resultado para "${search}"` : "Nenhuma demanda encontrada"}
      </p>
      <p className="text-xs text-zinc-400 mt-1.5 max-w-55 leading-relaxed">
        Ajuste os filtros ou registre uma nova demanda na sua comunidade.
      </p>
    </div>
  )
}

export function DemandsFeed() {
  const [filters, setFilters] = useState<DemandsFilterValue>({
    search: "",
    status: [],
    categories: [],
    priority: null,
    dateRange: undefined,
  })

  const { data, isLoading } = useGetDemands({
    search: filters.search.trim() || undefined,
    priority: filters.priority ?? undefined,
    startDate: filters.dateRange?.from?.toISOString(),
    endDate: filters.dateRange?.to?.toISOString(),
    limit: 100,
  })

  const filtered = useMemo(() => {
    const priorityOrder: Record<string, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    let result: Demand[] = (data?.items ?? []).sort((a, b) => {
      const pa = priorityOrder[a.priority ?? "LOW"]
      const pb = priorityOrder[b.priority ?? "LOW"]
      if (pa !== pb) return pa - pb
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    if (filters.status.length > 0)
      result = result.filter((d) => filters.status.includes(d.status))
    if (filters.categories.length > 0)
      result = result.filter((d) => filters.categories.includes(d.categoryId))
    return result
  }, [data, filters])

  return (
    <div className="max-w-4xl mx-auto md:flex items-start gap-6">
      <DemandsFilterV2 value={filters} onChange={setFilters} resultCount={filtered.length} />

      <Separator className="my-4 md:hidden" />

      <div className="flex-1 flex flex-col gap-4 mt-4">
        <DialogDemandForm />

        {isLoading ? (
          <div className="flex justify-center py-24 text-sm text-zinc-400">Carregando...</div>
        ) : filtered.length === 0 ? (
          <EmptyState search={filters.search} />
        ) : (
          filtered.map((demand) => (
            <DemandCard key={demand.id} demand={demand} />
          ))
        )}
      </div>
    </div>
  )
}
