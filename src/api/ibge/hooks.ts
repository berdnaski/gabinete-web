import { useQuery } from "@tanstack/react-query"
import { IbgeApi } from "."

export const useGetStates = () => {
  return useQuery({
    queryKey: ["ibge-states"],
    queryFn: () => IbgeApi.getState(),
  })
}

export const useGetCitiesFromState = (stateId: string) => {
  return useQuery({
    queryKey: ["ibge-cities", stateId],
    queryFn: () => IbgeApi.getCitiesFromState(stateId),
    enabled: !!stateId,
  })
}