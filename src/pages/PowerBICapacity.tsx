import React, { useState } from "react";
import { SEO } from "../components/SEO";
import { BarChart3, ArrowRight, Users, Calculator, CheckCircle2, HelpCircle, ShieldCheck, Clock, Layers, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { KnowledgeGraphLinks } from "../components/KnowledgeGraphLinks";

export function PowerBICapacity() {
  const { t } = useTranslation();
  const [concurrentUsers, setConcurrentUsers] = useState(50);
  const [complexity, setComplexity] = useState(2);

  // Power BI CU Formula: Peak Users * (Complexity * 0.2)
  const pbiCuBaseline = concurrentUsers * (complexity * 0.2);

  const pbiFaqs = [
    {
      q: "How does Power BI report concurrency affect Microsoft Fabric Capacity?",
      a: "Power BI report renders and DAX query executions are interactive workloads. Unlike background ETL jobs which are smoothed over 24 hours, interactive Power BI queries are smoothed over a 5-minute window, meaning peak user concurrency directly drives capacity demand."
    },
    {
      q: "Which Microsoft Fabric SKU permits free Power BI report viewing?",
      a: "Microsoft Fabric F64 (64 Capacity Units) is the minimum SKU that unlocks free report viewing for organizational users holding free Power BI licenses without needing individual Pro licenses for everyone."
    },
    {
      q: "What is Direct Lake mode in Microsoft Fabric?",
      a: "Direct Lake mode is a breakthrough capability in Fabric that allows Power BI semantic models to query OneLake Delta Parquet files natively at sub-second VertiPaq speeds, bypassing slow DirectQuery and eliminating memory-intensive Import refresh schedules."
    },
    {
      q: "How can I prevent Power BI report throttling during peak morning hours?",
      a: "Convert heavy DirectQuery reports to Direct Lake mode, optimize complex DAX measures, enable automatic dataset query caching, and scale capacity headroom during peak business hours."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pbiFaqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col bg-[#0d1117] custom-scrollbar text-[#c9d1d9]">
      <SEO
        title="Power BI Capacity Sizing & User Concurrency Estimator"
        description="Estimate Microsoft Fabric Capacity Units needed to support concurrent Power BI users, Direct Lake semantic models, and DAX query rendering."
        keywords="Power BI Capacity Estimator, Fabric Power BI Sizing, Direct Lake Mode, Power BI Concurrency Calculator, Fabric F64 Power BI Free Users"
        url="https://fabric.dattasable.com/power-bi-capacity"
        schema={[faqSchema]}
      />

      <div className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-12 space-y-12">
        {/* Header & Metadata */}
        <div className="border-b border-[#30363d] pb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a371f7]/10 border border-[#a371f7]/30 text-[#a371f7] text-xs font-semibold">
              <BarChart3 className="w-4 h-4" />
              Business Intelligence Sizing Engine
            </div>
            <div className="flex items-center gap-3 text-xs text-[#8b949e]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#d29922]" />
                Updated July 2026
              </span>
              <span>•</span>
              <span className="font-mono text-[#e6edf3]">v3.0 Engine</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#f0f6fc]">
            Power BI Capacity Sizing Calculator
          </h1>

          <p className="text-base md:text-lg text-[#8b949e] max-w-3xl leading-relaxed">
            Ensure fast report rendering, sub-second DAX responses, and seamless Direct Lake performance for your organization without over-provisioning capacity.
          </p>
        </div>

        {/* Interactive Power BI Calculator Widget */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-8 shadow-xl">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] border-b border-[#30363d] pb-4">
            Interactive User Concurrency Calculator
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8b949e] uppercase">Peak Concurrent Viewers</label>
              <input
                type="number"
                min="1"
                max="50000"
                value={concurrentUsers}
                onChange={(e) => setConcurrentUsers(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-[#e6edf3] focus:outline-none focus:border-[#a371f7]"
              />
              <p className="text-[11px] text-[#8b949e]">Number of users actively interacting with reports simultaneously.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8b949e] uppercase">DAX & Query Complexity</label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(parseInt(e.target.value))}
                className="w-full bg-[#0d1117] border border-[#30363d] text-[#a371f7] font-bold text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#a371f7]"
              >
                <option value={1}>1 - Simple (Basic Aggregations & Cards)</option>
                <option value={2}>2 - Standard (Star Schema & Calculated Columns)</option>
                <option value={3}>3 - Moderate (Complex DAX & Time Intelligence)</option>
                <option value={4}>4 - High (Heavy RLS & Multi-fact Joins)</option>
                <option value={5}>5 - Enterprise (Hyperscale Direct Lake & RLS)</option>
              </select>
              <p className="text-[11px] text-[#8b949e]">Semantic model design and DAX calculation complexity scale.</p>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#0d1117] border border-[#30363d] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-xs text-[#8b949e]">Interactive Smoothing Window</div>
              <div className="text-2xl font-display font-bold text-[#e6edf3]">5 Minutes</div>
            </div>
            <div>
              <div className="text-xs text-[#8b949e]">Calculated Interactive CU</div>
              <div className="text-3xl font-display font-bold text-[#a371f7]">{pbiCuBaseline.toFixed(1)} CUs</div>
            </div>
            <div>
              <div className="text-xs text-[#8b949e]">Recommended SKU Tier</div>
              <div className="text-3xl font-display font-bold text-[#3fb950]">
                {pbiCuBaseline <= 2 ? "F2" : pbiCuBaseline <= 4 ? "F4" : pbiCuBaseline <= 8 ? "F8" : pbiCuBaseline <= 16 ? "F16" : pbiCuBaseline <= 32 ? "F32" : "F64+"}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/wizard"
              className="px-6 py-3 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Combine with Data Factory & Spark →
            </Link>
          </div>
        </div>

        {/* Access Modes Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#a371f7]" />
            Power BI Storage Modes & Fabric Capacity Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#161b22] border-2 border-[#3fb950] rounded-2xl p-6 space-y-3 relative">
              <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded bg-[#238636] text-white font-bold">RECOMMENDED</span>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#3fb950]">Direct Lake Mode</div>
              <div className="text-lg font-bold text-[#e6edf3]">Sub-Second Speed</div>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Queries Delta Parquet in OneLake natively. Eliminates dataset refreshes while matching Import VertiPaq speeds.
              </p>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#58a6ff]">Import Mode</div>
              <div className="text-lg font-bold text-[#e6edf3]">In-Memory Fast</div>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Loads data into RAM memory. Requires scheduled background refreshes that draw CUs during import cycles.
              </p>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#d29922]">DirectQuery Mode</div>
              <div className="text-lg font-bold text-[#e6edf3]">Real-Time Pass Through</div>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Passes every click to SQL engine. Can create heavy peak CU bursts and higher risk of interactive throttling.
              </p>
            </div>
          </div>
        </div>

        {/* E-E-A-T Author Spotlight */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/images/author.webp"
              alt="Datta Sable"
              className="w-16 h-16 rounded-full border-2 border-[#30363d] object-cover bg-[#0d1117] shadow-md"
            />
            <div>
              <div className="font-bold text-[#e6edf3]">Formulated by Datta Sable</div>
              <div className="text-xs text-[#58a6ff]">Microsoft Fabric Engineer & Data Platform Architect</div>
              <div className="text-xs text-[#8b949e] mt-1">Based on official Power BI Premium & Fabric interactive smoothing rules.</div>
            </div>
          </div>

          <a
            href="https://dattasable.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs text-[#e6edf3] hover:border-[#a371f7] transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>Read Power BI Guides on dattasable.com</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#a371f7]" />
          </a>
        </div>

        {/* FAQs */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#d29922]" />
            Frequently Asked Questions about Power BI Sizing
          </h2>

          <div className="space-y-4">
            {pbiFaqs.map((f, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
                <div className="font-semibold text-sm text-[#e6edf3]">{f.q}</div>
                <div className="text-xs text-[#8b949e] mt-2 leading-relaxed">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <KnowledgeGraphLinks />

      <Footer />
    </div>
  );
}
