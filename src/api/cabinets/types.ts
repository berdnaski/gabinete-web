export interface Cabinet {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  email?: string;
  score: number;
  demand_count: number;
  in_progress_count: number;
  resolved_count: number;
}

export interface CabinetMember {
  id: string;
  userId: string;
  cabinetId: string;
  role: "OWNER" | "STAFF";
  userName: string;
  userAvatarUrl: string | null;
  userEmail: string | null;
}

export interface CabinetStatusCounts {
  SUBMITTED: number;
  IN_ANALYSIS: number;
  IN_PROGRESS: number;
  RESOLVED: number;
  REJECTED: number;
  CANCELED: number;
}

export interface CabinetMetrics {
  new: number;
  urgent: number;
  total: number;
  resolved: number;
  statusCounts: CabinetStatusCounts;
}

export interface CabinetTrendPoint {
  date: string;
  count: number;
}

export interface CabinetTrendDetailedPoint {
  date: string;
  created: number;
  resolved: number;
}
