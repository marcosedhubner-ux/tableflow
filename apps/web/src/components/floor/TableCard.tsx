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
  AVAILABLE: "border-emerald-200",
  OCCUPIED: "border-amber-200",
  RESERVED: "border-sky-200",
  CLEANING: "border-slate-300",
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
        "flex flex-col gap-3 rounded-xl border-2 bg-white p-4 text-left shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md",
        STATUS_BORDER[table.status]
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900">Table {table.tableNumber}</span>
        <Badge tone={STATUS_TONE[table.status]}>{table.status}</Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="capitalize">{table.tableType.toLowerCase()}</span>
        <span>&middot;</span>
        <span>{table.seatCount} seats</span>
      </div>
      {activeOrder ? (
        <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
          <span className="text-slate-600">{activeOrder.items.length} items</span>
          <span className="font-semibold text-slate-900">
            ${Number(activeOrder.totalValue).toFixed(2)}
          </span>
        </div>
      ) : (
        <div className="mt-1 border-t border-slate-100 pt-3 text-sm text-slate-400">No order</div>
      )}
    </button>
  );
}
