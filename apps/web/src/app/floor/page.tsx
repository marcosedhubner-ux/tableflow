"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { TableCard } from "@/components/floor/TableCard";
import { TableDetailPanel } from "@/components/floor/TableDetailPanel";
import { TableIcon } from "@/components/ui/icons";
import { useRealtime } from "@/hooks/useRealtime";
import { useTables } from "@/hooks/useTables";
import type { RestaurantTable } from "@/lib/types";

function FloorView() {
  useRealtime();
  const { data: tables, isLoading } = useTables();
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-[#f5efe9]">
          Floor
        </h1>
        <p className="text-sm text-[#a89e97]">Tap a table to view or start an order</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-[#a89e97]">Loading tables...</p>
      ) : tables && tables.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-sm border-2 border-dashed border-[#2a2523] py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-sm border-2 border-[#2a2523] text-[#ff5a3c]">
            <TableIcon width={28} height={28} />
          </span>
          <p className="text-sm text-[#a89e97]">No tables configured yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tables?.map((table) => (
            <TableCard key={table.id} table={table} onSelect={setSelectedTable} />
          ))}
        </div>
      )}

      {selectedTable && (
        <TableDetailPanel
          table={tables?.find((t) => t.id === selectedTable.id) ?? selectedTable}
          onClose={() => setSelectedTable(null)}
        />
      )}
    </div>
  );
}

export default function FloorPage() {
  return (
    <AuthGuard allowedRoles={["SERVER", "MANAGER"]}>
      <FloorView />
    </AuthGuard>
  );
}
