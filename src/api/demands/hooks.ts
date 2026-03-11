import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DemandsApi } from ".";
import { DemandStatus, type Demand, type ListDemandsParams } from "../../types/demand-types";

export function useDemands(params: ListDemandsParams) {
    return useQuery({
        queryKey: ["demands", params],
        queryFn: () => DemandsApi.list(params),
        placeholderData: (previousData) => previousData,
    });
}

export function useDemand(id: string) {
    return useQuery({
        queryKey: ["demand", id],
        queryFn: () => DemandsApi.getById(id),
        enabled: !!id,
    });
}

export function useUpdateDemandStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: DemandStatus }) =>
            DemandsApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["demands"] });
        },
    });
}

export function useUpdateDemand() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Demand> }) =>
            DemandsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["demands"] });
        },
    });
}
