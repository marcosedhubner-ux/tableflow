import clsx from "clsx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Set for cards that act as a tap/click target (e.g. a table card opening an order). */
  interactive?: boolean;
}

export function Card({ className, interactive = false, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-sm border-2 border-[#2a2523] bg-[#1e1b19] p-5 text-[#f5efe9]",
        interactive &&
          "cursor-pointer transition-[border-color,transform] duration-150 ease-out hover:border-[#ff5a3c] active:translate-y-px motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  );
}
