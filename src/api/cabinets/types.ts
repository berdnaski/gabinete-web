export interface Cabinet {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  email?: string;
  score: number;
  demand_count: number;
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

export interface CabinetMetrics {
  new: number;
  urgent: number;
  total: number;
  resolved: number;
}
