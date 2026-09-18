"use client";

import { AuthGuard } from "@/components/layout/AuthGuard";
import { OrderTicket } from "@/components/kitchen/OrderTicket";
import { useRealtime } from "@/hooks/useRealtime";
import { useActiveOrders } from "@/hooks/useOrders";

function KitchenView() {
  useRealtime();
  const { data: orders, isLoading } = useActiveOrders();
  const kitchenOrders = (orders ?? []).filter((order) =>
    ["PENDING", "PREPARING", "READY"].includes(order.status)
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-[#f5efe9]">
          Kitchen display
        </h1>
        <p className="font-mono text-sm text-[#a89e97]">{kitchenOrders.length} active tickets</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-[#a89e97]">Loading tickets...</p>
      ) : kitchenOrders.length === 0 ? (
        <p className="text-sm text-[#a89e97]">No active tickets right now.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kitchenOrders.map((order) => (
            <OrderTicket key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function KitchenPage() {
  return (
    <AuthGuard allowedRoles={["KITCHEN", "MANAGER"]}>
      <KitchenView />
    </AuthGuard>
  );
}
