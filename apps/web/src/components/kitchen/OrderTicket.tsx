"use client";

import clsx from "clsx";
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
  const isUrgent = minutes > 15;

  return (
    <div
      className={clsx(
        "flex flex-col rounded-sm border-2 bg-[#1e1b19] p-4 transition-colors duration-150",
        isUrgent ? "border-[#6b3a30] animate-border-flicker" : "border-[#2a2523]"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-heading text-lg font-bold text-[#f5efe9]">
          Table <span className="font-mono">{order.table.tableNumber}</span>
        </span>
        <Badge
          tone={isUrgent ? "danger" : minutes > 8 ? "warning" : "neutral"}
          pulse={order.status === "PREPARING"}
        >
          <span className="font-mono">{minutes} min</span>
        </Badge>
      </div>

      <ul className="mt-3 space-y-2">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-[#f5efe9]">
                <span className="font-mono">{item.quantity}x</span> {item.menuItem.name}
              </p>
              {item.notes && <p className="text-xs text-[#a89e97]">{item.notes}</p>}
            </div>
            {order.status === "PREPARING" && (
              <input
                type="checkbox"
                checked={item.isReady}
                onChange={(event) =>
                  updateOrderItem.mutate({ itemId: item.id, isReady: event.target.checked })
                }
                className="mt-1 h-4 w-4 rounded-sm border-2 border-[#2a2523] accent-[#ff5a3c]"
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
