import { useQuery } from "@tanstack/react-query";
import { CategoriesApi } from ".";
import type { ListCategoriesParams } from "@/types/categories";

export function useGetCategories(params?: ListCategoriesParams) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => CategoriesApi.getCategories(params),
    enabled: params?.enabled ?? true,
  });
}
