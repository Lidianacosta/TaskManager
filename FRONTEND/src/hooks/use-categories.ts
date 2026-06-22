import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  categoriesApi,
  type Category,
  type CategoryIn,
  type CategoryUpdate,
} from "@/lib/api";

export const CATEGORIES_KEY = ["categories"] as const;

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: () => categoriesApi.list(),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryIn) => categoriesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdate }) =>
      categoriesApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: CATEGORIES_KEY });
      const previous = qc.getQueryData<Category[]>(CATEGORIES_KEY);
      qc.setQueryData<Category[]>(CATEGORIES_KEY, (old) =>
        old?.map((c) => (c.id === id ? ({ ...c, ...data } as Category) : c)),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(CATEGORIES_KEY, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: CATEGORIES_KEY });
      const previous = qc.getQueryData<Category[]>(CATEGORIES_KEY);
      qc.setQueryData<Category[]>(CATEGORIES_KEY, (old) =>
        old?.filter((c) => c.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(CATEGORIES_KEY, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}
