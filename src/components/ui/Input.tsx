import React, { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-[#e6edf3] mb-1.5">
            {label}
          </label>
        )}
        <input
          className={cn(
            "flex h-8 w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-sm text-[#c9d1d9] placeholder:text-[#8b949e] focus:outline-none focus:bg-[#0d1117] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-inner",
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className="mt-1 text-xs text-[#8b949e]">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
