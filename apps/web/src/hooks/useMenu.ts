import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { MenuItem } from "@/lib/types";

export function useMenu() {
  return useQuery({
    queryKey: ["menu"],
    queryFn: () => apiClient.get<{ menuItems: MenuItem[] }>("/menu"),
    select: (data) => data.menuItems,
  });
}
