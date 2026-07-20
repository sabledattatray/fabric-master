import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calculator, DollarSign, BookOpen, GitCompare, Zap, X, ArrowRight, ShieldCheck, Sparkles, Beaker } from "lucide-react";
import { FABRIC_SKU_DATA } from "../data/fskus";
import { COMPARISONS_DATA } from "../data/comparisons";
import { ARTICLES } from "../data/articles";
import { LABS_EXPERIMENTS } from "../data/labs";

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandSearchModal({ isOpen, onClose }: CommandSearchModalProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Close on Escape or shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered from parent or direct listener
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery("");
  };

  const q = query.toLowerCase().trim();

  // Filter tools
  const tools = [
    { title: "Capacity Calculator (Wizard)", path: "/wizard", icon: Calculator, desc: "Step-by-step Fabric SKU recommendation engine" },
    { title: "Cost Calculator & Pricing Estimator", path: "/cost-calculator", icon: DollarSign, desc: "Estimate monthly and annual Fabric expenditure" },
    { title: "Reserved Savings Estimator", path: "/reserved-savings", icon: DollarSign, desc: "Calculate 1-Year Reserved Instance discounts (~41% off)" },
    { title: "Spark CU Estimator", path: "/spark-estimator", icon: Zap, desc: "Sizing for Apache Spark node allocation" },
    { title: "Power BI Capacity Estimator", path: "/power-bi-capacity", icon: Calculator, desc: "Model Power BI user concurrency & Direct Lake load" },
    { title: "Pricing Matrices", path: "/pricing", icon: DollarSign, desc: "Interactive global region pricing table" },
    { title: "Fabric Master Labs", path: "/labs", icon: Beaker, desc: "Experimental tools & Build 2026 feature radar" },
    { title: "About Datta Sable", path: "/about", icon: ShieldCheck, desc: "Creator & Data Platform Architect profile" }
  ].filter(t => t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));

  // Filter SKUs
  const skus = FABRIC_SKU_DATA.filter(s => 
    s.name.toLowerCase().includes(q) || 
    s.description.toLowerCase().includes(q) ||
    `f${s.cu}`.includes(q)
  );

  // Filter Comparisons
  const comparisons = COMPARISONS_DATA.filter(c => 
    c.title.toLowerCase().includes(q) || 
    c.leftName.toLowerCase().includes(q) || 
    c.rightName.toLowerCase().includes(q)
  );

  // Filter Docs
  const docs = ARTICLES.filter(a => 
    a.title.toLowerCase().includes(q) || 
    a.description.toLowerCase().includes(q)
  );

  // Filter Labs
  const labs = LABS_EXPERIMENTS.filter(l =>
    l.title.toLowerCase().includes(q) ||
    l.description.toLowerCase().includes(q)
  );

  const hasResults = tools.length > 0 || skus.length > 0 || comparisons.length > 0 || docs.length > 0 || labs.length > 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-[#30363d] bg-[#0d1117]">
          <Search className="w-5 h-5 text-[#8b949e] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, F-SKUs, comparisons, docs, labs... (ESC to close)"
            className="w-full bg-transparent text-[#e6edf3] placeholder-[#8b949e] text-base focus:outline-none"
            autoFocus
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {!hasResults && (
            <div className="py-12 text-center text-[#8b949e]">
              No results found matching "<span className="text-[#e6edf3]">{query}</span>".
            </div>
          )}

          {/* Tools */}
          {tools.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8b949e] px-2 mb-2">
                Tools & Calculators
              </div>
              <div className="space-y-1">
                {tools.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.path}
                      onClick={() => handleSelect(t.path)}
                      className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-[#21262d] text-[#e6edf3] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-[#58a6ff]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-sm group-hover:text-[#58a6ff] transition-colors">{t.title}</div>
                          <div className="text-xs text-[#8b949e]">{t.desc}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8b949e] group-hover:text-[#58a6ff] opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* F-SKUs */}
          {skus.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8b949e] px-2 mb-2">
                Microsoft Fabric F-SKUs
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {skus.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => handleSelect(`/fsku/${s.slug}`)}
                    className="text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-[#21262d] text-[#e6edf3] transition-colors border border-[#30363d]/50 group"
                  >
                    <div>
                      <div className="font-semibold text-sm text-[#58a6ff] flex items-center gap-2">
                        {s.name} Capacity
                        {s.powerBiFreeUsers && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 font-normal">PBI Free</span>}
                      </div>
                      <div className="text-xs text-[#8b949e]">${s.monthlyReserved.toLocaleString()}/mo Reserved</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8b949e] group-hover:text-[#58a6ff] opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comparisons */}
          {comparisons.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8b949e] px-2 mb-2">
                SKU & Architecture Comparisons
              </div>
              <div className="space-y-1">
                {comparisons.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => handleSelect(`/compare/${c.slug}`)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-[#21262d] text-[#e6edf3] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-[#d29922]">
                        <GitCompare className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm group-hover:text-[#d29922] transition-colors">{c.title}</div>
                        <div className="text-xs text-[#8b949e]">{c.subtitle}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8b949e] group-hover:text-[#d29922] opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documentation */}
          {docs.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8b949e] px-2 mb-2">
                Knowledge Base & Documentation
              </div>
              <div className="space-y-1">
                {docs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelect(`/docs/${d.id}`)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-[#21262d] text-[#e6edf3] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-[#a371f7]">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm group-hover:text-[#a371f7] transition-colors">{d.title}</div>
                        <div className="text-xs text-[#8b949e] line-clamp-1">{d.description}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8b949e] group-hover:text-[#a371f7] opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Labs */}
          {labs.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8b949e] px-2 mb-2">
                Fabric Master Labs
              </div>
              <div className="space-y-1">
                {labs.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleSelect('/labs')}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-[#21262d] text-[#e6edf3] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-[#3fb950]">
                        <Beaker className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm group-hover:text-[#3fb950] transition-colors">{l.title}</div>
                        <div className="text-xs text-[#8b949e] line-clamp-1">{l.description}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8b949e] group-hover:text-[#3fb950] opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between text-xs text-[#8b949e]">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-[#c9d1d9] font-mono text-[10px]">CTRL + K</kbd>
            <span>to toggle search anywhere</span>
          </div>
          <div>Press ESC to close</div>
        </div>
      </div>
    </div>
  );
}
