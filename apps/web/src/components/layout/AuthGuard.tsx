"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useAuth";
import type { StaffRole } from "@/lib/types";
import { AppHeader } from "./AppHeader";

export function AuthGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: StaffRole[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isLoading, isError } = useSession();

  useEffect(() => {
    if (isLoading) return;
    if (isError || !data?.staff) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(data.staff.role)) {
      router.replace("/login");
    }
  }, [isLoading, isError, data, allowedRoles, router]);

  if (isLoading || !data?.staff || !allowedRoles.includes(data.staff.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#151312] text-sm text-[#a89e97]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151312]">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
