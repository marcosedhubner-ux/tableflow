import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Order, OrderStatus } from "@/lib/types";

interface CreateOrderInput {
  tableId: string;
  items: { menuItemId: string; quantity: number; notes?: string }[];
}

export function useActiveOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get<{ orders: Order[] }>("/orders"),
    select: (data) => data.orders,
  });
}

function invalidateOrderQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["orders"] });
  queryClient.invalidateQueries({ queryKey: ["tables"] });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => apiClient.post<{ order: Order }>("/orders", input),
    onSuccess: () => invalidateOrderQueries(queryClient),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      apiClient.patch<{ order: Order }>(`/orders/${orderId}/status`, { status }),
    onSuccess: () => invalidateOrderQueries(queryClient),
  });
}

export function useUpdateOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, isReady }: { itemId: string; isReady: boolean }) =>
      apiClient.patch<{ order: Order }>(`/orders/items/${itemId}`, { isReady }),
    onSuccess: () => invalidateOrderQueries(queryClient),
  });
}
