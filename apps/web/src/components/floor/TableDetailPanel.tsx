"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useUpdateOrderStatus } from "@/hooks/useOrders";
import { useUpdateTableStatus } from "@/hooks/useTables";
import type { RestaurantTable } from "@/lib/types";
import { NewOrderForm } from "./NewOrderForm";

export function TableDetailPanel({
  table,
  onClose,
}: {
  table: RestaurantTable;
  onClose: () => void;
}) {
  const updateOrderStatus = useUpdateOrderStatus();
  const updateTableStatus = useUpdateTableStatus();
  const activeOrder = table.orders[0];

  return (
    <div
      className="fixed inset-0 z-20 flex justify-end bg-black/50 animate-backdrop-in"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l-2 border-[#2a2523] bg-[#1e1b19] p-6 shadow-xl animate-panel-in"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#f5efe9]">
              Table <span className="font-mono">{table.tableNumber}</span>
            </h2>
            <p className="text-sm text-[#a89e97]">
              {table.tableType.toLowerCase()} &middot; {table.seatCount} seats
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#a89e97] transition-colors duration-150 hover:text-[#ff5a3c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a3c]"
          >
            Close
          </button>
        </div>

        {activeOrder ? (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <Badge tone="info" pulse={activeOrder.status === "PREPARING"}>
                {activeOrder.status}
              </Badge>
              <span className="font-mono text-lg font-bold text-[#ff5a3c]">
                ${Number(activeOrder.totalValue).toFixed(2)}
              </span>
            </div>

            <ul className="mt-4 divide-y-2 divide-[#2a2523]">
              {activeOrder.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p className="font-medium text-[#f5efe9]">
                      <span className="font-mono">{item.quantity}x</span> {item.menuItem.name}
                    </p>
                    {item.notes && <p className="text-xs text-[#a89e97]">{item.notes}</p>}
                  </div>
                  <Badge
                    tone={item.isReady ? "success" : "neutral"}
                    pulse={!item.isReady && activeOrder.status === "PREPARING"}
                  >
                    {item.isReady ? "Ready" : "Preparing"}
                  </Badge>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-2">
              {activeOrder.status === "SERVED" && (
                <Button
                  onClick={() =>
                    updateOrderStatus.mutate({ orderId: activeOrder.id, status: "PAID" })
                  }
                  disabled={updateOrderStatus.isPending}
                >
                  Mark as paid
                </Button>
              )}
              {activeOrder.status === "READY" && (
                <Button
                  onClick={() =>
                    updateOrderStatus.mutate({ orderId: activeOrder.id, status: "SERVED" })
                  }
                  disabled={updateOrderStatus.isPending}
                >
                  Mark as served
                </Button>
              )}
              {(activeOrder.status === "PENDING" || activeOrder.status === "PREPARING") && (
                <Button
                  variant="danger"
                  onClick={() =>
                    updateOrderStatus.mutate({ orderId: activeOrder.id, status: "CANCELLED" })
                  }
                  disabled={updateOrderStatus.isPending}
                >
                  Cancel order
                </Button>
              )}
            </div>
          </div>
        ) : table.status === "CLEANING" ? (
          <div className="mt-6">
            <p className="text-sm text-[#a89e97]">This table is being cleaned.</p>
            <Button
              className="mt-4 w-full"
              onClick={() =>
                updateTableStatus.mutate({ tableId: table.id, status: "AVAILABLE" })
              }
            >
              Mark as available
            </Button>
          </div>
        ) : (
          <div className="mt-6">
            <NewOrderForm tableId={table.id} onCreated={onClose} />
          </div>
        )}
      </div>
    </div>
  );
}
