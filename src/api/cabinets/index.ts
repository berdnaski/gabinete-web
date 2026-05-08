import { apiClient } from "..";
import type { Cabinet, CabinetMember, CabinetMetrics, CabinetTrendDetailedPoint, CabinetTrendPoint } from "./types";

const baseURL = "/cabinets";

export interface PaginatedCabinetsResponse {
  items: Cabinet[];
  total: number;
}

export const CabinetsApi = {
  me: async (): Promise<Cabinet | null> => {
    const response = await apiClient.get<Cabinet[]>(`${baseURL}/me`);
    return response.data[0] ?? null;
  },

  list: async (): Promise<Cabinet[]> => {
    const response = await apiClient.get(baseURL);
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    return [];
  },

  listPaginated: async (params: {
    page: number;
    limit: number;
    search?: string;
    hasDemands?: boolean;
  }): Promise<PaginatedCabinetsResponse> => {
    const response = await apiClient.get<PaginatedCabinetsResponse>(baseURL, { params });
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Cabinet> => {
    const response = await apiClient.get<Cabinet>(`${baseURL}/${slug}`);
    return response.data;
  },

  getMembers: async (slug: string): Promise<CabinetMember[]> => {
    const response = await apiClient.get<CabinetMember[]>(`/cabinets/${slug}/members`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getMetrics: async (slug: string): Promise<CabinetMetrics> => {
    const response = await apiClient.get<CabinetMetrics>(`/demands/cabinet/${slug}/metrics`);
    return response.data;
  },

  getTrend: async (slug: string, days = 14): Promise<CabinetTrendPoint[]> => {
    const response = await apiClient.get<CabinetTrendPoint[]>(`/demands/cabinet/${slug}/trend`, {
      params: { days },
    });
    return response.data;
  },

  getTrendDetailed: async (slug: string, days = 14): Promise<CabinetTrendDetailedPoint[]> => {
    const response = await apiClient.get<CabinetTrendDetailedPoint[]>(
      `/demands/cabinet/${slug}/trend-detailed`,
      { params: { days } },
    );
    return response.data;
  },

  update: async (slug: string, data: Partial<Cabinet>, file?: File): Promise<Cabinet> => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.email) formData.append("email", data.email);
    if (file) formData.append("avatar", file);

    const response = await apiClient.patch<Cabinet>(`${baseURL}/${slug}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
