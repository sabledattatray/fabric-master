import React, { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LANGUAGES,
  LANGUAGE_STORAGE_KEY,
  languageInfo,
  localizedPath,
} from "../lib/localization";

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const selected = languageInfo(i18n.resolvedLanguage || i18n.language);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const closeOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node))
        setIsOpen(false);
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
      if (!menuRef.current?.contains(document.activeElement)) return;
      const links = Array.from(
        menuRef.current.querySelectorAll<HTMLAnchorElement>("a"),
      );
      const current = links.indexOf(
        document.activeElement as HTMLAnchorElement,
      );
      let next = current;
      if (event.key === "ArrowDown") next = (current + 1) % links.length;
      else if (event.key === "ArrowUp")
        next = (current - 1 + links.length) % links.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = links.length - 1;
      else if (event.key === "Tab") {
        setIsOpen(false);
        return;
      } else return;
      event.preventDefault();
      links[next]?.focus();
    };
    menuRef.current
      ?.querySelector<HTMLAnchorElement>('[aria-checked="true"]')
      ?.focus();
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", keydown);
    };
  }, [isOpen]);
  return (
    <div
      className="language-selector relative inline-block text-left"
      ref={dropdownRef}
    >
      <button
        ref={triggerRef}
        type="button"
        className="px-2.5 py-1.5 rounded-xl border border-[#30363d] bg-transparent hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] transition-colors flex items-center gap-1.5"
        aria-label={t("Select Language")}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="language-menu"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <Globe className="w-4 h-4 text-[#58a6ff]" />
        <span className="text-xs font-semibold uppercase text-[#e6edf3]">
          {selected.code}
        </span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-xl shadow-2xl bg-[#161b22] border border-[#30363d] z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-[#30363d] text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider">
            {t("Select Language")}
          </div>
          <div
            id="language-menu"
            ref={menuRef}
            role="menu"
            aria-label={t("Select Language")}
            className="py-1 max-h-80 overflow-y-auto custom-scrollbar"
          >
            {LANGUAGES.map((language) => (
              <a
                key={language.code}
                role="menuitemradio"
                aria-checked={selected.code === language.code}
                href={localizedPath(
                  location.pathname + location.search + location.hash,
                  language.code,
                )}
                hrefLang={language.tag}
                lang={language.tag}
                className={`flex items-center justify-between gap-3 w-full px-4 py-2.5 text-xs ${selected.code === language.code ? "text-[#58a6ff] bg-[#1f6feb]/20 font-semibold" : "text-[#c9d1d9] hover:bg-[#21262d]"}`}
                onClick={(event) => {
                  try {
                    localStorage.setItem(LANGUAGE_STORAGE_KEY, language.code);
                  } catch {
                    /* Navigation works even when storage is blocked. */
                  }
                  if (language.code === selected.code) {
                    event.preventDefault();
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }
                }}
              >
                <span>{language.name}</span>
                <span className="flex items-center gap-2 text-[10px] uppercase">
                  {selected.code === language.code && <Check size={12} />}
                  {language.code}
                </span>
              </a>
            ))}
          </div>
          <p className="px-3 py-2 border-t border-[#30363d] text-[10px] text-[#8b949e] leading-relaxed">
            {t(
              "Reference articles and technical examples may remain in English.",
            )}
          </p>
        </div>
      )}
    </div>
  );
}
