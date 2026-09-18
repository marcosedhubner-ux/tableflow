"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useLogout, useSession } from "@/hooks/useAuth";
import type { StaffRole } from "@/lib/types";

const NAV_ITEMS: {
  href: string;
  label: string;
  roles: StaffRole[];
  icon: () => React.JSX.Element;
}[] = [
  { href: "/floor", label: "Floor", roles: ["SERVER", "MANAGER"], icon: FloorIcon },
  { href: "/kitchen", label: "Kitchen", roles: ["KITCHEN", "MANAGER"], icon: KitchenIcon },
  { href: "/dashboard", label: "Dashboard", roles: ["MANAGER"], icon: DashboardIcon },
];

function FloorIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function KitchenIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
      />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <line strokeLinecap="round" x1="6" y1="20" x2="6" y2="16" />
      <line strokeLinecap="round" x1="12" y1="20" x2="12" y2="10" />
      <line strokeLinecap="round" x1="18" y1="20" x2="18" y2="4" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline strokeLinecap="round" strokeLinejoin="round" points="16 17 21 12 16 7" />
      <line strokeLinecap="round" x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function initialsOf(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppRail() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const logout = useLogout();

  const role = data?.staff.role;
  const visibleItems = NAV_ITEMS.filter((item) => !role || item.roles.includes(role));

  return (
    <nav className="fixed inset-y-0 left-0 z-10 flex w-20 flex-col items-center border-r-2 border-[#2a2523] bg-[#1e1b19] py-4">
      <Link
        href={visibleItems[0]?.href ?? "/floor"}
        className="flex w-full flex-col items-center gap-2 pb-4"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#ff5a3c] font-heading text-sm font-bold text-[#151312]">
          P
        </span>
        <span className="[writing-mode:vertical-rl] rotate-180 font-heading text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a89e97]">
          The Pass
        </span>
      </Link>

      <div className="w-full flex-1 border-t-2 border-[#2a2523] pt-2">
        <ul className="flex flex-col items-stretch gap-1">
          {visibleItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={item.label}
                  className={clsx(
                    "flex w-full flex-col items-center gap-1 border-l-2 py-3 transition-colors",
                    active
                      ? "border-l-[#ff5a3c] bg-[rgba(255,90,60,0.12)] text-[#ff5a3c]"
                      : "border-l-transparent text-[#a89e97] hover:bg-[rgba(255,90,60,0.08)] hover:text-[#f5efe9]"
                  )}
                >
                  <Icon />
                  <span className="font-heading text-[9px] font-semibold uppercase tracking-wide">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {data?.staff && (
        <div className="flex w-full flex-col items-center gap-3 border-t-2 border-[#2a2523] px-2 pt-4">
          <div className="flex flex-col items-center gap-1" title={data.staff.fullName}>
            <span className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-[#2a2523] bg-[#151312] font-mono text-xs font-semibold text-[#f5efe9]">
              {initialsOf(data.staff.fullName)}
            </span>
            <span className="text-center font-heading text-[8px] font-medium uppercase leading-tight tracking-wide text-[#a89e97]">
              {data.staff.role}
            </span>
          </div>
          <button
            onClick={() => logout.mutate(undefined, { onSuccess: () => router.push("/login") })}
            title="Sign out"
            className="flex h-8 w-8 items-center justify-center rounded-sm text-[#a89e97] transition-colors hover:bg-[rgba(255,90,60,0.08)] hover:text-[#ff5a3c]"
          >
            <SignOutIcon />
          </button>
        </div>
      )}
    </nav>
  );
}
