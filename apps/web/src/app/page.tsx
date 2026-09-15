"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useAuth";

const ROLE_HOME: Record<string, string> = {
  SERVER: "/floor",
  KITCHEN: "/kitchen",
  MANAGER: "/floor",
};

export default function HomePage() {
  const router = useRouter();
  const { data, isLoading, isError } = useSession();

  useEffect(() => {
    if (isLoading) return;
    if (isError || !data?.staff) {
      router.replace("/login");
      return;
    }
    router.replace(ROLE_HOME[data.staff.role] ?? "/login");
  }, [data, isLoading, isError, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
      Loading...
    </div>
  );
}
