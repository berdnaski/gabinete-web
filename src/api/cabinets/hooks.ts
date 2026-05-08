import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CabinetsApi } from ".";
import type { Cabinet } from "./types";
import { queryClient } from "../queryClient";

export function useGetCabinets() {
  return useQuery({
    queryKey: ["cabinets"],
    queryFn: CabinetsApi.list,
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

export function useListCabinetInvitations(slug: string | undefined) {
  return useQuery({
    queryKey: ["cabinet-invitations", slug],
    queryFn: () => CabinetsApi.listInvitations(slug!),
    enabled: !!slug,
    staleTime: 1000 * 30,
  });
}

export function useInviteMember(slug: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; role: "OWNER" | "STAFF" }) =>
      CabinetsApi.inviteMember(slug!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cabinet-invitations", slug] });
    },
  });
}

export function useCancelInvitation(slug: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CabinetsApi.cancelInvitation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cabinet-invitations", slug] });
    },
  });
}

export function useRemoveMember(slug: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => CabinetsApi.removeMember(slug!, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cabinet-members", slug] });
    },
  });
}

export function useUpdateMemberRole(slug: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "OWNER" | "STAFF" }) =>
      CabinetsApi.updateMemberRole(slug!, userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cabinet-members", slug] });
    },
  });
}
