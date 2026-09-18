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
    return <p className="text-sm text-[#a89e97]">Loading menu...</p>;
  }

  const availableItems = (menuItems ?? []).filter((item) => item.isAvailable);
  const categories = Array.from(new Set(availableItems.map((item) => item.category)));

  return (
    <div className="space-y-5">
      {categories.map((category) => (
        <div key={category}>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[#a89e97]">
            {category}
          </h4>
          <div className="mt-2 space-y-2">
            {availableItems
              .filter((item) => item.category === category)
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#f5efe9]">{item.name}</p>
                    <p className="font-mono text-xs text-[#a89e97]">
                      ${Number(item.unitPrice).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, (quantities[item.id] ?? 0) - 1)}
                      className="h-7 w-7 rounded-sm border-2 border-[#2a2523] text-[#a89e97] hover:border-[#ff5a3c] hover:text-[#ff5a3c]"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-mono text-sm text-[#f5efe9]">
                      {quantities[item.id] ?? 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, (quantities[item.id] ?? 0) + 1)}
                      className="h-7 w-7 rounded-sm border-2 border-[#2a2523] text-[#a89e97] hover:border-[#ff5a3c] hover:text-[#ff5a3c]"
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
