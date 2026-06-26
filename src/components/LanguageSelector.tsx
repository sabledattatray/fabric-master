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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-md border border-[#30363d] bg-transparent hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] transition-colors focus:outline-none"
        aria-label="Select Language"
      >
        <Globe className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#161b22] ring-1 ring-[#30363d] focus:outline-none z-50">
          <div className="py-2 max-h-64 overflow-y-auto custom-scrollbar" role="menu" aria-orientation="vertical">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  selectedLanguage.code === language.code
                    ? 'text-white border-l-4 border-[#2f81f7] bg-[#21262d] font-semibold' 
                    : 'text-[#c9d1d9] border-l-4 border-transparent hover:bg-[#21262d] pl-4'
                }`}
                role="menuitem"
                onClick={() => {
                  i18n.changeLanguage(language.code);
                  setIsOpen(false);
                }}
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
