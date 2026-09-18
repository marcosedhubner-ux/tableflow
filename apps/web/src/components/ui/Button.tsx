import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#ff5a3c] text-[#151312] hover:bg-[#ff7a5c] disabled:bg-[#7a3a2c]",
  secondary:
    "bg-transparent text-[#f5efe9] border-2 border-[#2a2523] hover:border-[#ff5a3c] hover:bg-[rgba(255,90,60,0.08)]",
  ghost: "text-[#a89e97] hover:bg-[rgba(255,90,60,0.08)] hover:text-[#f5efe9]",
  danger: "bg-[#c23b2a] text-[#f5efe9] hover:bg-[#e04a36] disabled:bg-[#5c2a22]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-sm px-3.5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
