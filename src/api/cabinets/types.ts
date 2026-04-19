export interface Cabinet {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  email?: string;
}

export interface CabinetMember {
  id: string;
  userId: string;
  role: string;
  cabinetId: string;
}