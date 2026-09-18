import { Card } from "@/components/ui/Card";

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-[#a89e97]">{label}</p>
      <p className="mt-2 font-mono text-3xl font-bold text-[#f5efe9]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[#a89e97]">{hint}</p>}
    </Card>
  );
}
