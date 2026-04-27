import { DemandPriority as DemandPriorityType, type Demand } from "@/api/demands/types";
import { Gallery } from "@/components/gallery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPinIcon, MessageSquareIcon, User } from "lucide-react";

interface DemandCardProps {
  demand: Demand;
}

const PRIORITY_LEFT: Record<DemandPriorityType, string> = {
  URGENT: "border-l-[3px] border-l-red-500",
  HIGH: "border-l-[3px] border-l-orange-400",
  MEDIUM: "border-l-[3px] border-l-sky-400",
  LOW: "border-l-[3px] border-l-zinc-200",
}

export function DemandCard({ demand }: DemandCardProps) {

  const relativeDate = demand.createdAt
    ? formatDistanceToNow(new Date(demand.createdAt), { addSuffix: true, locale: ptBR })
    : ""

  return (
    <article
      className={cn(
        "feed-card bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200"
      )}
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="flex items-start gap-3 min-w-0">
          <Avatar size="lg">
            <AvatarImage src={demand.reporter.avatarUrl} />
            <AvatarFallback className="font-semibold">
              {demand.guestEmail ? <User /> : getFirstLettersFromNames(demand.reporter.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-zinc-900 leading-tight">
              {demand.reporter?.name || demand.guestEmail || "Anônimo"}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {demand.category?.name && (
                <>
                  <span className="text-xs font-medium">
                    {demand.category.name}
                  </span>
                  <span className="text-zinc-200 text-2xs">·</span>
                </>
              )}
              <span className="text-xs text-zinc-400">{relativeDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4 flex flex-col gap-2.5">
        <h3 className="font-semibold text-zinc-900 text-sm leading-snug tracking-tight">
          {demand.title}
        </h3>
        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">
          {demand.description}
        </p>
        {demand.address && (
          <div className="flex items-center gap-1.5 text-zinc-400 mt-0.5">
            <MapPinIcon className="size-3.5 shrink-0" />
            <span className="text-xs">{demand.address}</span>
          </div>
        )}

        {demand.evidences && demand.evidences.length > 0 && (
          <Gallery images={demand.evidences} />
        )}
      </div>


      <div className="px-4 py-2.5 border-t border-zinc-50 flex items-center gap-0.5">
        <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-xl text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 transition-colors">
          <MessageSquareIcon className="size-3.5" />
          Comentar
        </button>
      </div>
    </article>
  )
}