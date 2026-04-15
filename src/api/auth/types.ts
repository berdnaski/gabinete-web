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

export interface Cabinet {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
}

export interface RegisterCabinetRequest {
	cabinetName: string;
	cabinetSlug: string;
	ownerName: string;
	ownerEmail: string;
	ownerPassword: string;
}

export interface RegisterCabinetResponse {
	cabinet: Cabinet;
	user: GetUserProfileResponse;
}