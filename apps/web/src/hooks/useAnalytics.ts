import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { DailySummary } from "@/lib/types";

export function useDailySummary() {
  return useQuery({
    queryKey: ["analytics", "daily-summary"],
    queryFn: () => apiClient.get<DailySummary>("/analytics/daily-summary"),
    refetchInterval: 30_000,
  });
}
