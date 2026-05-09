export interface Cabinet {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string | null;
  logoUrl?: string | null;
  accentColor?: string | null;
  tagline?: string | null;
  postDemandMessage?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  websiteUrl?: string | null;
  twitterUrl?: string | null;
  email?: string;
  score: number;
  demand_count: number;
  in_progress_count: number;
  resolved_count: number;
  transparencyScore: number;
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

export interface CabinetInvitation {
  id: string;
  email: string;
  cabinetId: string;
  role: "OWNER" | "STAFF";
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface CabinetInvitationDetails {
  email: string;
  role: "OWNER" | "STAFF";
  cabinetName: string;
  expiresAt: string;
}
