import { apiClient } from "..";
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
	refreshToken: string;
}

export interface RegisterResponse {
	message: string;
}
export interface ChangePasswordRequest {
	currentPassword: string;
	newPassword: string;
}

export interface GetUserProfileResponse {
	id: string;
	name: string;
	role: string;
	email: string;
	avatarUrl: string;
	phone: string | null;
	hasSetPassword: boolean;
	isCabinetMember: boolean;
}

export const AuthApi = {
	register: async (data: RegisterRequest): Promise<void> => {
		await apiClient.post(`${baseURL}/register`, data);
	},
	forgotPassword: async (email: string): Promise<void> => {
		await apiClient.post(`${baseURL}/forgot-password`, { email });
	},
	resetPassword: async (data: { token: string; password: string }): Promise<void> => {
		await apiClient.post(`${baseURL}/reset-password`, data);
	},
	changePassword: async (data: ChangePasswordRequest): Promise<void> => {
		await apiClient.patch(`${baseURL}/change-password`, data);
	},
	login: async (data: LoginRequest): Promise<LoginResponse> => {
		const response = await apiClient.post(`${baseURL}/login`, data);
		return response.data
	},
	verifyEmail: async (token: string): Promise<void> => {
		await apiClient.post(`${baseURL}/verify-email`, { token });
	},
	getUserProfile: async (): Promise<GetUserProfileResponse> => {
		const response = await apiClient.get(`${baseURL}/me`);
		return response.data;
	},
	confirmChangePassword: async (token: string): Promise<void> => {
		await apiClient.post(`${baseURL}/confirm-change-password`, { token });
	},
	logout: async (): Promise<void> => {
		await apiClient.post(`${baseURL}/logout`);
	}
};
