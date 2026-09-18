import clsx from "clsx";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-sm border-2 border-[#2a2523] bg-[#1e1b19] p-5 text-[#f5efe9]",
        className
      )}
      {...props}
    />
  );
}
