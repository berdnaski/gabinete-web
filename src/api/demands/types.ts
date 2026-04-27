export const DemandStatus = {
	SUBMITTED: "SUBMITTED",
	IN_ANALYSIS: "IN_ANALYSIS",
	IN_PROGRESS: "IN_PROGRESS",
	RESOLVED: "RESOLVED",
	REJECTED: "REJECTED",
	CANCELED: "CANCELED",
} as const

export type DemandStatus = (typeof DemandStatus)[keyof typeof DemandStatus]

export const DemandStatusLabel: Record<DemandStatus, string> = {
	SUBMITTED: "Enviada",
	IN_ANALYSIS: "Em análise",
	IN_PROGRESS: "Em progresso",
	RESOLVED: "Resolvida",
	REJECTED: "Rejeitada",
	CANCELED: "Cancelada",
}

export const DemandPriority = {
	URGENT: "URGENT",
	HIGH: "HIGH",
	MEDIUM: "MEDIUM",
	LOW: "LOW",
} as const

export type DemandPriority = (typeof DemandPriority)[keyof typeof DemandPriority]

export interface Category {
	id: string;
	name: string;
}

export interface User {
	id: string;
	name: string;
	email: string;
}

export interface Demand {
	id: string;
	title: string;
	description: string;
	status: DemandStatus;
	priority?: DemandPriority;
	address?: string;
	zipcode?: string;
	lat?: number;
	long?: number;
	neighborhood?: string;
	city?: string;
	state?: string;
	reporterId: string;
	guestEmail?: string;
	cabinetId?: string;
	cabinet?: {
		name: string;
		slug: string;
		avatarUrl: string | null;
	} | null;
	date?: string;
	categoryId: string;
	assigneeMemberId?: string;
	reporter?: {
		name: string;
		avatarUrl?: string;
	};
	category: Category;
	createdAt: string;
	updatedAt: string;
	disabledAt?: string;
	evidences?: Evidence[];
	likesCount: number;
	commentsCount: number;
	isLiked: boolean;
	results: string[];
}

export interface Evidence {
	id: string;
	storageKey: string;
	url: string;
	mimeType: string;
	size: number;
	demandId: string;
}

export interface CreateDemandProps {
	title: string;
	description: string;
	categoryId: string;
	cabinetId?: string;
	priority?: DemandPriority;
	address?: string;
	zipcode?: string;
	lat?: number;
	long?: number;
	neighborhood?: string;
	city?: string;
	state?: string;
	guestEmail?: string;
}

export interface ListDemandsParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: DemandStatus;
	priority?: DemandPriority;
	startDate?: string;
	endDate?: string;
	neighborhood?: string;
}

export interface HeatmapPoint {
	id: string;
	lat: number;
	lng: number;
	weight: number;
	title: string;
	status: string;
	categoryName: string;
	neighborhood: string | null;
}

export interface HeatmapInsight {
	topNeighborhood: string;
	occurrenceCount: number;
	text: string;
}

export interface HeatmapResponse {
	points: HeatmapPoint[];
	insight: HeatmapInsight | null;
}

export interface NeighborhoodCount {
	neighborhood: string;
	count: number;
}

export interface ListDemandsByCabinetSlugParams extends ListDemandsParams {
	slug: string;
	assigneeMemberId?: string;
}
export interface PaginationMeta {
	limit: number;
	page: number;
	total: number;
	totalPages: number;
}

export interface PaginatedResponse<T> {
	items: T[];
	meta: PaginationMeta;
}

export interface DemandComments {
	id: string;
	authorId: string;
	content: string;
	demandId: string;
	createdAt: string;
	authorName: string;
	authorAvatarUrl: string;
	isCabinetResponse: boolean;
	isStatusUpdate: boolean;
}

export interface ListDemandCommentsParams {
	demandId: string;
	page?: number;
	limit?: number;
}

export interface DemandCommmentsPaginatedResponse {
	items: DemandComments[]
	total: number;
}

export interface CreateDemandCommentProps {
	content: string;
	demandId: string;
}