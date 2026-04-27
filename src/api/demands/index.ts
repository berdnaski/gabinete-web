import { apiClient } from "..";
import type { CreateDemandCommentProps, CreateDemandProps, Demand, DemandCommmentsPaginatedResponse, DemandStatus, HeatmapResponse, ListDemandCommentsParams, ListDemandsByCabinetSlugParams, ListDemandsParams, NeighborhoodCount, PaginatedResponse } from "./types";

export type { CreateDemandProps } from "./types";

const baseURL = "/demands";

export const DemandsApi = {

	async create(props: CreateDemandProps) {
		const { data } = await apiClient.post<Demand>(baseURL, props);
		return data
	},

	list: async (params: ListDemandsParams): Promise<PaginatedResponse<Demand>> => {
		const response = await apiClient.get<PaginatedResponse<Demand>>(baseURL, {
			params: {
				page: params.page,
				limit: params.limit,
				status: params.status,
				search: params.search,
				endDate: params.endDate,
				priority: params.priority,
				startDate: params.startDate,
				neighborhood: params.neighborhood,
			}
		});
		return response.data;
	},

	listDemandsByCabinetSlug: async ({ slug, ...params }: ListDemandsByCabinetSlugParams) => {
		const response = await apiClient.get(`${baseURL}/cabinet/${slug}`, {
			params
		})

		return response.data
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

	addEvidences: async (id: string, formData: FormData): Promise<void> => {
		await apiClient.post(`${baseURL}/${id}/evidences`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
	},

	generatePresignedUploadUrl: async (
		id: string,
		filename: string,
	): Promise<{ uploadUrl: string; storageKey: string }> => {
		const response = await apiClient.post<{ uploadUrl: string; storageKey: string }>(
			`${baseURL}/${id}/evidence/presign`,
			{ filename },
		);
		return response.data;
	},

	uploadToR2: async (uploadUrl: string, file: File): Promise<void> => {
		await fetch(uploadUrl, {
			method: 'PUT',
			body: file,
			headers: {
				'Content-Type': file.type || 'image/jpeg',
			},
		});
	},

	like: async (id: string): Promise<void> => {
		await apiClient.post(`${baseURL}/${id}/like`);
	},

	claim: async (id: string): Promise<Demand> => {
		const response = await apiClient.post<Demand>(`${baseURL}/${id}/claim`);
		return response.data;
	},

	assign: async (id: string, assigneeMemberId: string): Promise<Demand> => {
		const response = await apiClient.patch<Demand>(`${baseURL}/${id}/assign`, { assigneeMemberId });
		return response.data;
	},

	unlink: async (id: string): Promise<Demand> => {
		const response = await apiClient.patch<Demand>(`${baseURL}/${id}/unlink`);
		return response.data;
	},

	updateProgress: async (id: string, status: DemandStatus, note?: string): Promise<Demand> => {
		const response = await apiClient.patch<Demand>(`${baseURL}/${id}/progress`, { status, note });
		return response.data;
	},

	confirmEvidenceUpload: async (
		id: string,
		storageKey: string,
		size: number,
	): Promise<void> => {
		await apiClient.post(`${baseURL}/${id}/evidence/confirm`, {
			storageKey,
			size,
		});
	},

	listDemandComments: async ({ demandId, page, limit }: ListDemandCommentsParams): Promise<DemandCommmentsPaginatedResponse> => {
		const response = await apiClient.get<DemandCommmentsPaginatedResponse>(`/demands/${demandId}/comments`, {
			params: { page, limit },
		});
		return response.data;
	},

	createDemandComment: async ({ demandId, content }: CreateDemandCommentProps): Promise<Comment> => {
		const { data } = await apiClient.post<Comment>(`/demands/${demandId}/comments`, { content });
		return data;
	},

	getHeatmap: async (): Promise<HeatmapResponse> => {
		const response = await apiClient.get<HeatmapResponse>(`${baseURL}/heatmap`);
		return response.data;
	},

	getNeighborhoods: async (): Promise<NeighborhoodCount[]> => {
		const response = await apiClient.get(`${baseURL}/neighborhoods`);
		const data = response.data;
		if (!Array.isArray(data) || data.length === 0) return [];
		if (typeof data[0] === 'string') {
			return (data as string[]).map((n) => ({ neighborhood: n, count: 0 }));
		}
		return data as NeighborhoodCount[];
	},

	getMyDemands: async (params: ListDemandsParams): Promise<PaginatedResponse<Demand>> => {
		const response = await apiClient.get<PaginatedResponse<Demand>>(`${baseURL}/me`, {
			params: {
				page: params.page,
				limit: params.limit,
				status: params.status,
				search: params.search,
			},
		});
		return response.data;
	},
};
