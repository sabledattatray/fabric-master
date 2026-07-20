import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'ja', name: '日本語' },
  { code: 'pt', name: 'Português do Brasil' },
  { code: 'zh', name: '简体中文' },
  { code: 'ru', name: 'Русский' },
  { code: 'fr', name: 'Français' },
  { code: 'ko', name: '한국어' },
  { code: 'de', name: 'Deutsch' }
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLanguage = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fabric_master_lang', code);
      document.documentElement.lang = code;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 rounded-xl border border-[#30363d] bg-transparent hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] transition-colors focus:outline-none flex items-center gap-1.5"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-[#58a6ff]" />
        <span className="text-xs font-semibold uppercase text-[#e6edf3]">{selectedLanguage.code}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-2xl bg-[#161b22] border border-[#30363d] focus:outline-none z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-[#30363d] text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider">
            Select Language
          </div>
          <div className="py-1 max-h-64 overflow-y-auto custom-scrollbar" role="menu" aria-orientation="vertical">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                className={`flex items-center justify-between w-full text-left px-4 py-2 text-xs transition-colors ${
                  selectedLanguage.code === language.code
                    ? 'text-white bg-[#1f6feb]/20 font-bold text-[#58a6ff]' 
                    : 'text-[#c9d1d9] hover:bg-[#21262d]'
                }`}
                role="menuitem"
                onClick={() => handleSelectLanguage(language.code)}
              >
                <span>{language.name}</span>
                <span className="text-[10px] font-mono text-[#8b949e] uppercase font-semibold">{language.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
