import { apiClient } from "../apiClient";
import type { RegisterCabinetRequest, RegisterCabinetResponse } from "../../types/auth-types";

export type RegisterRequest = RegisterCabinetRequest;
export type RegisterResponse = RegisterCabinetResponse;

export const AuthApi = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await apiClient.post<RegisterResponse>("/auth/register-cabinet", data);
        return response.data;
    },
};
