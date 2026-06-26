import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, BookOpen, Calculator, DollarSign, Home, X } from 'lucide-react';
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

  const navigationGroups = [
    {
      title: t('Core Tools'),
      items: [
        { name: t('Home'), href: '/', icon: Home },
        { name: t('Capacity Calculator'), href: '/wizard', icon: Calculator },
        { name: t('Cost Calculator'), href: '/wizard', icon: DollarSign },
      ]
    },
    {
      title: t('Estimators'),
      items: [
        { name: t('Reserved Savings'), href: '/wizard', icon: DollarSign },
        { name: t('Spark CU Estimator'), href: '/wizard', icon: Calculator },
        { name: t('Power BI Capacity'), href: '/wizard', icon: Calculator },
        { name: t('Pricing Matrices'), href: '/pricing', icon: DollarSign },
      ]
    },
    {
      title: t('Resources'),
      items: [
        { name: t('Documentation Hub'), href: '/docs', icon: BookOpen },
        { name: t('F-SKU Comparisons'), href: '/docs', icon: BookOpen },
      ]
    }
  ];

  return (
    <div className="h-screen bg-[#0d1117] text-[#c9d1d9] font-sans flex flex-col print:h-auto print:min-h-0 print:overflow-visible print:block">
      {/* Global Top Header */}
      <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-[#010409]/95 backdrop-blur-md border-b border-[#30363d] shrink-0 sticky top-0 z-50 transition-colors duration-300 print:hidden">
        <div className="flex items-center flex-1 min-w-0">
          <div 
            className="flex items-center space-x-2.5 text-white cursor-pointer group shrink-0"
            onClick={() => navigate('/')}
          >
            <FabricMasterLogo className="w-7 h-7 md:w-8 md:h-8 text-[#c9d1d9] group-hover:text-[#58a6ff] transition-all duration-300 ease-in-out transform group-hover:scale-105" />
            <span className="font-semibold text-lg md:text-xl tracking-tight group-hover:text-[#58a6ff] transition-colors duration-300 flex items-center">
              {t('Fabric Master')}
            </span>
          </div>

          {/* Desktop separators and additional header items */}
          <div className="hidden lg:flex items-center ml-6 flex-1">
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

        <div className="ml-4 flex items-center shrink-0 space-x-2 lg:space-x-4">
          <LanguageSelector />
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -mr-2 text-[#8b949e] hover:text-[#c9d1d9] transition-colors focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden print:overflow-visible print:block print:h-auto">
        
        {/* Mobile sidebar overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#010409] border-r border-[#30363d] transform transition-transform duration-200 ease-in-out flex flex-col top-0 lg:top-16
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:flex-shrink-0 print:hidden
        `}>
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-[#30363d]">
            <div className="flex items-center space-x-2 text-white">
              <FabricMasterLogo className="w-6 h-6 text-[#c9d1d9]" />
              <span className="font-semibold text-lg tracking-tight">
                {t('Menu')}
              </span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 -mr-2 text-[#8b949e] hover:text-[#c9d1d9] transition-colors focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="mb-6 relative lg:hidden">
              <input 
                type="text" 
                placeholder={t('Search or ask Copilot')} 
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-1.5 pl-3 pr-8 text-sm text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
              />
              <Search className="absolute right-2.5 top-2 w-4 h-4 text-[#8b949e]" />
            </div>

            <div className="space-y-6">
              {navigationGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <h3 className="px-3 text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
                    {group.title}
                  </h3>
                  {group.items.map((item) => {
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
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible print:block print:h-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
