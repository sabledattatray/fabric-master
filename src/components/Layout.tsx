import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  BookOpen,
  Calculator,
  DollarSign,
  Home,
  X,
  Zap,
  GitCompare,
  Beaker,
  Sparkles,
  Github,
  Bot,
  Activity,
  Layers,
  ArrowUpRight,
  ChevronRight,
  Command,
  ShieldCheck,
} from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { FabricMasterLogo } from "./FabricMasterLogo";
import { CommandSearchModal } from "./CommandSearchModal";
import { useTranslation } from "react-i18next";
const navigationGroups = [
  {
    title: "Overview",
    items: [
      { name: "Home", href: "/", icon: Home },
      { name: "Engineering Workspace", href: "/workspace", icon: Layers },
    ],
  },
  {
    title: "Plan & optimize",
    items: [
      { name: "Capacity Calculator", href: "/wizard", icon: Calculator },
      { name: "Cost Estimator", href: "/cost-calculator", icon: DollarSign },
      { name: "Spark CU Estimator", href: "/spark-estimator", icon: Zap },
      { name: "Power BI Capacity", href: "/power-bi-capacity", icon: Activity },
      { name: "F-SKU Comparison", href: "/fsku-comparisons", icon: GitCompare },
      { name: "Reserved Savings", href: "/reserved-savings", icon: DollarSign },
    ],
  },
  {
    title: "Architecture",
    items: [
      {
        name: "Architecture Planner",
        href: "/architecture/planner",
        icon: Layers,
      },
      {
        name: "OneLake Visualizer",
        href: "/architecture/onelake",
        icon: GitCompare,
      },
    ],
  },
  {
    title: "Explore",
    items: [
      {
        name: "Capacity Observability",
        href: "/observability",
        icon: Activity,
      },
      { name: "AI Advisor", href: "/ai-advisor", icon: Bot },
      { name: "Labs & Experiments", href: "/labs", icon: Beaker },
      { name: "Documentation Hub", href: "/docs", icon: BookOpen },
      { name: "Open Source", href: "/resources/open-source", icon: Github },
    ],
  },
];
export function Layout({ children }: { children: React.ReactNode }) {
  const tx = useTranslation().t;
  const location = useLocation();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const currentPage =
    navigationGroups
      .flatMap((group) => group.items)
      .find((item) => item.href === location.pathname)?.name ||
    "Knowledge & resources";
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  useEffect(() => {
    setIsMobileMenuOpen(false);
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const drawer = menuRef.current;
    const focusable = () =>
      Array.from(
        drawer?.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex="0"]',
        ) || [],
      );
    focusable()[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
      if (event.key === "Tab") {
        const elements = focusable();
        const first = elements[0],
          last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isMobileMenuOpen]);
  const navigation = (
    <nav aria-label={tx("Main navigation")} className="shell-navigation">
      {navigationGroups.map((group) => (
        <div className="nav-group" key={group.title}>
          <p className="nav-group-title">{t(group.title)}</p>
          {group.items.map((item) => {
            const active =
              location.pathname === item.href ||
              (item.href === "/docs" && location.pathname.startsWith("/docs/"));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={active ? "page" : undefined}
                className={`nav-item ${active ? "is-active" : ""}`}
              >
                <Icon size={17} strokeWidth={1.7} />
                <span>{t(item.name)}</span>
                {item.href === "/ai-advisor" && (
                  <span className="nav-mini-badge">AI</span>
                )}
                {active && <span className="nav-active-dot" />}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        {tx("Skip to content")}
      </a>
      <header className="shell-header print:hidden">
        <Link
          to="/"
          className="shell-brand"
          aria-label={tx("Fabric Master home")}
        >
          <FabricMasterLogo className="w-8 h-8" />
          <span>
            Fabric<span className="brand-light">Master</span>
            <small>{tx("ENGINEERING INTELLIGENCE")}</small>
          </span>
        </Link>
        <div className="shell-header-center">
          <span className="header-breadcrumb">
            {tx("Workbench") + " "}
            <ChevronRight size={13} /> <strong>{t(currentPage)}</strong>
          </span>
          <button
            className="shell-search"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={15} />
            <span>{tx("Search anything...")}</span>
            <kbd>
              <Command size={11} /> K
            </kbd>
          </button>
        </div>
        <div className="shell-header-actions">
          <a
            className="header-github"
            href="https://github.com/sabledattatray/fabric-master"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={16} />
            <span>{tx("Star on GitHub")}</span>
            <ArrowUpRight size={12} />
          </a>
          <span className="header-divider" />
          <ThemeToggle />
          <LanguageSelector />
          <button
            className="mobile-search icon-button"
            onClick={() => setIsSearchOpen(true)}
            aria-label={tx("Search tools and docs")}
          >
            <Search size={19} />
          </button>
          <button
            ref={menuTriggerRef}
            className="mobile-menu icon-button"
            aria-label={tx("Open menu")}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={21} />
          </button>
        </div>
      </header>
      <div className="shell-body">
        <aside className="shell-sidebar print:hidden">
          <Link className="workspace-switcher" to="/workspace">
            <span className="workspace-symbol">
              <Layers size={17} />
            </span>
            <span>
              {tx("Personal workspace")}
              <small>{tx("Microsoft Fabric planning")}</small>
            </span>
            <ChevronRight size={14} />
          </Link>
          {navigation}
          <div className="sidebar-bottom">
            <Link
              className="sidebar-guide"
              to="/docs/getting-started-fabric-master"
            >
              <span className="sidebar-guide-icon">
                <Sparkles size={17} />
              </span>
              <strong>{tx("A smarter place to start")}</strong>
              <p>
                {tx("Your next Fabric architecture starts with a clear plan.")}
              </p>
              <span>
                {tx("Explore the guide") + " "}
                <ArrowUpRight size={13} />
              </span>
            </Link>
            <div className="sidebar-status">
              <span className="status-dot" />
              {tx("Independent & open source")}
              <span className="version-label">v4.0</span>
            </div>
          </div>
        </aside>
        <main
          ref={mainRef}
          id="main-content"
          tabIndex={-1}
          className="shell-main custom-scrollbar"
        >
          {children}
        </main>
      </div>
      {isMobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop print:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            ref={menuRef}
            id="mobile-navigation"
            className="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={tx("Navigation")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <span>{tx("Explore Fabric Master")}</span>
              <button
                className="icon-button"
                aria-label={tx("Close menu")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            {navigation}
            <Link className="drawer-help" to="/about">
              <ShieldCheck size={16} />
              {tx("About the platform")}
            </Link>
          </div>
        </div>
      )}
      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
