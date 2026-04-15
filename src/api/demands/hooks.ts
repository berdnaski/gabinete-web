import { useMutation, useQuery } from "@tanstack/react-query";
import { DemandsApi } from ".";
import { queryClient } from "../queryClient";
import type { CreateDemandProps, Demand, DemandStatus, ListDemandsParams } from "./types";


export function useCreateDemand() {
  return useMutation({
    mutationFn: (data: CreateDemandProps) => DemandsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demands"] });
    },
  });
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

export function useGeneratePresignedUploadUrl() {
  return useMutation({
    mutationFn: ({ demandId, filename }: { demandId: string; filename: string }) =>
      DemandsApi.generatePresignedUploadUrl(demandId, filename),
  });
}

export function useUploadToR2() {
  return useMutation({
    mutationFn: ({ uploadUrl, file }: { uploadUrl: string; file: File }) =>
      DemandsApi.uploadToR2(uploadUrl, file),
  });
}

export function useConfirmEvidenceUpload() {
  return useMutation({
    mutationFn: ({ demandId, storageKey, size }: { demandId: string; storageKey: string; size: number }) =>
      DemandsApi.confirmEvidenceUpload(demandId, storageKey, size),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demands"] });
      queryClient.refetchQueries({ queryKey: ["demands"] });
    },
  });
}
