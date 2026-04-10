import { useMutation, useQuery } from "@tanstack/react-query";
import { UsersApi, type User } from ".";
import { queryClient } from "../queryClient";

export function useGetUserById(id: string | undefined) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => UsersApi.getById(id!),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ id, data, file }: { id: string; data: Partial<User>; file?: File }) =>
      UsersApi.updateProfile(id, data, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
  });
}
