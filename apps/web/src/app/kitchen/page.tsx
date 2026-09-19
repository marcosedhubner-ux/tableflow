"use client";

import { AuthGuard } from "@/components/layout/AuthGuard";
import { OrderTicket } from "@/components/kitchen/OrderTicket";
import { TicketIcon } from "@/components/ui/icons";
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
        <div className="flex flex-col items-center gap-3 rounded-sm border-2 border-dashed border-[#2a2523] py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-sm border-2 border-[#2a2523] text-[#ff5a3c]">
            <TicketIcon width={28} height={28} />
          </span>
          <p className="text-sm text-[#a89e97]">No active tickets right now.</p>
        </div>
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
