import { PencilLineIcon } from "lucide-react";

interface FeedEmptyStateProps {
  search: string
}

export function FeedEmptyState({ search }: FeedEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="size-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
        <PencilLineIcon className="size-6 text-zinc-300" />
      </div>
      <p className="text-sm font-semibold text-zinc-700">
        {search ? `Nenhum resultado para "${search}"` : "Nenhuma demanda encontrada"}
      </p>
      <p className="text-xs text-zinc-400 mt-1.5 max-w-55 leading-relaxed">
        Ajuste os filtros ou registre uma nova demanda.
      </p>
    </div>
  )
}