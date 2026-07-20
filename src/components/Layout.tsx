import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Search,
  Menu,
  BookOpen,
  Calculator,
  DollarSign,
  Home,
  X,
  Users,
  Zap,
  GitCompare,
  Beaker,
  Sparkles,
  ShieldCheck,
  Github,
  Bot
} from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { FabricMasterLogo } from "./FabricMasterLogo";
import { CommandSearchModal } from "./CommandSearchModal";
import { useTranslation } from "react-i18next";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t } = useTranslation();

  // Listen for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigationGroups = [
    {
      title: t("Planning"),
      items: [
        { name: t("Home Platform"), href: "/", icon: Home },
        { name: t("Capacity Calculator"), href: "/wizard", icon: Calculator },
        { name: t("Cost Estimator"), href: "/cost-calculator", icon: DollarSign },
      ],
    },
    {
      title: t("Performance & FinOps"),
      items: [
        { name: t("Reserved Savings"), href: "/reserved-savings", icon: DollarSign },
        { name: t("Spark CU Estimator"), href: "/spark-estimator", icon: Zap },
        { name: t("Power BI Capacity"), href: "/power-bi-capacity", icon: Calculator },
        { name: t("Global Pricing Matrix"), href: "/pricing", icon: DollarSign },
      ],
    },
    {
      title: t("SKU & Architecture"),
      items: [
        { name: t("F64 Enterprise Capacity"), href: "/fsku/f64", icon: Sparkles },
        { name: t("F32 vs F64 Comparison"), href: "/compare/f32-vs-f64", icon: GitCompare },
        { name: t("Power BI Premium vs Fabric"), href: "/compare/power-bi-premium-vs-fabric", icon: GitCompare },
      ],
    },
    {
      title: t("Knowledge & Community"),
      items: [
        { name: t("Documentation Hub"), href: "/docs", icon: BookOpen },
        { name: t("Fabric Master Labs"), href: "/labs", icon: Beaker },
        { name: t("About Datta Sable"), href: "/about", icon: Users },
      ],
    },
  ];

  return (
    <div className="h-screen bg-[#0d1117] text-[#c9d1d9] font-sans flex flex-col print:h-auto print:min-h-0 print:overflow-visible print:block">
      {/* Global Top Header */}
      <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-[#0D1117]/95 backdrop-blur-md border-b border-[#30363d] shrink-0 sticky top-0 z-50 transition-colors duration-300 print:hidden">
        <div className="flex items-center flex-1 min-w-0">
          <div
            className="flex items-center space-x-2.5 text-white cursor-pointer group shrink-0"
            onClick={() => navigate("/")}
          >
            <FabricMasterLogo className="w-7 h-7 md:w-8 md:h-8 text-[#c9d1d9] group-hover:text-[#58a6ff] transition-all duration-300 ease-in-out transform group-hover:scale-105" />
            <span className="font-semibold text-lg md:text-xl tracking-tight group-hover:text-[#58a6ff] transition-colors duration-300 flex items-center gap-2">
              {t("Fabric Master")}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/30 font-medium">v3.0</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center ml-6 flex-1 max-w-xl">
            <div className="h-6 w-px bg-[#30363d] mr-6"></div>

            {/* Ctrl+K Trigger Search Input */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded-xl py-1.5 px-3 text-sm text-[#8b949e] flex items-center justify-between transition-colors group cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#8b949e] group-hover:text-[#58a6ff] transition-colors" />
                <span>Search tools, F-SKUs, comparisons, docs...</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] font-mono text-[10px] group-hover:border-[#58a6ff] transition-colors">
                CTRL + K
              </kbd>
            </button>
          </div>
        </div>

        <div className="ml-4 flex items-center shrink-0 space-x-2 lg:space-x-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden p-2 text-[#8b949e] hover:text-[#58a6ff] transition-colors focus:outline-none"
            aria-label="Search tools and docs"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            to="/labs"
            className="hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-[#3fb950]/10 border border-[#3fb950]/30 text-[#3fb950] hover:bg-[#3fb950]/20 transition-colors font-medium"
          >
            <Beaker className="w-3.5 h-3.5" />
            <span>Labs</span>
          </Link>

          <a
            href="https://github.com/sabledattatray/fabric-master"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-[#c9d1d9] hover:text-white hover:border-[#58a6ff] transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

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

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative print:block print:h-auto print:overflow-visible">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-[#30363d] bg-[#0d1117] shrink-0 print:hidden custom-scrollbar overflow-y-auto">
          <div className="p-4 space-y-6">
            {navigationGroups.map((group, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#8b949e] px-3">
                  {group.title}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-[#1f6feb]/15 text-[#58a6ff] border border-[#1f6feb]/30 shadow-sm"
                            : "text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22]"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-[#58a6ff]" : "text-[#8b949e]"}`} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Central Content Canvas */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#0d1117] print:block print:overflow-visible print:h-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative flex-1 max-w-xs w-full bg-[#161b22] border-r border-[#30363d] flex flex-col p-4 z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#30363d] mb-4">
              <div className="flex items-center gap-2">
                <FabricMasterLogo className="w-6 h-6 text-[#58a6ff]" />
                <span className="font-bold text-white">Fabric Master v3.0</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-[#8b949e] hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              {navigationGroups.map((group, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#8b949e] px-2">
                    {group.title}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${
                            isActive
                              ? "bg-[#1f6feb]/20 text-[#58a6ff]"
                              : "text-[#8b949e] hover:text-white"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Command Search Modal */}
      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
