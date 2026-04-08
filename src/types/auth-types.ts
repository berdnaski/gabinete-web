export interface Cabinet {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
}

export interface User {
	id: string;
	name: string;
	email: string;
	role?: string;
	avatar_url?: string;
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
	user: User;
}