"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useLogout, useSession } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { href: "/floor", label: "Floor", roles: ["SERVER", "MANAGER"] },
  { href: "/kitchen", label: "Kitchen", roles: ["KITCHEN", "MANAGER"] },
  { href: "/dashboard", label: "Dashboard", roles: ["MANAGER"] },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const logout = useLogout();

  const role = data?.staff.role;
  const visibleItems = NAV_ITEMS.filter((item) => !role || item.roles.includes(role));

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="text-lg font-bold tracking-tight text-slate-900">TableFlow</span>
          <nav className="flex gap-1">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-md px-3 py-1.5 text-sm font-medium",
                  pathname === item.href
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {data?.staff && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{data.staff.fullName}</p>
              <p className="text-xs text-slate-500">{data.staff.role}</p>
            </div>
            <button
              onClick={() =>
                logout.mutate(undefined, { onSuccess: () => router.push("/login") })
              }
              className="text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
