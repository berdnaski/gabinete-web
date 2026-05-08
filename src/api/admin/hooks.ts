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

