import { apiClient } from ".."

export interface CreateCabinetWithOwnerRequest {
  ownerUserId: string
  name: string
  email?: string
  description?: string
  avatarUrl?: string
}

export interface CreateCabinetWithOwnerResponse {
  cabinet: {
    id: string
    name: string
    slug: string
    email: string | null
    description: string | null
    avatarUrl: string | null
  }
  ownerUser: {
    id: string
    name: string
    email: string
    role: string
    phone: string | null
  }
  ownerMember: {
    id: string
    role: string
  }
}

export interface AdminCabinetDetailsResponse {
  cabinet: CreateCabinetWithOwnerResponse["cabinet"]
  ownerUser: CreateCabinetWithOwnerResponse["ownerUser"] | null
  ownerMember: CreateCabinetWithOwnerResponse["ownerMember"] | null
}

export const AdminApi = {
  presignCabinetAvatarUpload: async (data: {
    filename: string
    mimetype: string
  }): Promise<{ uploadUrl: string; storageKey: string; avatarUrl: string }> => {
    const response = await apiClient.post<{
      uploadUrl: string
      storageKey: string
      avatarUrl: string
    }>("/admin/cabinets/avatar/presign", data)
    return response.data
  },

  uploadToR2: async (uploadUrl: string, file: File): Promise<void> => {
    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type || "image/jpeg",
      },
    })
  },

  getCabinetDetails: async (id: string): Promise<AdminCabinetDetailsResponse> => {
    const response = await apiClient.get<AdminCabinetDetailsResponse>(
      `/admin/cabinets/${id}`,
    )
    return response.data
  },

  createCabinetWithOwner: async (
    data: CreateCabinetWithOwnerRequest,
  ): Promise<CreateCabinetWithOwnerResponse> => {
    const response = await apiClient.post<CreateCabinetWithOwnerResponse>(
      "/admin/cabinets",
      data,
    )
    return response.data
  },

  updateCabinet: async (
    id: string,
    data: CreateCabinetWithOwnerRequest,
  ): Promise<AdminCabinetDetailsResponse> => {
    const response = await apiClient.patch<AdminCabinetDetailsResponse>(
      `/admin/cabinets/${id}`,
      data,
    )
    return response.data
  },

  deleteCabinet: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/cabinets/${id}`)
  },
}
