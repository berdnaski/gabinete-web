import { apiClient } from "..";
import type { Cabinet } from "./types";

const baseURL = "/cabinets";

export const CabinetsApi = {
  me: async (): Promise<Cabinet | null> => {
    const response = await apiClient.get<Cabinet[]>(`${baseURL}/me`);
    return response.data[0] ?? null;
  },

  list: async (): Promise<Cabinet[]> => {
    const response = await apiClient.get<Cabinet[]>(baseURL);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Cabinet> => {
    const response = await apiClient.get<Cabinet>(`${baseURL}/${slug}`);
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
