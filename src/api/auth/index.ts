import { apiClient } from "../apiClient";
import type { RegisterCabinetRequest, RegisterCabinetResponse } from "../../types/auth-types";

const baseURL = "/auth"

export type RegisterRequest = RegisterCabinetRequest;
export type RegisterResponse = RegisterCabinetResponse;

export interface SignInRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    id: string;
    name: string;
    email: string;
    role: string;
    cabinetId: string;
    access_token: string;
}

export const AuthApi = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await apiClient.post<RegisterResponse>(`${baseURL}/register-cabinet`, data);
        return response.data;
    },
    signIn: async (data: SignInRequest): Promise<AuthResponse> => {
        const response = await apiClient.post(`${baseURL}/login`, data);
        return response.data
    }
};
