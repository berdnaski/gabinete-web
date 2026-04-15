import { useGetDemands } from "@/api/demands/hooks"
import { FeedFilter, type DemandsFilterValue } from "./components/feed-filter"
import { useMemo, useState } from "react"
import type { Demand } from "@/api/demands/types"
import { Separator } from "@base-ui/react"
import { DialogDemandForm } from "../private/demands/components/dialog-demand-form"
import { FeedEmptyState } from "./components/feed-empty-state"
import { Post } from "@/components/post"

export function Feed() {
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
      <FeedFilter value={filters} onChange={setFilters} resultCount={filtered.length} />

      <Separator className="my-4 md:hidden" />

      <div className="flex-1 flex flex-col gap-4">
        <DialogDemandForm />

        {isLoading ? (
          <div className="flex justify-center py-24 text-sm text-zinc-400">Carregando...</div>
        ) : filtered.length === 0 ? (
          <FeedEmptyState search={filters.search} />
        ) : (
          <>
            {filtered.map((demand) => (
              <Post key={demand.id} demand={demand} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}