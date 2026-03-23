import { useMutation, useQuery } from "@tanstack/react-query";
import { DemandsApi, type CreateDemandProps } from ".";
import type { Demand, DemandStatus, ListDemandsParams } from "@/types/demand-types";
import { queryClient } from "../queryClient";


export function useCreateDemand() {
	return useMutation({
		mutationFn: (data: CreateDemandProps) => DemandsApi.create(data),
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
