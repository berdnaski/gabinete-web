import { apiClient } from "..";

const baseURL = "/users";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  phone?: string;
}

export const UsersApi = {
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`${baseURL}/${id}`);
    return response.data;
  },

  updateProfile: async (id: string, data: Partial<User>, file?: File): Promise<User> => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.phone) formData.append("phone", data.phone);
    if (file) formData.append("avatar", file);

    const response = await apiClient.patch<User>(`${baseURL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
