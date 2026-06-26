import React, { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "blue";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-[#238636] text-white hover:bg-[#2ea043] focus:ring-[#238636] border border-[rgba(240,246,252,0.1)] shadow-sm",
      blue: "bg-[#1f6feb] text-white hover:bg-[#388bfd] focus:ring-[#1f6feb] border border-[rgba(240,246,252,0.1)] shadow-sm",
      secondary: "bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] focus:ring-[#8b949e] border border-[#30363d] shadow-sm",
      outline: "border border-[#30363d] bg-[#0d1117] text-[#c9d1d9] hover:bg-[#161b22] focus:ring-[#8b949e]",
      ghost: "bg-transparent text-[#8b949e] hover:text-[#58a6ff] hover:underline focus:ring-[#8b949e]",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none duration-200",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
