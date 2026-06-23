import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bugsApi } from "@/lib/api/bugs";
import { BugIn, BugUpdate } from "@/lib/api/types";

export function useBugs() {
  return useQuery({
    queryKey: ["bugs"],
    queryFn: () => bugsApi.list(),
  });
}

export function useCreateBug() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BugIn) => bugsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs"] });
    },
  });
}

export function useUpdateBug() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BugUpdate }) =>
      bugsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs"] });
    },
  });
}

export function useDeleteBug() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bugsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs"] });
    },
  });
}
