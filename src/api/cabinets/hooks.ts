import { useMutation, useQuery } from "@tanstack/react-query";
import { CabinetsApi } from ".";
import type { Cabinet } from "./types";
import { queryClient } from "../queryClient";

export function useGetCabinets() {
  return useQuery({
    queryKey: ["cabinets"],
    queryFn: CabinetsApi.list,
  });
}

export function useGetCabinetsPaginated(params: {
  page: number;
  limit: number;
  search?: string;
  hasDemands?: boolean;
}) {
  return useQuery({
    queryKey: ["cabinets", "paginated", params],
    queryFn: () => CabinetsApi.listPaginated(params),
  });
}

export function useGetCabinetBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["cabinet", slug],
    queryFn: () => CabinetsApi.getBySlug(slug!),
    enabled: !!slug,
  });
}

export function useGetCabinetMembers(slug: string | undefined) {
  return useQuery({
    queryKey: ["cabinet-members", slug],
    queryFn: () => CabinetsApi.getMembers(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetCabinetMetrics(slug: string | undefined) {
  return useQuery({
    queryKey: ["cabinet-metrics", slug],
    queryFn: () => CabinetsApi.getMetrics(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetCabinetTrend(slug: string | undefined, days = 14) {
  return useQuery({
    queryKey: ["cabinet-trend", slug, days],
    queryFn: () => CabinetsApi.getTrend(slug!, days),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetCabinetTrendDetailed(slug: string | undefined, days = 14) {
  return useQuery({
    queryKey: ["cabinet-trend-detailed", slug, days],
    queryFn: () => CabinetsApi.getTrendDetailed(slug!, days),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateCabinet() {
  return useMutation({
    mutationFn: ({ slug, data, file }: { slug: string; data: Partial<Cabinet>; file?: File }) =>
      CabinetsApi.update(slug, data, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cabinet", variables.slug] });
      queryClient.invalidateQueries({ queryKey: ["cabinets"] });
    },
  });
}
