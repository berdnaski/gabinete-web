import { useGetHeatmap } from "@/api/demands/hooks";
import type { HeatmapPoint } from "@/api/demands/types";
import { DemandStatusBadge } from "@/components/demand-status-badge";
import { Loading } from "@/components/loading";
import { cn } from "@/lib/utils";
import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
} from "@vis.gl/react-google-maps";
import { Layers, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string;
const BRAZIL_CENTER = { lat: -15.793, lng: -47.882 };

function sizeFromWeight(weight: number) {
  return weight >= 3 ? 22 : 14;
}

function PointMarker({ point }: { point: HeatmapPoint }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const isUrgent = point.weight >= 3;

  return (
    <AdvancedMarker
      position={{ lat: point.lat, lng: point.lng }}
      onClick={() => navigate(`/comments/${point.id}`)}
    >
      <div className="relative flex flex-col items-center">
        {hovered && (
          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-60 bg-white rounded-lg shadow-xl border border-border z-50 pointer-events-none overflow-hidden">
            {/* Top accent */}
            <div className={cn("h-1 w-full", isUrgent ? "bg-red-500" : "bg-blue-500")} />

            <div className="px-3.5 py-3">
              <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-2.5">
                {point.title}
              </p>

              <DemandStatusBadge status={point.status as never} className="mb-2.5" />

              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border">
                <Layers className="size-3 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">{point.categoryName}</span>
                {point.neighborhood && (
                  <>
                    <span className="text-muted-foreground/30">·</span>
                    <MapPin className="size-3 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground">{point.neighborhood}</span>
                  </>
                )}
              </div>

              <p className="text-2xs text-muted-foreground/50 mt-2">Clique para abrir a demanda</p>
            </div>

            {/* Arrow */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-3 bg-white border-r border-b border-border rotate-45" />
          </div>
        )}

        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "rounded-full border-2 cursor-pointer transition-transform duration-150",
            hovered && "scale-130",
            isUrgent
              ? "bg-red-600/80 border-red-600 shadow-[0_0_0_4px_rgba(220,38,38,0.15)]"
              : "bg-blue-600/75 border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.15)]",
          )}
          style={{ width: sizeFromWeight(point.weight), height: sizeFromWeight(point.weight) }}
        />
      </div>
    </AdvancedMarker>
  );
}

export function Map() {
  const { data, isLoading } = useGetHeatmap();

  const points = data?.points ?? [];
  const insight = data?.insight ?? null;

  const center = useMemo(() => {
    if (points.length === 0) return BRAZIL_CENTER;
    return {
      lat: points.reduce((s, p) => s + p.lat, 0) / points.length,
      lng: points.reduce((s, p) => s + p.lng, 0) / points.length,
    };
  }, [points]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <MapPin className="size-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Mapa de demandas</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Visualize onde as demandas estão concentradas na sua cidade.
          </p>
        </div>

        {!isLoading && (
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-foreground">{points.length}</p>
            <p className="text-xs text-muted-foreground">demandas mapeadas</p>
          </div>
        )}
      </div>

      {/* Insight card */}
      {!isLoading && insight && (
        <div className="grid grid-cols-1 sm:grid-cols-3 rounded-xl border border-border overflow-hidden shadow-sm bg-card">
          <div className="sm:col-span-2 px-5 py-4 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-border">
            <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Bairro com mais demandas
            </p>
            <p className="text-2xl font-bold text-foreground tracking-tight leading-none">
              {insight.topNeighborhood}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              nos últimos 30 dias
            </p>
          </div>

          <div className="px-5 py-4 flex flex-col items-start sm:items-center justify-center gap-1">
            <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
              Ocorrências
            </p>
            <p className="text-4xl font-extrabold text-primary tabular-nums leading-none">
              {insight.occurrenceCount}
            </p>
            <p className="text-xs text-muted-foreground">
              {insight.occurrenceCount === 1 ? "demanda registrada" : "demandas registradas"}
            </p>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="relative rounded-xl overflow-hidden border border-border shadow-sm bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center h-[65vh]">
            <div className="flex flex-col items-center gap-3">
              <Loading className="text-primary size-7" />
              <p className="text-sm text-muted-foreground">Carregando demandas...</p>
            </div>
          </div>
        ) : (
          <APIProvider apiKey={API_KEY} language="pt-BR" region="BR">
            <GoogleMap
              mapId="DEMO_MAP_ID"
              defaultCenter={points.length > 0 ? center : BRAZIL_CENTER}
              defaultZoom={points.length > 0 ? 14 : 5}
              style={{ height: "65vh", width: "100%" }}
              streetViewControl={false}
              mapTypeControl={false}
              fullscreenControl={false}
              gestureHandling="cooperative"
            >
              {points.map((point, i) => (
                <PointMarker key={i} point={point} />
              ))}
            </GoogleMap>
          </APIProvider>
        )}

        {/* Legend */}
        {!isLoading && (
          <div className="absolute bottom-8 right-3 z-10 bg-white/95 backdrop-blur-sm border border-border rounded-xl shadow-lg px-3.5 py-3 min-w-36">
            <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
              Legenda
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-blue-500/75 border border-blue-600 shrink-0" />
                <span className="text-xs text-foreground/80">Demanda</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-4 rounded-full bg-red-600/80 border border-red-600 shrink-0" />
                <span className="text-xs text-foreground/80">Urgente</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && points.length === 0 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm border border-border rounded-xl px-6 py-5 text-center shadow-lg pointer-events-auto max-w-xs">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <MapPin className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">Nenhuma demanda mapeada</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Demandas precisam ter localização para aparecer no mapa. Selecione o endereço no mapa ao criar uma demanda.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
