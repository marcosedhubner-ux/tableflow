import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#ff5a3c] text-[#151312] border-2 border-[#ff5a3c] hover:bg-[#ff7a5c] hover:border-[#ff7a5c] disabled:bg-[#7a3a2c] disabled:border-[#7a3a2c]",
  secondary:
    "bg-transparent text-[#f5efe9] border-2 border-[#2a2523] hover:border-[#ff5a3c] hover:bg-[rgba(255,90,60,0.08)]",
  ghost: "text-[#a89e97] border-2 border-transparent hover:bg-[rgba(255,90,60,0.08)] hover:text-[#f5efe9]",
  danger:
    "bg-[#c23b2a] text-[#f5efe9] border-2 border-[#c23b2a] hover:bg-[#e04a36] hover:border-[#e04a36] disabled:bg-[#5c2a22] disabled:border-[#5c2a22]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-sm px-3.5 py-2 text-sm font-semibold uppercase tracking-wide",
        "transition-[background-color,border-color,transform,box-shadow] duration-150 ease-out",
        "active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a3c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#151312]",
        "disabled:cursor-not-allowed disabled:active:scale-100",
        "motion-reduce:transition-none motion-reduce:active:scale-100",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
