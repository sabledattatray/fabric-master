import React, { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      type,
      value,
      onChange,
      onBlur,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const isNumber = type === "number";

    // Initialize local string value to allow seamless deletion (including deleting '0')
    const [inputValue, setInputValue] = React.useState<string>(
      value !== undefined && value !== null ? value.toString() : "",
    );

    React.useEffect(() => {
      if (value !== undefined && value !== null) {
        setInputValue((prev) => {
          // If numeric values match, keep the current string representation (allows e.g., "" instead of "0")
          if (Number(prev) === Number(value)) return prev;
          return value.toString();
        });
      } else {
        setInputValue("");
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let valStr = e.target.value;

      if (isNumber) {
        // Strip leading zeros if digits follow (e.g., "0189" becomes "189", but "0" stays "0")
        if (/^0\d+/.test(valStr)) {
          valStr = valStr.replace(/^0+/, "");
        }
      }

      setInputValue(valStr);

      if (onChange) {
        // Safe mutation of target value to propagate updated string to parent handlers
        e.target.value = valStr;
        onChange(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (isNumber) {
        if (inputValue === "" || isNaN(Number(inputValue))) {
          const fallback =
            value !== undefined && value !== null ? value.toString() : "0";
          setInputValue(fallback);
        }
      }
      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#e6edf3] mb-2"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          aria-describedby={helperText ? helperId : undefined}
          type={type}
          value={isNumber ? inputValue : value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "flex h-10 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#c9d1d9] placeholder:text-[#8b949e] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            className,
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p
            id={helperId}
            className="mt-1.5 text-xs text-[#8b949e] leading-relaxed"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
