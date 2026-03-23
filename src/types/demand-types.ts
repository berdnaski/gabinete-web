export const DemandStatus = {
    SUBMITTED: "SUBMITTED",
    IN_ANALYSIS: "IN_ANALYSIS",
    IN_PROGRESS: "IN_PROGRESS",
    RESOLVED: "RESOLVED",
    REJECTED: "REJECTED",
} as const

export type DemandStatus = (typeof DemandStatus)[keyof typeof DemandStatus]

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
    date?: string;
    location?: string;
    address?: string;
    categoryId: string;
    category: Category;
    reporterId: string;
    reporter: User;
    assigneeId?: string | null;
    assignee?: User | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDemandPayload {
    title: string;
    description: string;
    categoryId: string;
    address?: string;
    latitude?: number;
    longitude?: number;
}

export interface ListDemandsParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: DemandStatus;
    priority?: DemandPriority;
    startDate?: string;
    endDate?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    lastPage: number;
    limit: number;
}
