"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useMenu } from "@/hooks/useMenu";
import { useCreateOrder } from "@/hooks/useOrders";

export function NewOrderForm({ tableId, onCreated }: { tableId: string; onCreated: () => void }) {
  const { data: menuItems, isLoading } = useMenu();
  const createOrder = useCreateOrder();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  function setQuantity(menuItemId: string, quantity: number) {
    setQuantities((prev) => ({ ...prev, [menuItemId]: Math.max(0, quantity) }));
  }

  function handleSubmit() {
    const items = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([menuItemId, quantity]) => ({ menuItemId, quantity }));

    if (items.length === 0) return;

    createOrder.mutate(
      { tableId, items },
      {
        onSuccess: () => {
          setQuantities({});
          onCreated();
        },
      }
    );
  }

  if (isLoading) {
    return <p className="text-sm text-slate-400">Loading menu...</p>;
  }

  const availableItems = (menuItems ?? []).filter((item) => item.isAvailable);
  const categories = Array.from(new Set(availableItems.map((item) => item.category)));

  return (
    <div className="space-y-5">
      {categories.map((category) => (
        <div key={category}>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {category}
          </h4>
          <div className="mt-2 space-y-2">
            {availableItems
              .filter((item) => item.category === category)
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400">${Number(item.unitPrice).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, (quantities[item.id] ?? 0) - 1)}
                      className="h-7 w-7 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-sm">{quantities[item.id] ?? 0}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, (quantities[item.id] ?? 0) + 1)}
                      className="h-7 w-7 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={createOrder.isPending}
      >
        {createOrder.isPending ? "Sending to kitchen..." : "Send order to kitchen"}
      </Button>
    </div>
  );
}
