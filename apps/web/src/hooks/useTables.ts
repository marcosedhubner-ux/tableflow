import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { RestaurantTable, TableStatus } from "@/lib/types";

export function useTables() {
  return useQuery({
    queryKey: ["tables"],
    queryFn: () => apiClient.get<{ tables: RestaurantTable[] }>("/tables"),
    select: (data) => data.tables,
  });
}

export function useUpdateTableStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, status }: { tableId: string; status: TableStatus }) =>
      apiClient.patch(`/tables/${tableId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}
