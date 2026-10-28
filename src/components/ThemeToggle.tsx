import React from "react";
import { useTranslation } from "react-i18next";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] dark:hover:bg-[#17263d] border border-transparent hover:border-[#30363d] dark:hover:border-[#2b3b53] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#388bfd] ${className}`}
      aria-label={t(
        resolvedTheme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode",
      )}
      title={t(
        resolvedTheme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode",
      )}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-4 h-4 text-[#e3b341] transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#58a6ff] transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
