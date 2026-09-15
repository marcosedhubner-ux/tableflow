"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { TableCard } from "@/components/floor/TableCard";
import { TableDetailPanel } from "@/components/floor/TableDetailPanel";
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
        <h1 className="text-2xl font-bold text-slate-900">Floor</h1>
        <p className="text-sm text-slate-500">Tap a table to view or start an order</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading tables...</p>
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
