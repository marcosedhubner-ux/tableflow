"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useUpdateOrderItem, useUpdateOrderStatus } from "@/hooks/useOrders";
import type { Order } from "@/lib/types";

function elapsedMinutes(createdAt: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(createdAt).getTime()) / 60000));
}

export function OrderTicket({ order }: { order: Order }) {
  const updateOrderStatus = useUpdateOrderStatus();
  const updateOrderItem = useUpdateOrderItem();
  const minutes = elapsedMinutes(order.createdAt);

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900">Table {order.table.tableNumber}</span>
        <Badge tone={minutes > 15 ? "danger" : minutes > 8 ? "warning" : "neutral"}>
          {minutes} min
        </Badge>
      </div>

      <ul className="mt-3 space-y-2">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-slate-800">
                {item.quantity}x {item.menuItem.name}
              </p>
              {item.notes && <p className="text-xs text-slate-400">{item.notes}</p>}
            </div>
            {order.status === "PREPARING" && (
              <input
                type="checkbox"
                checked={item.isReady}
                onChange={(event) =>
                  updateOrderItem.mutate({ itemId: item.id, isReady: event.target.checked })
                }
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
            )}
            {item.isReady && order.status !== "PREPARING" && <Badge tone="success">Ready</Badge>}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        {order.status === "PENDING" && (
          <Button
            className="w-full"
            onClick={() => updateOrderStatus.mutate({ orderId: order.id, status: "PREPARING" })}
          >
            Accept ticket
          </Button>
        )}
        {order.status === "READY" && (
          <Badge tone="success">All items ready — waiting for pickup</Badge>
        )}
      </div>
    </div>
  );
}
