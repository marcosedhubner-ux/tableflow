import clsx from "clsx";
import type { ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneStyles: Record<BadgeTone, string> = {
  neutral: "bg-[#2a2523] text-[#a89e97] border-[#3a332f]",
  success: "bg-[rgba(74,158,110,0.14)] text-[#7fbf9a] border-[#3f6b52]",
  warning: "bg-[rgba(224,168,58,0.14)] text-[#dcae5c] border-[#6b5a34]",
  danger: "bg-[rgba(224,74,54,0.14)] text-[#e88a78] border-[#6b3a30]",
  info: "bg-[rgba(255,90,60,0.12)] text-[#ff8a6a] border-[#6b4034]",
};

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        toneStyles[tone]
      )}
    >
      {children}
    </span>
  );
}
