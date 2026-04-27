import { useGetCabinets } from "@/api/cabinets/hooks";
import type { Cabinet } from "@/api/cabinets/types";
import { Loading } from "@/components/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names";
import { Building2, FileText, Search, Star, Trophy, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const RANK_COLORS = [
  { ring: "ring-amber-400", bg: "bg-amber-50", text: "text-amber-600", label: "text-amber-500" },
  { ring: "ring-zinc-400", bg: "bg-zinc-50", text: "text-zinc-500", label: "text-zinc-400" },
  { ring: "ring-orange-300", bg: "bg-orange-50", text: "text-orange-500", label: "text-orange-400" },
];

function TopCabinetCard({ cabinet, rank }: { cabinet: Cabinet; rank: number }) {
  const color = RANK_COLORS[rank - 1];

  return (
    <Link
      to={`/gabinetes/${cabinet.slug}`}
      className={cn(
        "group relative flex flex-col items-center text-center p-5 rounded-2xl border-2 bg-card shadow-sm hover:shadow-md transition-all duration-200",
        color.ring,
        rank === 1 && "sm:scale-105 shadow-md"
      )}
    >
      <div className={cn(
        "absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-widest",
        color.bg, color.label
      )}>
        <Trophy className="size-3" />
        {rank === 1 ? "1º lugar" : rank === 2 ? "2º lugar" : "3º lugar"}
      </div>

      <Avatar className={cn("size-16 ring-3 mt-2", color.ring)}>
        <AvatarImage src={cabinet.avatarUrl} />
        <AvatarFallback className="bg-white font-bold text-lg text-primary">
          {getFirstLettersFromNames(cabinet.name)}
        </AvatarFallback>
      </Avatar>

      <h3 className="mt-3 text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
        {cabinet.name}
      </h3>

      {cabinet.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
          {cabinet.description}
        </p>
      )}

      <div className="mt-4 w-full pt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <FileText className="size-3.5" />
          <span className="font-semibold text-foreground">{cabinet.demand_count ?? 0}</span>
          <span>demanda{(cabinet.demand_count ?? 0) !== 1 ? "s" : ""}</span>
        </span>
        <span className={cn("flex items-center gap-1 font-bold", color.text)}>
          <Star className="size-3.5 fill-current opacity-60" />
          {cabinet.score ?? 0} pts
        </span>
      </div>
    </Link>
  );
}

function CabinetRow({ cabinet, rank }: { cabinet: Cabinet; rank: number }) {
  return (
    <Link
      to={`/gabinetes/${cabinet.slug}`}
      className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-border bg-card hover:bg-muted/30 hover:border-primary/20 transition-all duration-150"
    >
      <span className="w-6 text-center text-sm font-bold text-muted-foreground/50 shrink-0 tabular-nums">
        {rank}
      </span>

      <Avatar className="size-10 shrink-0">
        <AvatarImage src={cabinet.avatarUrl} />
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
          {getFirstLettersFromNames(cabinet.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {cabinet.name}
        </p>
        {cabinet.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{cabinet.description}</p>
        )}
      </div>

      <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
        <FileText className="size-3.5" />
        <span className="font-medium text-foreground">{cabinet.demand_count ?? 0}</span>
        <span>demanda{(cabinet.demand_count ?? 0) !== 1 ? "s" : ""}</span>
      </div>

      <span className="flex items-center gap-1 text-primary font-bold text-sm shrink-0">
        <Star className="size-3.5 fill-primary/30" />
        {cabinet.score ?? 0}
      </span>
    </Link>
  );
}

export function Cabinets() {
  const [search, setSearch] = useState("");
  const { data: cabinets, isLoading } = useGetCabinets();

  const sorted = useMemo(() => {
    if (!cabinets) return [];
    return [...cabinets].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }, [cabinets]);

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q),
    );
  }, [sorted, search]);

  const top3 = !search.trim() ? filtered.slice(0, 3) : [];
  const rest = !search.trim() ? filtered.slice(3) : filtered;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="size-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Gabinetes</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Conheça os gabinetes que mais resolvem demandas na sua cidade.
          </p>
        </div>
        {!isLoading && cabinets && (
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-foreground">{cabinets.length}</p>
            <p className="text-xs text-muted-foreground">gabinetes ativos</p>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar gabinete..."
          className="pl-9 bg-card"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loading className="text-primary size-6" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Users className="size-7 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            {search ? `Nenhum resultado para "${search}"` : "Nenhum gabinete encontrado"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Tente buscar por outro nome.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Podium top 3 */}
          {top3.length > 0 && (
            <div>
              <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
                <Trophy className="size-3" />
                Ranking
              </p>
              <div className={cn(
                "grid gap-4",
                top3.length === 1 && "grid-cols-1 max-w-xs mx-auto",
                top3.length === 2 && "grid-cols-2",
                top3.length >= 3 && "grid-cols-1 sm:grid-cols-3",
              )}>
                {top3.map((cabinet, i) => (
                  <TopCabinetCard key={cabinet.id} cabinet={cabinet} rank={i + 1} />
                ))}
              </div>
            </div>
          )}

          {/* Remaining list */}
          {rest.length > 0 && (
            <div className="flex flex-col gap-2">
              {!search.trim() && top3.length > 0 && (
                <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
                  <Building2 className="size-3" />
                  Demais gabinetes
                </p>
              )}
              {rest.map((cabinet, i) => (
                <CabinetRow
                  key={cabinet.id}
                  cabinet={cabinet}
                  rank={search.trim() ? i + 1 : i + 4}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
