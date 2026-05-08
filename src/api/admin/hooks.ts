import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryClient } from "../queryClient"
import {
  AdminApi,
  type CreateAdminUserRequest,
  type CreateCabinetWithOwnerRequest,
  type UpdateAdminUserRequest,
} from "@/api/admin"

export function useAdminCreateCabinetWithOwner() {
  return useMutation({
    mutationFn: (data: CreateCabinetWithOwnerRequest) =>
      AdminApi.createCabinetWithOwner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cabinets"] })
      toast.success("Gabinete criado com sucesso!")
    },
  })
}

export function useAdminUpdateCabinet() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCabinetWithOwnerRequest }) =>
      AdminApi.updateCabinet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cabinets"] })
      toast.success("Gabinete atualizado com sucesso!")
    },
  })
}

export function useAdminDeleteCabinet() {
  return useMutation({
    mutationFn: (id: string) => AdminApi.deleteCabinet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cabinets"] })
      toast.success("Gabinete desativado com sucesso!")
    },
  })
}

export function useAdminCreateUser() {
  return useMutation({
    mutationFn: (data: CreateAdminUserRequest) => AdminApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Usuário criado com sucesso!")
    },
  })
}

export function useAdminUpdateUser() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminUserRequest }) =>
      AdminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Usuário atualizado com sucesso!")
    },
  })
}
