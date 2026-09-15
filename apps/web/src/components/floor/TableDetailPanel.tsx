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
    <div className="fixed inset-0 z-20 flex justify-end bg-slate-900/30" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Table {table.tableNumber}</h2>
            <p className="text-sm text-slate-500">
              {table.tableType.toLowerCase()} &middot; {table.seatCount} seats
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            Close
          </button>
        </div>

        {activeOrder ? (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <Badge tone="info">{activeOrder.status}</Badge>
              <span className="text-lg font-bold text-slate-900">
                ${Number(activeOrder.totalValue).toFixed(2)}
              </span>
            </div>

            <ul className="mt-4 divide-y divide-slate-100">
              {activeOrder.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">
                      {item.quantity}x {item.menuItem.name}
                    </p>
                    {item.notes && <p className="text-xs text-slate-400">{item.notes}</p>}
                  </div>
                  <Badge tone={item.isReady ? "success" : "neutral"}>
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
            <p className="text-sm text-slate-500">This table is being cleaned.</p>
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
