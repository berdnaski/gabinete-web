import { apiClient } from "../apiClient";

const baseURL = "/auth"

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
}

export interface LoginResponse {
	expiresIn: number;
	accessToken: string;
}

export interface RegisterResponse {
	message: string;
}

export interface GetUserProfileResponse {
	id: string;
	name: string;
	role: string;
	email: string;
	avatar_url: string;
}

export const AuthApi = {
	register: async (data: RegisterRequest): Promise<void> => {
		await apiClient.post<RegisterResponse>(`${baseURL}/register`, data);
	},
	forgotPassword: async (email: string): Promise<void> => {
		await apiClient.post(`${baseURL}/forgot-password`, { email });
	},
	resetPassword: async (data: { token: string; password: string }): Promise<void> => {
		await apiClient.post(`${baseURL}/reset-password`, data);
	},
	login: async (data: LoginRequest): Promise<LoginResponse> => {
		const response = await apiClient.post(`${baseURL}/login`, data);
		return response.data
	},
	getUserProfile: async (): Promise<GetUserProfileResponse> => {
		const response = await apiClient.get(`${baseURL}/me`);
		return response.data;
	}
};
