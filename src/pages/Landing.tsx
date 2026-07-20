import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Calculator,
  DollarSign,
  Zap,
  GitCompare,
  BookOpen,
  Beaker,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Github,
  Linkedin,
  ExternalLink,
  Layers,
  HelpCircle,
  BarChart3,
  Bot,
  Activity,
  Award,
  Clock,
  Code
} from "lucide-react";
import { Footer } from "../components/Footer";
import { ARTICLES } from "../data/articles";
import { SEO } from "../components/SEO";
import { FabricAIAdvisor } from "../components/FabricAIAdvisor";
import { KnowledgeGraphLinks } from "../components/KnowledgeGraphLinks";
import { FABRIC_SKU_DATA } from "../data/fskus";
import { COMPARISONS_DATA } from "../data/comparisons";
import { useTranslation } from "react-i18next";

export function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "What is Microsoft Fabric Capacity?",
      a: "Microsoft Fabric Capacity is the underlying compute pool measured in Capacity Units (CUs) that powers all workloads on the platform—including Data Factory, Synapse Data Engineering, Data Warehouse, Real-Time Analytics, and Power BI."
    },
    {
      q: "Which SKU is required for Power BI Free viewer licensing?",
      a: "Microsoft Fabric F64 (64 Capacity Units) is the minimum SKU that unlocks free report viewing for organizational users holding free Power BI licenses without requiring individual Pro licenses."
    },
    {
      q: "How do 1-Year Reserved Instances work in Microsoft Fabric?",
      a: "By committing to a 1-year continuous capacity reservation, organizations save approximately 41% off standard Pay-As-You-Go pricing. For example, F64 drops from $8,409.60/mo PAYG to $4,961.66/mo Reserved."
    },
    {
      q: "What is the difference between F-SKUs and legacy Power BI P-SKUs?",
      a: "Legacy Power BI Premium P-SKUs (P1, P2, P3) are being deprecated by Microsoft. F-SKUs are their direct cloud equivalents (P1 = F64), but offer unified compute across all Fabric workloads and flexible Pay-As-You-Go pausing capabilities."
    },
    {
      q: "Is Fabric Master 100% open source?",
      a: "Yes! Fabric Master is completely open source under the MIT License, created by Datta Sable for the global Microsoft Fabric data community."
    }
  ];

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar bg-[#0d1117] block text-[#c9d1d9]">
      <SEO
        title="Design, Size, Cost, and Optimize Microsoft Fabric — All in One Platform"
        description="The Engineering Platform for Microsoft Fabric Architects. Open-source capacity planning, FinOps, architecture design, pricing estimation, migration planning, and performance optimization."
        keywords="Microsoft Fabric Engineering Platform, Microsoft Fabric Capacity Calculator, Fabric F64 Pricing, Fabric Reserved Savings, Power BI Capacity Calculator, Datta Sable"
        url="https://fabric.dattasable.com/"
      />

      {/* Open Source Trust & Transparency Banner */}
      <div className="bg-[#161b22] border-b border-[#30363d] py-2 px-4 text-xs text-[#8b949e] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-[#3fb950]">
            <Code className="w-3.5 h-3.5" />
            100% Open Source
          </span>
          <span>•</span>
          <span>MIT License</span>
          <span>•</span>
          <a
            href="https://github.com/sabledattatray/fabric-master"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#58a6ff] hover:underline flex items-center gap-1"
          >
            <Github className="w-3 h-3" />
            sabledattatray/fabric-master
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#d29922]" />
            Updated July 2026
          </span>
          <span>•</span>
          <span className="font-mono text-[#e6edf3]">v3.0 Release</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full border-b border-[#30363d] overflow-hidden bg-gradient-to-b from-[#161b22] to-[#0d1117] px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#58a6ff]/10 border border-[#58a6ff]/30 text-[#58a6ff] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              The Engineering Platform for Microsoft Fabric Architects
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-[#f0f6fc] leading-[1.12]">
              Design, Size, Cost, and Optimize{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#58a6ff] via-[#79c0ff] to-[#39c5cf] font-bold">
                Microsoft Fabric
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#8b949e] leading-relaxed max-w-2xl font-normal">
              The complete open-source platform for Microsoft Fabric capacity planning, FinOps, architecture design, pricing estimation, migration planning, and performance optimization.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate("/wizard")}
                className="px-6 py-3.5 bg-[#238636] hover:bg-[#2ea043] text-white font-semibold rounded-xl shadow-lg shadow-green-900/30 transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <Calculator className="w-5 h-5" />
                Launch Capacity Planner
              </button>

              <button
                onClick={() => navigate("/docs")}
                className="px-6 py-3.5 bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] border border-[#30363d] font-semibold rounded-xl transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-[#58a6ff]" />
                Explore Documentation
              </button>

              <a
                href="https://github.com/sabledattatray/fabric-master"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-transparent hover:bg-[#21262d] text-[#8b949e] hover:text-white border border-[#30363d] font-medium rounded-xl transition-all flex items-center gap-2 text-sm"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 border-t border-[#30363d] flex flex-wrap items-center gap-6 text-xs text-[#8b949e]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3fb950]" />
                <span>1,250+ Engineers Trust Fabric Master</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3fb950]" />
                <span>100% Open Source (MIT License)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3fb950]" />
                <span>Updated for 2026 Microsoft Fabric SLA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Animated Dashboard Preview */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  <span className="text-xs font-mono text-[#8b949e] ml-2">Fabric Master Sizing Engine</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 font-mono">
                  LIVE ENGINE
                </span>
              </div>

              {/* Sample Calculation Result Widget */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#8b949e]">Calculated Baseline CU</div>
                    <div className="text-2xl font-bold text-[#58a6ff]">42.80 CUs</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#8b949e]">Recommended SKU</div>
                    <div className="text-2xl font-bold text-[#3fb950]">F64 Capacity</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d]">
                    <div className="text-[11px] text-[#8b949e]">PAYG Monthly</div>
                    <div className="text-base font-semibold text-[#e6edf3]">$8,409.60</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0d1117] border border-[#3fb950]/40">
                    <div className="text-[11px] text-[#3fb950]">1-Yr Reserved</div>
                    <div className="text-base font-semibold text-[#3fb950]">$4,961.66</div>
                  </div>
                </div>

                {/* Simulated Utilization Meter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#8b949e]">
                    <span>Capacity Health Index</span>
                    <span className="text-[#3fb950] font-semibold">94% Optimal (Safe Buffer)</span>
                  </div>
                  <div className="w-full bg-[#0d1117] h-2.5 rounded-full overflow-hidden border border-[#30363d]">
                    <div className="bg-gradient-to-r from-[#1f6feb] to-[#3fb950] h-full w-[67%] animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => navigate("/wizard")}
                  className="w-full py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-xs font-semibold text-[#e6edf3] border border-[#30363d] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Model Custom Organization Workload</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#58a6ff]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform KPI Metrics Bar */}
      <section className="py-8 bg-[#161b22] border-b border-[#30363d]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
            <div className="text-3xl font-display font-bold text-[#58a6ff]">11</div>
            <div className="text-xs text-[#8b949e] mt-1 font-medium">Fabric SKUs (F2–F2048)</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
            <div className="text-3xl font-display font-bold text-[#3fb950]">8</div>
            <div className="text-xs text-[#8b949e] mt-1 font-medium">Engineering Tools</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
            <div className="text-3xl font-display font-bold text-[#a371f7]">50+</div>
            <div className="text-xs text-[#8b949e] mt-1 font-medium">Documentation Guides</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
            <div className="text-3xl font-display font-bold text-[#d29922]">54</div>
            <div className="text-xs text-[#8b949e] mt-1 font-medium">Indexed SEO Pages</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] col-span-2 md:col-span-1">
            <div className="text-3xl font-display font-bold text-white">MIT</div>
            <div className="text-xs text-[#8b949e] mt-1 font-medium">Open Source License</div>
          </div>
        </div>
      </section>

      {/* "What's New in v3.0" Release Showcase */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/30 text-xs font-bold font-mono">
                WHAT'S NEW IN V3.0
              </span>
              <h3 className="text-xl font-display font-bold text-[#f0f6fc]">
                Major Platform Enhancements Released
              </h3>
            </div>
            <span className="text-xs text-[#8b949e] hidden sm:block">July 2026 Edition</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-2">
              <div className="font-bold text-sm text-[#58a6ff] flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Fabric AI Advisor
              </div>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Contextual AI assistance for SKU selection, Reserved Instance calculations, and Synapse migration advice.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-2">
              <div className="font-bold text-sm text-[#3fb950] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Knowledge Graph Engine
              </div>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Automated internal linking connecting calculators, F-SKU guides, matrix comparisons, and dattasable.com articles.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-2">
              <div className="font-bold text-sm text-[#a371f7] flex items-center gap-2">
                <Beaker className="w-4 h-4" />
                Fabric Master Labs
              </div>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Experimental Direct Lake memory estimators, Copilot token compute engines, and Build announcement breakdowns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Engineering Tools Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#f0f6fc]">
            Core Fabric Engineering & FinOps Tools
          </h2>
          <p className="text-sm md:text-base text-[#8b949e] max-w-2xl mx-auto">
            Comprehensive calculators, pricing estimators, and comparative specs built specifically for Microsoft Fabric architects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tool 1 */}
          <Link to="/wizard" className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] transition-all group shadow-md space-y-4">
            <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#58a6ff] w-fit group-hover:scale-110 transition-transform">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors">
              Capacity Sizing Wizard
            </h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Step-by-step workload evaluation across Data Factory, Spark compute, and Power BI report concurrency.
            </p>
          </Link>

          {/* Tool 2 */}
          <Link to="/cost-calculator" className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#3fb950] transition-all group shadow-md space-y-4">
            <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#3fb950] w-fit group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e6edf3] group-hover:text-[#3fb950] transition-colors">
              Cost & Pricing Estimator
            </h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Translate Capacity Units into precise monthly and annual Pay-As-You-Go financial forecasts.
            </p>
          </Link>

          {/* Tool 3 */}
          <Link to="/reserved-savings" className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#3fb950] transition-all group shadow-md space-y-4">
            <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#3fb950] w-fit group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e6edf3] group-hover:text-[#3fb950] transition-colors">
              Reserved Savings Calculator
            </h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Calculate exact 1-Year Reserved Instance discounts (~41% off) and annual enterprise budget savings.
            </p>
          </Link>

          {/* Tool 4 */}
          <Link to="/spark-estimator" className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#d29922] transition-all group shadow-md space-y-4">
            <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#d29922] w-fit group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e6edf3] group-hover:text-[#d29922] transition-colors">
              Spark CU Sizing Estimator
            </h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Size Apache Spark node pools, vCores, and auto-scaling rules to prevent background job throttling.
            </p>
          </Link>

          {/* Tool 5 */}
          <Link to="/power-bi-capacity" className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#a371f7] transition-all group shadow-md space-y-4">
            <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#a371f7] w-fit group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e6edf3] group-hover:text-[#a371f7] transition-colors">
              Power BI Capacity Sizing
            </h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Analyze concurrent report users, DAX query complexity, and Direct Lake memory footprints.
            </p>
          </Link>

          {/* Tool 6 */}
          <Link to="/pricing" className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] transition-all group shadow-md space-y-4">
            <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#58a6ff] w-fit group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors">
              Global Region Pricing Matrix
            </h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Compare Microsoft Fabric SKU pricing across global Azure cloud regions in real-time.
            </p>
          </Link>

          {/* Tool 7 */}
          <Link to="/fsku/f64" className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#3fb950] transition-all group shadow-md space-y-4">
            <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#3fb950] w-fit group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e6edf3] group-hover:text-[#3fb950] transition-colors">
              F64 Flagship Spec Guide
            </h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Deep dive into F64 entitlements: Power BI Free viewer licensing & Microsoft Fabric Copilot AI.
            </p>
          </Link>

          {/* Tool 8 */}
          <Link to="/labs" className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#3fb950] transition-all group shadow-md space-y-4">
            <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#3fb950] w-fit group-hover:scale-110 transition-transform">
              <Beaker className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e6edf3] group-hover:text-[#3fb950] transition-colors">
              Fabric Master Labs
            </h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Experimental estimators, Direct Lake RAM calculators, and Microsoft Build announcement breakdowns.
            </p>
          </Link>
        </div>
      </section>

      {/* Fabric AI Advisor Spotlight */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#f0f6fc]">
              Fabric AI Advisor
            </h2>
            <p className="text-sm text-[#8b949e] max-w-xl mx-auto">
              Instant AI guidance on Microsoft Fabric SKU choices, pricing optimizations, throttling prevention, and Synapse migrations.
            </p>
          </div>

          <FabricAIAdvisor />
        </div>
      </section>

      {/* Interactive SKU Comparison Selector */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-8 border-t border-[#30363d]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-[#f0f6fc]">
              Featured SKU & Architectural Comparisons
            </h2>
            <p className="text-sm text-[#8b949e] mt-1">
              Side-by-side technical specification breakdowns and cost-benefit decisions.
            </p>
          </div>

          <Link to="/pricing" className="text-sm font-semibold text-[#58a6ff] hover:underline flex items-center gap-1">
            View All Matrix Comparisons
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMPARISONS_DATA.slice(0, 3).map(comp => (
            <Link 
              key={comp.slug} 
              to={`/compare/${comp.slug}`}
              className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#d29922] transition-all group space-y-4"
            >
              <div className="p-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#d29922] w-fit">
                <GitCompare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#e6edf3] group-hover:text-[#d29922] transition-colors">
                {comp.title}
              </h3>
              <p className="text-xs text-[#8b949e] line-clamp-2 leading-relaxed">
                {comp.subtitle}
              </p>
              <div className="pt-2 text-xs font-semibold text-[#d29922] flex items-center gap-1">
                Explore Specification Matrix
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* E-E-A-T Spotlight Section: About Datta Sable */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#30363d]">
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 text-center">
            <img
              src="/images/author.webp"
              alt="Datta Sable"
              className="w-36 h-36 rounded-full border-4 border-[#30363d] mx-auto bg-[#0d1117] object-cover shadow-xl"
            />
            <div className="mt-4 font-bold text-lg text-[#e6edf3]">Datta Sable</div>
            <div className="text-xs text-[#58a6ff]">Data Platform Architect & Microsoft Fabric Engineer</div>
          </div>

          <div className="md:col-span-8 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a371f7]/10 border border-[#a371f7]/30 text-[#a371f7] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              E-E-A-T Technical Authority & Leadership
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-[#f0f6fc]">
              Built for Engineers by Datta Sable
            </h2>

            <p className="text-sm text-[#8b949e] leading-relaxed">
              Datta Sable is a seasoned Microsoft Fabric Engineer and Data Platform Architect dedicated to building high-performance open-source tools for enterprise data teams. Fabric Master bridges mathematical CU formulas with real-world FinOps and cloud architecture strategies.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="https://dattasable.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#21262d] border border-[#30363d] hover:border-[#a371f7] text-xs text-[#e6edf3] font-semibold flex items-center gap-2 transition-all"
              >
                <span>Read Articles on dattasable.com</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#a371f7]" />
              </a>

              <a
                href="https://github.com/sabledattatray"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#21262d] border border-[#30363d] hover:border-[#58a6ff] text-xs text-[#c9d1d9] font-semibold flex items-center gap-2 transition-all"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>

              <a
                href="https://www.linkedin.com/in/dattasable/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#21262d] border border-[#30363d] hover:border-[#0a66c2] text-xs text-[#c9d1d9] font-semibold flex items-center gap-2 transition-all"
              >
                <Linkedin className="w-4 h-4 text-[#0a66c2]" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto space-y-8 border-t border-[#30363d]">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-display font-bold text-[#f0f6fc] flex items-center justify-center gap-2">
            <HelpCircle className="w-7 h-7 text-[#d29922]" />
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#8b949e]">
            Everything you need to know about Microsoft Fabric Capacity Units and Fabric Master.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left font-semibold text-sm text-[#e6edf3] flex items-center justify-between hover:bg-[#21262d] transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-lg text-[#58a6ff] font-mono">{activeFaq === idx ? "−" : "+"}</span>
              </button>
              {activeFaq === idx && (
                <div className="p-5 pt-0 text-xs text-[#8b949e] leading-relaxed border-t border-[#30363d]/50 bg-[#0d1117]/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Conversion CTA Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#30363d] text-center space-y-6">
        <div className="bg-gradient-to-r from-[#161b22] via-[#0d1117] to-[#161b22] border border-[#30363d] rounded-2xl p-10 md:p-14 space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Ready to plan your Microsoft Fabric deployment?
          </h2>
          <p className="text-base text-[#8b949e] max-w-xl mx-auto">
            Model your custom capacity requirements, evaluate 1-Year Reserved Instance discounts, and explore enterprise specification matrices in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate("/wizard")}
              className="px-6 py-3.5 bg-[#238636] hover:bg-[#2ea043] text-white font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <Calculator className="w-5 h-5" />
              Launch Capacity Planner
            </button>

            <button
              onClick={() => navigate("/docs")}
              className="px-6 py-3.5 bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] border border-[#30363d] font-semibold rounded-xl transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-[#58a6ff]" />
              Explore Documentation
            </button>

            <Link
              to="/fsku/f64"
              className="px-5 py-3.5 bg-[#21262d] hover:bg-[#30363d] text-[#3fb950] border border-[#3fb950]/30 font-semibold rounded-xl transition-all flex items-center gap-2 text-sm"
            >
              <Sparkles className="w-5 h-5" />
              View F64 Guide
            </Link>

            <a
              href="https://github.com/sabledattatray/fabric-master"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-transparent hover:bg-[#21262d] text-[#8b949e] hover:text-white border border-[#30363d] font-medium rounded-xl transition-all flex items-center gap-2 text-sm"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Internal Knowledge Graph */}
      <KnowledgeGraphLinks />

      <Footer />
    </div>
  );
}
