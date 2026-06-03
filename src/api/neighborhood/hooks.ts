import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { NeighborhoodApi } from "./index"
import type { CreateNeighborhoodPayload } from "./types"

const NEIGHBORHOODS_KEY = ["user-neighborhoods"]

export function useListUserNeighborhoods() {
  return useQuery({
    queryKey: NEIGHBORHOODS_KEY,
    queryFn: () => NeighborhoodApi.list(),
  })
}

export function useAddUserNeighborhood() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateNeighborhoodPayload) =>
      NeighborhoodApi.add(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEIGHBORHOODS_KEY })
      toast.success("Bairro salvo!")
    },
    onError: () => toast.error("Erro ao salvar bairro."),
  })
}

export function useRemoveUserNeighborhood() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => NeighborhoodApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEIGHBORHOODS_KEY })
      toast.success("Bairro removido.")
    },
    onError: () => toast.error("Erro ao remover bairro."),
  })
}

export function useSetPrimaryNeighborhood() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => NeighborhoodApi.setPrimary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEIGHBORHOODS_KEY })
    },
    onError: () => toast.error("Erro ao definir bairro principal."),
  })
}

export function useNeighborhoodDashboard(
  neighborhood?: string,
  city?: string,
  state?: string,
) {
  return useQuery({
    queryKey: ["neighborhood-dashboard", neighborhood, city, state],
    queryFn: () => NeighborhoodApi.getDashboard(neighborhood!, city!, state!),
    enabled: !!neighborhood && !!city && !!state,
    staleTime: 5 * 60 * 1000,
  })
}
