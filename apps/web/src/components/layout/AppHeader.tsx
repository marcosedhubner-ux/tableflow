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
    <header className="border-b-2 border-[#2a2523] bg-[#1e1b19]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="font-heading text-lg font-bold uppercase tracking-wide text-[#ff5a3c]">
            The Pass
          </span>
          <nav className="flex gap-1">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-sm px-3 py-1.5 text-sm font-medium uppercase tracking-wide",
                  pathname === item.href
                    ? "bg-[#ff5a3c] text-[#151312]"
                    : "text-[#a89e97] hover:bg-[rgba(255,90,60,0.08)] hover:text-[#f5efe9]"
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
              <p className="text-sm font-medium text-[#f5efe9]">{data.staff.fullName}</p>
              <p className="text-xs uppercase tracking-wide text-[#a89e97]">{data.staff.role}</p>
            </div>
            <button
              onClick={() =>
                logout.mutate(undefined, { onSuccess: () => router.push("/login") })
              }
              className="text-sm font-medium text-[#a89e97] hover:text-[#ff5a3c]"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
