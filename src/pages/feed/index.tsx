import { useInfiniteGetDemands } from "@/api/demands/hooks"
import { FeedFilter, type DemandsFilterValue } from "./components/feed-filter"
import { useEffect, useMemo, useRef, useState } from "react"
import type { Demand } from "@/api/demands/types"
import { Separator } from "@base-ui/react"
import { DialogDemandForm } from "../private/demands/components/dialog-demand-form"
import { FeedEmptyState } from "./components/feed-empty-state"
import { Post } from "@/components/post"
import { Loading } from "@/components/loading"

export function Feed() {
  const [filters, setFilters] = useState<DemandsFilterValue>({
    search: "",
    status: [],
    categories: [],
    priority: null,
    dateRange: undefined,
    neighborhood: null,
  })

  const sentinelRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteGetDemands({
    search: filters.search.trim() || undefined,
    priority: filters.priority ?? undefined,
    startDate: filters.dateRange?.from?.toISOString(),
    endDate: filters.dateRange?.to?.toISOString(),
    neighborhood: filters.neighborhood ?? undefined,
    limit: 20,
  })

  const filtered = useMemo(() => {
    const priorityOrder: Record<string, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    let result: Demand[] = (data?.pages.flatMap((p) => p.items) ?? []).sort((a, b) => {
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

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="max-w-4xl mx-auto md:flex items-start gap-6">
      <FeedFilter value={filters} onChange={setFilters} resultCount={filtered.length} />

      <Separator className="my-4 md:hidden" />

      <div className="flex-1 flex flex-col gap-4">
        <DialogDemandForm />

        {isLoading ? (
          <div className="items-center justify-center flex py-4">
            <Loading className="text-primary size-6" />
          </div>
        ) : filtered.length === 0 ? (
          <FeedEmptyState search={filters.search} />
        ) : (
          <>
            {filtered.map((demand) => (
              <Post key={demand.id} demand={demand} />
            ))}

            <div ref={sentinelRef} className="py-2 flex justify-center">
              {isFetchingNextPage && (
                <div className="items-center justify-center flex-col gap-2 flex py-10">
                  <Loading className="text-primary size-6" />
                  <span className="text-sm text-zinc-400">Carregando...</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
