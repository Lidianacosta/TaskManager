import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bugsApi } from "@/lib/api/bugs";
import { BugIn } from "@/lib/api/types";

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
