import { apiClient } from "../apiClient";
import { DemandPriority, DemandStatus, type Demand, type PaginatedResponse } from "../../types/demand-types";

const baseURL = "/demands";

export interface CreateDemandProps {
	title: string;
	description: string;
	categoryId: string;
	address?: string;
	latitude?: string;
	longitude?: string;
	files: File[];
}

export interface ListDemandsParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: DemandStatus;
	priority?: DemandPriority;
	startDate?: string;
	endDate?: string;
}

export const DemandsApi = {

    async create(props: CreateDemandProps) {	
			const { data } = await apiClient.post<Demand>(baseURL, props);
			console.log(data)
			return data
    },

		list: async (params: ListDemandsParams): Promise<PaginatedResponse<Demand>> => {
			const response = await apiClient.get<PaginatedResponse<Demand>>(baseURL, {
				params: {
					page: params.page,
					limit: params.limit,
					search: params.search,
					status: params.status,
					priority: params.priority,
					startDate: params.startDate,
					endDate: params.endDate,
				}
			});
			return response.data;
    },

		getById: async (id: string): Promise<Demand> => {
        const response = await apiClient.get<Demand>(`${baseURL}/${id}`);
        return response.data;
    },

    updateStatus: async (id: string, status: DemandStatus): Promise<Demand> => {
        const response = await apiClient.patch<Demand>(`${baseURL}/${id}/status`, { status });
        return response.data;
    },

    update: async (id: string, data: Partial<Demand>): Promise<Demand> => {
        const response = await apiClient.patch<Demand>(`${baseURL}/${id}`, data);
        return response.data;
    },
};
