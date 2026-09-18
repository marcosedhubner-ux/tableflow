"use client";

import { AuthGuard } from "@/components/layout/AuthGuard";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDailySummary } from "@/hooks/useAnalytics";

function DashboardView() {
  const { data, isLoading } = useDailySummary();

  if (isLoading || !data) {
    return <p className="text-sm text-[#a89e97]">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold uppercase tracking-wide text-[#f5efe9]">
        Today&apos;s performance
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Revenue today" value={`$${data.revenueToday.toFixed(2)}`} />
        <StatCard label="Orders served" value={String(data.ordersServedToday)} />
        <StatCard
          label="Avg. table turnover"
          value={`${data.averageTurnoverMinutes} min`}
          hint="From first order to payment"
        />
      </div>

      <Card className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#a89e97]">
          Top menu items today
        </h2>
        {data.topMenuItems.length === 0 ? (
          <p className="mt-3 text-sm text-[#a89e97]">No paid orders yet today.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {data.topMenuItems.map((item) => (
              <li key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-[#f5efe9]">{item.name}</span>
                <span className="font-mono font-semibold text-[#ff5a3c]">
                  {item.quantity} sold
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard allowedRoles={["MANAGER"]}>
      <DashboardView />
    </AuthGuard>
  );
}
