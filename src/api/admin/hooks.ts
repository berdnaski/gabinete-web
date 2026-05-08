import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryClient } from "../queryClient"
import { AdminApi, type CreateCabinetWithOwnerRequest } from "."

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
