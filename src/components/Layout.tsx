import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, BookOpen, Calculator, DollarSign, Home } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { FabricMasterLogo } from './FabricMasterLogo';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navigation = [
    { name: t('Home'), href: '/', icon: Home },
    { name: t('Capacity Calculator'), href: '/wizard', icon: Calculator },
    { name: t('Pricing Matrices'), href: '/pricing', icon: DollarSign },
    { name: t('Documentation'), href: '/docs', icon: BookOpen },
  ];

  return (
    <div className="h-screen bg-[#0d1117] text-[#c9d1d9] font-sans flex flex-col">
      {/* Global Top Header */}
      <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-[#010409] border-b border-[#30363d] shrink-0 sticky top-0 z-40">
        <div className="flex items-center flex-1 min-w-0">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 mr-2 text-[#8b949e] hover:text-[#c9d1d9]"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div 
            className="flex items-center space-x-2 text-white cursor-pointer group shrink-0"
            onClick={() => navigate('/')}
          >
            <FabricMasterLogo className="w-7 h-7 text-[#c9d1d9] group-hover:text-[#58a6ff] transition-colors" />
            <span className="font-semibold text-lg tracking-tight group-hover:text-[#58a6ff] transition-colors hidden sm:inline-block">
              {t('Fabric Master')}
            </span>
          </div>

          {/* Desktop separators and additional header items */}
          <div className="hidden md:flex items-center ml-6 flex-1">
            <div className="h-6 w-px bg-[#30363d] mr-6"></div>
            
            <div className="flex items-center space-x-2 text-sm text-[#8b949e] shrink-0">
              <span>{t('Version')}:</span>
              <select className="bg-transparent border-none text-[#c9d1d9] focus:ring-0 cursor-pointer outline-none font-semibold appearance-none">
                <option>{t('Free, Pro, & Team')}</option>
                <option>{t('Enterprise')}</option>
              </select>
            </div>
            
            <div className="ml-6 flex-1 max-w-md relative">
              <input 
                type="text" 
                placeholder={t('Search or ask Copilot')} 
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-1 pl-3 pr-8 text-sm text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
              />
              <Search className="absolute right-2.5 top-1.5 w-4 h-4 text-[#8b949e]" />
            </div>
          </div>
        </div>

        <div className="ml-4 flex items-center shrink-0">
          <LanguageSelector />
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Mobile sidebar overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#010409] border-r border-[#30363d] transform transition-transform duration-200 ease-in-out flex flex-col top-16
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex-shrink-0
        `}>
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="mb-6 relative md:hidden">
              <input 
                type="text" 
                placeholder={t('Search or ask Copilot')} 
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-1.5 pl-3 pr-8 text-sm text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
              />
              <Search className="absolute right-2.5 top-2 w-4 h-4 text-[#8b949e]" />
            </div>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      isActive 
                        ? 'bg-[#1f6feb]/10 text-[#58a6ff] font-semibold' 
                        : 'text-[#c9d1d9] hover:bg-[#21262d] font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-[#58a6ff]' : 'text-[#8b949e]'}`} />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
