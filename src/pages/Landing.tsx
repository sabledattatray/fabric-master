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
  Clock,
  Code,
  Shield,
  Server,
  FileText,
  Sliders,
  Check
} from "lucide-react";
import { Footer } from "../components/Footer";
import { ARTICLES } from "../data/articles";
import { SEO } from "../components/SEO";
import { KnowledgeGraphLinks } from "../components/KnowledgeGraphLinks";
import { FABRIC_SKU_DATA } from "../data/fskus";
import { useTranslation } from "react-i18next";

export function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Interactive Hero Preview State
  const previewSkus = ["f8", "f16", "f32", "f64", "f128", "f256"];
  const [selectedPreviewSkuSlug, setSelectedPreviewSkuSlug] = useState("f64");

  const previewSku = FABRIC_SKU_DATA.find((s) => s.slug === selectedPreviewSkuSlug) || FABRIC_SKU_DATA[5];
  const previewBaselineDemand = Number((previewSku.cu * 0.67).toFixed(1));
  const previewBufferPercent = Math.round(((previewSku.cu - previewBaselineDemand) / previewBaselineDemand) * 100);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "What is Microsoft Fabric Capacity and how are Capacity Units (CUs) measured?",
      a: "Microsoft Fabric Capacity is the shared pool of compute measured in Capacity Units (CUs) that powers all workloads across the platform—including Data Factory pipelines, Synapse Spark notebooks, SQL Data Warehouses, KQL Real-Time Intelligence, and Power BI semantic models."
    },
    {
      q: "Which Fabric SKU is required for free Power BI viewer distribution?",
      a: "Microsoft Fabric F64 (64 Capacity Units) is the minimum capacity threshold that enables users holding free Microsoft Fabric/Power BI licenses to consume reports and dashboards without requiring individual Power BI Pro or Premium Per User (PPU) licenses."
    },
    {
      q: "How do 1-Year Reserved Instances (RI) work in Microsoft Fabric?",
      a: "By committing to a continuous 1-year capacity reservation, organizations receive an approximately 41% commitment discount compared to standard Pay-As-You-Go pricing. For example, F64 decreases from $8,409.60/month PAYG to $4,961.66/month Reserved (saving over $41,300 annually)."
    },
    {
      q: "How does Microsoft Fabric smoothing prevent operational throttling?",
      a: "Fabric smooths background batch workloads (such as Spark jobs and Data Factory pipelines) across a 24-hour evaluation window, while interactive operations (such as Power BI DAX queries and SQL transformations) are smoothed across 5 minutes. This prevents temporary bursts from instantly rejecting operations."
    },
    {
      q: "Is Fabric Master affiliated with Microsoft?",
      a: "No. Fabric Master is an independent, 100% open-source engineering and FinOps planning workbench created by Datta Sable and community contributors under the MIT License. It is not affiliated with, endorsed by, or sponsored by Microsoft Corporation."
    }
  ];

  const featuredGuides = ARTICLES.slice(0, 4);

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar bg-[#050508] dark:bg-[#050508] light:bg-[#F7F9FC] text-[#F4F6FB] dark:text-[#F4F6FB] light:text-[#142235]">
      <SEO
        title="Fabric Master v4.0 — Microsoft Fabric Capacity Intelligence & FinOps Workbench"
        description="The Independent Microsoft Fabric Engineering Workbench. Model Capacity Units (CUs), forecast Pay-As-You-Go vs 1-Year Reserved Instance costs, design architectures, and prevent throttling."
        keywords="Microsoft Fabric Engineering Platform, Fabric Capacity Sizing Wizard, Fabric F64 Pricing, Fabric Reserved Savings, Power BI Capacity Calculator, OneLake Architecture, Datta Sable"
        url="https://fabric.dattasable.com/"
      />

      {/* 1. Top Trust & Open Source Status Bar */}
      <div className="bg-[#0E1018] dark:bg-[#0E1018] light:bg-[#FFFFFF] border-b border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] py-2 px-4 text-xs text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-[#22C55E]">
            <Code className="w-3.5 h-3.5" />
            100% Open Source (MIT)
          </span>
          <span className="text-[#23273D] dark:text-[#23273D] light:text-[#DCE4EF]">•</span>
          <a
            href="https://github.com/sabledattatray/fabric-master"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3B82F6] hover:underline flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" />
            sabledattatray/fabric-master
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
            October 2026 Edition
          </span>
          <span className="text-[#23273D] dark:text-[#23273D] light:text-[#DCE4EF]">•</span>
          <span className="px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 font-mono text-[11px] font-semibold">
            v4.0 Release
          </span>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative w-full border-b border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] overflow-hidden bg-gradient-to-b from-[#0E1018] to-[#050508] dark:from-[#0E1018] dark:to-[#050508] light:from-[#FFFFFF] light:to-[#F7F9FC] px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
              <span>Independent Microsoft Fabric Engineering & FinOps Workbench</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4F6FB] dark:text-[#F4F6FB] light:text-[#142235] leading-[1.12]">
              {t("Engineer Microsoft Fabric with Confidence")}
            </h1>

            <p className="text-base sm:text-lg text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] leading-relaxed max-w-2xl font-normal">
              {t("Capacity planning, cost intelligence, architecture design, and explainable engineering guidance in one independent workspace.")}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate("/workspace")}
                className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl shadow-lg shadow-blue-900/30 transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <Calculator className="w-5 h-5" />
                {t("Launch Engineering Workspace")}
              </button>


              <button
                onClick={() => navigate("/cost-calculator")}
                className="px-6 py-3.5 bg-[#161826] hover:bg-[#1A1E2E] dark:bg-[#161826] dark:hover:bg-[#1A1E2E] light:bg-[#FFFFFF] light:hover:bg-[#F1F5FA] text-[#F4F6FB] dark:text-[#F4F6FB] light:text-[#142235] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] font-semibold rounded-xl transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <DollarSign className="w-5 h-5 text-[#22D3EE]" />
                {t("Explore Fabric Calculators")}
              </button>

              <a
                href="https://github.com/sabledattatray/fabric-master"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-transparent hover:bg-[#161826] dark:hover:bg-[#161826] light:hover:bg-[#F1F5FA] text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] hover:text-[#F4F6FB] dark:hover:text-[#F4F6FB] light:hover:text-[#142235] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] font-medium rounded-xl transition-all flex items-center gap-2 text-sm"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>

            {/* Supporting Trust Statement */}
            <div className="pt-6 border-t border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] flex flex-wrap items-center gap-6 text-xs text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Independent Engineering Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Documented Sizing Models (US East Baseline)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>100% Deterministic Calculations</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Quality Interactive Preview Widget */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-[#0E1018] dark:bg-[#0E1018] light:bg-[#FFFFFF] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F87171]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                  <span className="text-xs font-mono text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] ml-2">
                    Capacity Sizing Preview
                  </span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 font-mono font-semibold">
                  SYNTHETIC DEMO
                </span>
              </div>

              {/* Interactive SKU Selector Pills */}
              <div>
                <label className="block text-xs font-semibold text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] mb-2 uppercase tracking-wider">
                  Select Sizing Tier (Illustrative):
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {previewSkus.map((slug) => (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => setSelectedPreviewSkuSlug(slug)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                        selectedPreviewSkuSlug === slug
                          ? "bg-[#3B82F6] text-white border-[#3B82F6] shadow-sm"
                          : "bg-[#050508] dark:bg-[#050508] light:bg-[#F1F5FA] text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] hover:border-[#3B82F6]"
                      }`}
                    >
                      {slug.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sample Calculation Result Box */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#050508] dark:bg-[#050508] light:bg-[#F7F9FC] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D]">
                      Baseline Workload Demand
                    </div>
                    <div className="text-2xl font-bold text-[#3B82F6]">
                      {previewBaselineDemand} CUs
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D]">
                      Candidate SKU Tier
                    </div>
                    <div className="text-2xl font-bold text-[#22C55E]">
                      {previewSku.name} ({previewSku.cu} CU)
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#050508] dark:bg-[#050508] light:bg-[#F7F9FC] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF]">
                    <div className="text-[11px] text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D]">
                      PAYG Monthly (Est.)
                    </div>
                    <div className="text-base font-semibold text-[#F4F6FB] dark:text-[#F4F6FB] light:text-[#142235]">
                      ${previewSku.monthlyPayg.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#050508] dark:bg-[#050508] light:bg-[#F7F9FC] border border-[#22C55E]/40">
                    <div className="text-[11px] text-[#22C55E]">
                      1-Yr Reserved (Est.)
                    </div>
                    <div className="text-base font-semibold text-[#22C55E]">
                      ${previewSku.monthlyReserved.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Headroom / Buffer Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D]">
                    <span>Headroom Analysis</span>
                    <span className="text-[#22C55E] font-semibold">
                      +{previewBufferPercent}% Safe Headroom
                    </span>
                  </div>
                  <div className="w-full bg-[#161826] dark:bg-[#161826] light:bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF]">
                    <div
                      className="bg-gradient-to-r from-[#3B82F6] to-[#22C55E] h-full"
                      style={{ width: `${Math.min(100, Math.round((previewBaselineDemand / previewSku.cu) * 100))}%` }}
                    ></div>
                  </div>
                </div>

                {/* Workload Mix & Licensing Metadata */}
                <div className="p-3 rounded-xl bg-[#050508] dark:bg-[#050508] light:bg-[#F7F9FC] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D]">
                    <span>Illustrative Workload Distribution:</span>
                    <span className="font-mono text-[#F4F6FB] dark:text-[#F4F6FB] light:text-[#142235]">DF 15% • Spark 55% • PBI 30%</span>
                  </div>
                  <div className="flex justify-between text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D]">
                    <span>Power BI Free-Viewer Licensing:</span>
                    <span className={previewSku.powerBiFreeUsers ? "text-[#22C55E] font-semibold" : "text-[#F59E0B]"}>
                      {previewSku.powerBiFreeUsers ? "Included (F64+)" : "Requires Pro/PPU (<F64)"}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] text-center">
                  * Synthetic demonstration data for preliminary architectural modeling.
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => navigate("/wizard")}
                  className="w-full py-2.5 rounded-xl bg-[#161826] hover:bg-[#1A1E2E] dark:bg-[#161826] dark:hover:bg-[#1A1E2E] light:bg-[#F1F5FA] light:hover:bg-[#E2E8F0] text-xs font-semibold text-[#F4F6FB] dark:text-[#F4F6FB] light:text-[#142235] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Model Custom Organization Workload in Sizing Wizard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#3B82F6]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Verified Platform Metrics Bar */}
      <section className="py-8 bg-[#0E1018] dark:bg-[#0E1018] light:bg-[#FFFFFF] border-b border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div className="p-4 rounded-xl bg-[#050508] dark:bg-[#050508] light:bg-[#F7F9FC] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF]">
            <div className="text-3xl font-display font-bold text-[#3B82F6]">11</div>
            <div className="text-xs text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] mt-1 font-medium">Fabric SKUs (F2–F2048)</div>
          </div>
          <div className="p-4 rounded-xl bg-[#050508] dark:bg-[#050508] light:bg-[#F7F9FC] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF]">
            <div className="text-3xl font-display font-bold text-[#22C55E]">8</div>
            <div className="text-xs text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] mt-1 font-medium">Engineering Tools</div>
          </div>
          <div className="p-4 rounded-xl bg-[#050508] dark:bg-[#050508] light:bg-[#F7F9FC] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF]">
            <div className="text-3xl font-display font-bold text-[#22D3EE]">25</div>
            <div className="text-xs text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] mt-1 font-medium">Architecture Guides</div>
          </div>
          <div className="p-4 rounded-xl bg-[#050508] dark:bg-[#050508] light:bg-[#F7F9FC] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF]">
            <div className="text-3xl font-display font-bold text-[#F59E0B]">100%</div>
            <div className="text-xs text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] mt-1 font-medium">Deterministic Models</div>
          </div>
          <div className="p-4 rounded-xl bg-[#050508] dark:bg-[#050508] light:bg-[#F7F9FC] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] col-span-2 md:col-span-1">
            <div className="text-3xl font-display font-bold text-[#F4F6FB] dark:text-[#F4F6FB] light:text-[#142235]">MIT</div>
            <div className="text-xs text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] mt-1 font-medium">Open Source License</div>
          </div>
        </div>
      </section>

      {/* 4. Core Capability Cards (PRD Section 11 Section B) */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-8">
        <div className="text-left space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#3B82F6] font-semibold">
            Enterprise Sizing & Architecture Workbenches
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235]">
            Core Platform Capabilities
          </h2>
          <p className="text-sm text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D] max-w-3xl">
            Everything Microsoft Fabric engineers, data architects, and FinOps analysts need to size capacity, forecast expenditure, and design production data estates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Capacity Intelligence */}
          <div className="bg-[#101B2D] dark:bg-[#101B2D] light:bg-[#FFFFFF] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] rounded-2xl p-6 flex flex-col justify-between hover:border-[#3B82F6] transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235]">
                Capacity Intelligence
              </h3>
              <p className="text-xs text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D] leading-relaxed">
                Formulate composite compute demand across Data Factory pipelines, Spark clusters, and Power BI concurrency with 24h/5m smoothing windows.
              </p>
            </div>
            <Link
              to="/wizard"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B82F6] group-hover:underline"
            >
              <span>Launch Sizing Wizard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: FinOps Studio */}
          <div className="bg-[#101B2D] dark:bg-[#101B2D] light:bg-[#FFFFFF] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] rounded-2xl p-6 flex flex-col justify-between hover:border-[#22C55E] transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235]">
                FinOps Studio
              </h3>
              <p className="text-xs text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D] leading-relaxed">
                Analyze Pay-As-You-Go vs 1-Year Reserved Instances across F2–F2048 tiers with documented Microsoft Azure pricing provenance.
              </p>
            </div>
            <Link
              to="/cost-calculator"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#22C55E] group-hover:underline"
            >
              <span>Explore Cost Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Architecture Studio */}
          <div className="bg-[#101B2D] dark:bg-[#101B2D] light:bg-[#FFFFFF] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] rounded-2xl p-6 flex flex-col justify-between hover:border-[#22D3EE] transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235]">
                Architecture Studio
              </h3>
              <p className="text-xs text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D] leading-relaxed">
                Design multi-layer Lakehouses, Medallion architectures, OneLake shortcuts, and Direct Lake semantic models with technical decision trees.
              </p>
            </div>
            <Link
              to="/architecture/planner"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#22D3EE] group-hover:underline"
            >
              <span>Open Architecture Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: AI Engineering Advisor */}
          <div className="bg-[#101B2D] dark:bg-[#101B2D] light:bg-[#FFFFFF] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] rounded-2xl p-6 flex flex-col justify-between hover:border-[#F59E0B] transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235]">
                AI Engineering Advisor
              </h3>
              <p className="text-xs text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D] leading-relaxed">
                Receive deterministic architectural reviews, licensing qualification checks, and migration advice grounded in verified documentation.
              </p>
            </div>
            <Link
              to="/ai-advisor"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#F59E0B] group-hover:underline"
            >
              <span>Consult AI Advisor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Six-Stage Engineering Workflow (PRD Section 11 Section C) */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF]">
        <div className="text-left space-y-2 mb-10">
          <div className="text-xs font-mono uppercase tracking-wider text-[#3B82F6] font-semibold">
            Systematic Delivery Methodology
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235]">
            The Fabric Master Engineering Workflow
          </h2>
          <p className="text-sm text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D]">
            A reproducible six-stage lifecycle taking your Microsoft Fabric project from discovery to production governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            {
              step: "01",
              title: "Define Workload",
              desc: "Catalog pipeline executions, Spark cluster sizes, and peak concurrent users.",
              status: "Available Now",
              link: "/wizard"
            },
            {
              step: "02",
              title: "Estimate Capacity",
              desc: "Formulate baseline CU demand and apply a 50% safety buffer to prevent throttling.",
              status: "Available Now",
              link: "/results"
            },
            {
              step: "03",
              title: "Compare Cost",
              desc: "Evaluate Pay-As-You-Go vs 1-Year Reserved Instances across all global regions.",
              status: "Available Now",
              link: "/cost-calculator"
            },
            {
              step: "04",
              title: "Design Architecture",
              desc: "Map ingestion, OneLake storage layers, Delta Parquet tables, and Direct Lake.",
              status: "Available Now",
              link: "/architecture/planner"
            },
            {
              step: "05",
              title: "Validate Assumptions",
              desc: "Audit smoothing rules, Power BI free-viewer eligibility, and Copilot requirements.",
              status: "Available Now",
              link: "/fsku-comparisons"
            },
            {
              step: "06",
              title: "Export Report",
              desc: "Generate professional executive decision summaries and printable assessments.",
              status: "Available Now",
              link: "/report"
            }
          ].map((stage, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#101B2D] dark:bg-[#101B2D] light:bg-[#FFFFFF] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] flex flex-col justify-between space-y-4 hover:border-[#3B82F6] transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#3B82F6]">
                    STAGE {stage.step}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 font-medium">
                    {stage.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235]">
                  {stage.title}
                </h4>
                <p className="text-xs text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D] leading-relaxed">
                  {stage.desc}
                </p>
              </div>
              <Link
                to={stage.link}
                className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1 pt-2 border-t border-[#2B3B53]/50 dark:border-[#2B3B53]/50 light:border-[#DCE4EF]"
              >
                <span>Open Tool</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Technical Governance, Methodology & Trust (PRD Section 11 Section E) */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF]">
        <div className="bg-[#101B2D] dark:bg-[#101B2D] light:bg-[#FFFFFF] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] rounded-2xl p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] pb-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#3B82F6] font-semibold">
                Engineering Governance & Verification
              </div>
              <h2 className="text-2xl font-bold text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235] mt-1">
                Transparent Sizing Methodology & Grounding
              </h2>
            </div>
            <span className="text-xs px-3 py-1 rounded-lg bg-[#080F1D] dark:bg-[#080F1D] light:bg-[#F1F5FA] text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] font-mono">
              Deterministic v4.0 Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D] leading-relaxed">
            <div className="p-5 rounded-xl bg-[#080F1D] dark:bg-[#080F1D] light:bg-[#F7F9FC] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] space-y-2">
              <div className="font-semibold text-sm text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                Independent & Unbiased
              </div>
              <p>
                Fabric Master is an independent planning platform not affiliated with or sponsored by Microsoft. Recommendations are determined solely by your workload inputs and published technical specifications.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#080F1D] dark:bg-[#080F1D] light:bg-[#F7F9FC] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] space-y-2">
              <div className="font-semibold text-sm text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235] flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#3B82F6]" />
                Mathematical Formulas
              </div>
              <p>
                Every capacity result is derived from deterministic formulas reflecting 24-hour background smoothing (Spark, Data Factory) and 5-minute interactive smoothing (Power BI). No hidden guesses.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#080F1D] dark:bg-[#080F1D] light:bg-[#F7F9FC] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] space-y-2">
              <div className="font-semibold text-sm text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#F59E0B]" />
                Documented Pricing Sources
              </div>
              <p>
                All baseline pricing corresponds to Azure US East standard rates ($0.18/CU/hour PAYG) with verified ~41% 1-Year Reserved Instance commitment discounts. Verified quarterly against Azure Retail Rates.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#080F1D] dark:bg-[#080F1D] light:bg-[#F7F9FC] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D]">
              Explore technical specifications:
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/about" className="text-[#3B82F6] hover:underline font-medium">
                Author & Methodology →
              </Link>
              <Link to="/pricing" className="text-[#3B82F6] hover:underline font-medium">
                Pricing Matrix Table →
              </Link>
              <Link to="/docs" className="text-[#3B82F6] hover:underline font-medium">
                Fabric Documentation Hub →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Featured Technical Documentation (PRD Section 11 Section G) */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#3B82F6] font-semibold">
              Evidence-Based Guides
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235] mt-1">
              Featured Architecture & Capacity Guides
            </h2>
          </div>
          <Link
            to="/docs"
            className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1"
          >
            <span>View All 25 Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredGuides.map((guide) => (
            <Link
              key={guide.id}
              to={`/docs/${guide.id}`}
              className="p-5 rounded-2xl bg-[#101B2D] dark:bg-[#101B2D] light:bg-[#FFFFFF] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] flex flex-col justify-between hover:border-[#3B82F6] transition-all group"
            >
              <div className="space-y-3">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] font-mono font-medium">
                  TECHNICAL GUIDE
                </span>
                <h3 className="font-bold text-sm text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235] group-hover:text-[#3B82F6] transition-colors leading-snug">
                  {guide.title}
                </h3>
                <p className="text-xs text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D] line-clamp-3 leading-relaxed">
                  {guide.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B3B53]/50 dark:border-[#2B3B53]/50 light:border-[#DCE4EF] flex items-center justify-between text-xs text-[#3B82F6]">
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. E-E-A-T Leadership & Author Spotlight */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF]">
        <div className="bg-[#101B2D] dark:bg-[#101B2D] light:bg-[#FFFFFF] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] rounded-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 text-center">
            <img
              src="/images/author.webp"
              alt="Datta Sable"
              className="w-32 h-32 rounded-full border-4 border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] mx-auto bg-[#080F1D] dark:bg-[#080F1D] light:bg-[#F7F9FC] object-cover shadow-xl"
            />
            <div className="mt-4 font-bold text-lg text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235]">Datta Sable</div>
            <div className="text-xs text-[#3B82F6]">Data Platform Architect & Microsoft Fabric Engineer</div>
          </div>

          <div className="md:col-span-8 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
              E-E-A-T Technical Authority & Open Source Architecture
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235]">
              Designed by Datta Sable for Enterprise Data Teams
            </h2>

            <p className="text-sm text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D] leading-relaxed">
              Datta Sable is a seasoned Microsoft Fabric Engineer and Data Platform Architect dedicated to democratizing capacity sizing, FinOps optimization, and architectural modeling for enterprise data estates. Fabric Master bridges mathematical CU formulas with real-world cloud governance.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="https://dattasable.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#080F1D] dark:bg-[#080F1D] light:bg-[#F1F5FA] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] hover:border-[#3B82F6] text-xs text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235] font-semibold flex items-center gap-2 transition-all"
              >
                <span>Read Articles on dattasable.com</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#3B82F6]" />
              </a>

              <a
                href="https://github.com/sabledattatray"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#080F1D] dark:bg-[#080F1D] light:bg-[#F1F5FA] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] hover:border-[#3B82F6] text-xs text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D] font-semibold flex items-center gap-2 transition-all"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>

              <a
                href="https://www.linkedin.com/in/dattasable/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#080F1D] dark:bg-[#080F1D] light:bg-[#F1F5FA] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] hover:border-[#3B82F6] text-xs text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D] font-semibold flex items-center gap-2 transition-all"
              >
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section (PRD Section 11 Section H) */}
      <section className="py-16 px-6 max-w-5xl mx-auto space-y-8 border-t border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF]">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-display font-bold text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235] flex items-center justify-center gap-2">
            <HelpCircle className="w-7 h-7 text-[#F59E0B]" />
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D]">
            Key architectural and FinOps questions regarding Microsoft Fabric Capacity Units and Fabric Master.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-[#101B2D] dark:bg-[#101B2D] light:bg-[#FFFFFF] border border-[#2B3B53] dark:border-[#2B3B53] light:border-[#DCE4EF] rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left font-semibold text-sm text-[#F3F7FC] dark:text-[#F3F7FC] light:text-[#142235] flex items-center justify-between hover:bg-[#17263D] dark:hover:bg-[#17263D] light:hover:bg-[#F1F5FA] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-lg text-[#3B82F6] font-mono">{activeFaq === idx ? "−" : "+"}</span>
              </button>
              {activeFaq === idx && (
                <div className="p-5 pt-0 text-xs text-[#A7B8CC] dark:text-[#A7B8CC] light:text-[#52657D] leading-relaxed border-t border-[#2B3B53]/50 dark:border-[#2B3B53]/50 light:border-[#DCE4EF] bg-[#080F1D]/50 dark:bg-[#080F1D]/50 light:bg-[#F7F9FC]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. Final Conversion CTA (PRD Section 11 Section I) */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] text-center space-y-6">
        <div className="bg-gradient-to-r from-[#0E1018] via-[#050508] to-[#0E1018] dark:from-[#0E1018] dark:via-[#050508] dark:to-[#0E1018] light:from-[#FFFFFF] light:via-[#F1F5FA] light:to-[#FFFFFF] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] rounded-2xl p-10 md:p-14 space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#F4F6FB] dark:text-[#F4F6FB] light:text-[#142235]">
            Start Planning Your Microsoft Fabric Architecture
          </h2>
          <p className="text-base text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] max-w-xl mx-auto">
            Model your custom capacity requirements, evaluate 1-Year Reserved Instance discounts, and explore enterprise specification matrices in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate("/workspace")}
              className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <Calculator className="w-5 h-5" />
              Launch Engineering Workspace
            </button>


            <button
              onClick={() => navigate("/docs")}
              className="px-6 py-3.5 bg-[#161826] hover:bg-[#1A1E2E] dark:bg-[#161826] dark:hover:bg-[#1A1E2E] light:bg-[#FFFFFF] light:hover:bg-[#F1F5FA] text-[#F4F6FB] dark:text-[#F4F6FB] light:text-[#142235] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] font-semibold rounded-xl transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-[#3B82F6]" />
              Explore Documentation
            </button>

            <Link
              to="/fsku/f64"
              className="px-5 py-3.5 bg-[#161826] hover:bg-[#1A1E2E] dark:bg-[#161826] dark:hover:bg-[#1A1E2E] light:bg-[#FFFFFF] light:hover:bg-[#F1F5FA] text-[#22C55E] border border-[#22C55E]/30 font-semibold rounded-xl transition-all flex items-center gap-2 text-sm"
            >
              <Sparkles className="w-5 h-5" />
              View F64 Specification
            </Link>

            <a
              href="https://github.com/sabledattatray/fabric-master"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-transparent hover:bg-[#161826] dark:hover:bg-[#161826] light:hover:bg-[#F1F5FA] text-[#9EA7BD] dark:text-[#9EA7BD] light:text-[#52657D] hover:text-[#F4F6FB] dark:hover:text-[#F4F6FB] light:hover:text-[#142235] border border-[#23273D] dark:border-[#23273D] light:border-[#DCE4EF] font-medium rounded-xl transition-all flex items-center gap-2 text-sm"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* 11. Internal Knowledge Graph */}
      <KnowledgeGraphLinks />

      {/* 12. Site Footer */}
      <Footer />
    </div>
  );
}
