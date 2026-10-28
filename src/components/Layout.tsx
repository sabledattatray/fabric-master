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
  Bot,
  Activity
} from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
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
      title: t("Fabric Master"),
      items: [
        { name: t("Home"), href: "/", icon: Home },
      ],
    },
    {
      title: t("Planning"),
      items: [
        { name: t("Engineering Workspace"), href: "/workspace", icon: Sparkles },
        { name: t("Capacity Calculator"), href: "/wizard", icon: Calculator },
        { name: t("Cost Estimator"), href: "/cost-calculator", icon: DollarSign },
        { name: t("Spark CU Estimator"), href: "/spark-estimator", icon: Zap },
        { name: t("Power BI Capacity"), href: "/power-bi-capacity", icon: Calculator },
      ],
    },

    {
      title: t("Architecture"),
      items: [
        { name: t("Architecture Planner"), href: "/architecture/planner", icon: Sparkles },
        { name: t("OneLake Visualizer"), href: "/architecture/onelake", icon: GitCompare },
      ],
    },
    {
      title: t("FinOps"),
      items: [
        { name: t("F-SKU Comparison"), href: "/fsku-comparisons", icon: GitCompare },
        { name: t("Reserved Savings"), href: "/reserved-savings", icon: DollarSign },
      ],
    },
    {
      title: t("Operations & Expertise"),
      items: [
        { name: t("Capacity Observability"), href: "/observability", icon: Activity },
        { name: t("AI Advisor"), href: "/ai-advisor", icon: Bot },
        { name: t("Labs & Experiments"), href: "/labs", icon: Beaker },
      ],
    },
    {
      title: t("Knowledge"),
      items: [
        { name: t("Documentation Hub"), href: "/docs", icon: BookOpen },
        { name: t("Open Source"), href: "/resources/open-source", icon: Github },
      ],
    },
  ];

  return (
    <div className="h-screen bg-[#F8FAFC] dark:bg-[#050508] text-[#0F172A] dark:text-[#F4F6FB] font-sans flex flex-col print:h-auto print:min-h-0 print:overflow-visible print:block">
      {/* Global Top Header */}
      <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white/95 dark:bg-[#050508]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#23273D] shrink-0 sticky top-0 z-50 transition-colors duration-300 print:hidden">
        <div className="flex items-center flex-1 min-w-0">
          <div
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
            onClick={() => navigate("/")}
          >
            <FabricMasterLogo className="w-7 h-7 md:w-8 md:h-8 transition-all duration-300 ease-in-out transform group-hover:scale-105" />
            <span className="font-semibold text-lg md:text-xl tracking-tight text-[#0F172A] dark:text-[#F4F6FB] group-hover:text-[#3B82F6] transition-colors duration-300 flex items-center gap-2">
              {t("Fabric Master")}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 font-medium">v4.0</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center ml-6 flex-1 max-w-xl">
            <div className="h-6 w-px bg-[#E2E8F0] dark:bg-[#23273D] mr-6"></div>

            {/* Ctrl+K Trigger Search Input */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full bg-[#F1F5F9] dark:bg-[#0E1018] hover:bg-[#E2E8F0] dark:hover:bg-[#161826] border border-[#E2E8F0] dark:border-[#23273D] rounded-xl py-1.5 px-3 text-sm text-[#475569] dark:text-[#9EA7BD] flex items-center justify-between transition-colors group cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#64748B] dark:text-[#9EA7BD] group-hover:text-[#3B82F6] transition-colors" />
                <span>{t("Search tools, F-SKUs, comparisons, docs...")}</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#050508] border border-[#CBD5E1] dark:border-[#23273D] text-[#475569] dark:text-[#F4F6FB] font-mono text-[10px] group-hover:border-[#3B82F6] transition-colors">
                CTRL + K
              </kbd>
            </button>
          </div>
        </div>

        <div className="ml-4 flex items-center shrink-0 space-x-2 lg:space-x-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden p-2 text-[#64748B] dark:text-[#9EA7BD] hover:text-[#3B82F6] transition-colors focus:outline-none"
            aria-label="Search tools and docs"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            to="/workspace"
            className="hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 transition-colors font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </Link>

          <Link
            to="/labs"
            className="hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-[#3fb950]/10 border border-[#3fb950]/30 text-[#238636] dark:text-[#3fb950] hover:bg-[#3fb950]/20 transition-colors font-medium"
          >
            <Beaker className="w-3.5 h-3.5" />
            <span>Labs</span>
          </Link>


          <a
            href="https://github.com/sabledattatray/fabric-master"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-[#F1F5F9] dark:bg-[#161826] border border-[#E2E8F0] dark:border-[#23273D] text-[#334155] dark:text-[#F4F6FB] hover:text-[#0F172A] dark:hover:text-white hover:border-[#3B82F6] transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <ThemeToggle />

          <LanguageSelector />

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -mr-2 text-[#64748B] dark:text-[#9EA7BD] hover:text-[#0F172A] dark:hover:text-[#F4F6FB] transition-colors focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative print:block print:h-auto print:overflow-visible">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-[#E2E8F0] dark:border-[#23273D] bg-white dark:bg-[#050508] shrink-0 print:hidden custom-scrollbar overflow-y-auto">
          <div className="p-4 space-y-6">
            {navigationGroups.map((group, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9EA7BD] px-3">
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
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                          isActive
                            ? "bg-blue-50 dark:bg-[#1f6feb]/15 text-blue-600 dark:text-[#58a6ff] border border-blue-200 dark:border-[#1f6feb]/30 shadow-sm font-semibold"
                            : "text-[#475569] dark:text-[#9EA7BD] hover:text-[#0F172A] dark:hover:text-[#F4F6FB] hover:bg-[#F1F5F9] dark:hover:bg-[#161826] font-medium"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-[#58a6ff]" : "text-[#64748B] dark:text-[#9EA7BD]"}`} />
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
        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#F8FAFC] dark:bg-[#050508] print:block print:overflow-visible print:h-auto">
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
          <div className="relative flex-1 max-w-xs w-full bg-white dark:bg-[#0E1018] border-r border-[#E2E8F0] dark:border-[#23273D] flex flex-col p-4 z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#23273D] mb-4">
              <div className="flex items-center gap-2">
                <FabricMasterLogo className="w-6 h-6" />
                <span className="font-bold text-[#0F172A] dark:text-white">Fabric Master v4.0</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-[#64748B] dark:text-[#9EA7BD] hover:text-[#0F172A] dark:hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              {navigationGroups.map((group, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#9EA7BD] px-2">
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
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${
                            isActive
                              ? "bg-blue-50 dark:bg-[#1f6feb]/20 text-blue-600 dark:text-[#58a6ff] font-semibold border border-blue-200 dark:border-transparent"
                              : "text-[#475569] dark:text-[#8b949e] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#161826]"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-[#58a6ff]" : "text-[#64748B] dark:text-[#8b949e]"}`} />
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
