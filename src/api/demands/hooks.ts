import { useMutation, useQuery } from "@tanstack/react-query";
import { DemandsApi } from ".";
import { queryClient } from "../queryClient";
import type { CreateDemandProps, Demand, DemandStatus, ListDemandsParams } from "./types";


export function useCreateDemand() {
  return useMutation({
    mutationFn: (data: CreateDemandProps) => DemandsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demands"] });
    }
  })
}

export function useGetDemands(params: ListDemandsParams) {
  return useQuery({
    queryKey: ["demands", params],
    queryFn: () => DemandsApi.list(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useUpdateDemandStatus() {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DemandStatus }) =>
      DemandsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demands"] });
    },
  });
}

export function useUpdateDemand() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Demand> }) =>
      DemandsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demands"] });
    },
  });
}

export function useAddEvidences() {
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      DemandsApi.addEvidences(id, formData),
  });
}
