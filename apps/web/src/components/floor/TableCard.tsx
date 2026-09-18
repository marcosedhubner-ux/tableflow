import clsx from "clsx";
import { Badge } from "@/components/ui/Badge";
import type { RestaurantTable, TableStatus } from "@/lib/types";

const STATUS_TONE: Record<TableStatus, "success" | "warning" | "info" | "neutral"> = {
  AVAILABLE: "success",
  OCCUPIED: "warning",
  RESERVED: "info",
  CLEANING: "neutral",
};

const STATUS_BORDER: Record<TableStatus, string> = {
  AVAILABLE: "border-[#3f6b52]",
  OCCUPIED: "border-[#6b5a34]",
  RESERVED: "border-[#6b4034]",
  CLEANING: "border-[#2a2523]",
};

export function TableCard({
  table,
  onSelect,
}: {
  table: RestaurantTable;
  onSelect: (table: RestaurantTable) => void;
}) {
  const activeOrder = table.orders[0];

  return (
    <button
      onClick={() => onSelect(table)}
      className={clsx(
        "flex flex-col gap-3 rounded-sm border-2 bg-[#1e1b19] p-4 text-left transition-colors hover:border-[#ff5a3c]",
        STATUS_BORDER[table.status]
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-heading text-lg font-bold text-[#f5efe9]">
          Table <span className="font-mono">{table.tableNumber}</span>
        </span>
        <Badge tone={STATUS_TONE[table.status]}>{table.status}</Badge>
      </div>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#a89e97]">
        <span className="capitalize">{table.tableType.toLowerCase()}</span>
        <span>&middot;</span>
        <span>{table.seatCount} seats</span>
      </div>
      {activeOrder ? (
        <div className="mt-1 flex items-center justify-between border-t-2 border-[#2a2523] pt-3 text-sm">
          <span className="text-[#a89e97]">{activeOrder.items.length} items</span>
          <span className="font-mono font-semibold text-[#ff5a3c]">
            ${Number(activeOrder.totalValue).toFixed(2)}
          </span>
        </div>
      ) : (
        <div className="mt-1 border-t-2 border-[#2a2523] pt-3 text-sm text-[#6b6360]">
          No order
        </div>
      )}
    </button>
  );
}
