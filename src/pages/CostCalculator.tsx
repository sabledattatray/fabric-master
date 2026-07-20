import React, { useState } from "react";
import { SEO } from "../components/SEO";
import { DollarSign, ArrowRight, Calculator, CheckCircle2, HelpCircle, ShieldCheck, Clock, Layers, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { KnowledgeGraphLinks } from "../components/KnowledgeGraphLinks";
import { FABRIC_SKU_DATA } from "../data/fskus";

export function CostCalculator() {
  const { t } = useTranslation();
  const [selectedSkuSlug, setSelectedSkuSlug] = useState("f64");

  const selectedSku = FABRIC_SKU_DATA.find(s => s.slug === selectedSkuSlug) || FABRIC_SKU_DATA[5];

  const annualPayg = selectedSku.monthlyPayg * 12;
  const annualReserved = selectedSku.monthlyReserved * 12;
  const annualSavings = annualPayg - annualReserved;

  const costFaqs = [
    {
      q: "How is Microsoft Fabric cost calculated?",
      a: "Microsoft Fabric costs are calculated by multiplying your capacity SKU hourly rate ($0.18 per CU/hour standard) by the number of running hours. Pay-As-You-Go is billed per second, while 1-Year Reserved Instances offer ~41% discounts."
    },
    {
      q: "Do I pay separately for Data Factory, Spark, and Power BI?",
      a: "No! Unlike legacy Azure services where compute was billed separately per service, Microsoft Fabric consolidates all workloads into a single Capacity Unit (CU) compute pool."
    },
    {
      q: "Can I pause my Microsoft Fabric capacity to save money?",
      a: "Yes. Pay-As-You-Go capacities can be paused during non-business hours or weekends via the Azure Portal, REST APIs, or Azure Automation scripts."
    },
    {
      q: "What is OneLake storage pricing?",
      a: "OneLake storage is billed separately at standard ADLS Gen2 rates (~$0.023 per GB/month for hot storage), with no额外 charge for Delta Parquet formatting."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": costFaqs.map(f => ({
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
        title="Microsoft Fabric Cost Calculator & FinOps Pricing Estimator"
        description="Calculate Microsoft Fabric costs across Pay-As-You-Go and 1-Year Reserved Instance tiers. Sizing guidance for F2 to F2048 SKUs with annual savings models."
        keywords="Microsoft Fabric Cost Calculator, Fabric Pricing Estimator, Fabric Capacity Pricing, Microsoft Fabric FinOps, Fabric Reserved Instance Savings"
        url="https://fabric.dattasable.com/cost-calculator"
        schema={[faqSchema]}
      />

      <div className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-12 space-y-12">
        {/* Header & Metadata */}
        <div className="border-b border-[#30363d] pb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#58a6ff]/10 border border-[#58a6ff]/30 text-[#58a6ff] text-xs font-semibold">
              <DollarSign className="w-4 h-4" />
              FinOps & Pricing Engineering Tool
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
            Microsoft Fabric Cost Calculator
          </h1>

          <p className="text-base md:text-lg text-[#8b949e] max-w-3xl leading-relaxed">
            Translate Microsoft Fabric Capacity Units (CUs) into precise monthly and annual financial estimates. Compare Pay-As-You-Go vs 1-Year Reserved Instance commitments to optimize cloud spend.
          </p>
        </div>

        {/* Interactive SKU Selector Widget */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#30363d] pb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-[#f0f6fc]">
                Interactive Fabric SKU Pricing Matrix
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">Select a capacity SKU to calculate instant monthly & annual costs.</p>
            </div>

            {/* Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8b949e]">Select SKU:</span>
              <select
                value={selectedSkuSlug}
                onChange={(e) => setSelectedSkuSlug(e.target.value)}
                className="bg-[#0d1117] border border-[#30363d] text-[#58a6ff] font-bold text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-[#58a6ff]"
              >
                {FABRIC_SKU_DATA.map(s => (
                  <option key={s.slug} value={s.slug}>
                    {s.name} ({s.cu} CUs)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-2">
              <div className="text-xs text-[#8b949e] font-semibold uppercase">Hourly Rate</div>
              <div className="text-3xl font-display font-bold text-[#58a6ff]">${selectedSku.hourlyPrice.toFixed(2)}</div>
              <div className="text-xs text-[#8b949e]">Per capacity hour (730 hrs/mo)</div>
            </div>

            <div className="p-6 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-2">
              <div className="text-xs text-[#8b949e] font-semibold uppercase">Monthly Pay-As-You-Go</div>
              <div className="text-3xl font-display font-bold text-[#e6edf3]">${selectedSku.monthlyPayg.toLocaleString()}</div>
              <div className="text-xs text-[#8b949e]">${annualPayg.toLocaleString()} / year</div>
            </div>

            <div className="p-6 rounded-xl bg-[#0d1117] border-2 border-[#3fb950] space-y-2 relative overflow-hidden">
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#238636] text-white text-[10px] font-bold">
                SAVE ~41%
              </div>
              <div className="text-xs text-[#3fb950] font-semibold uppercase">Monthly 1-Year Reserved</div>
              <div className="text-3xl font-display font-bold text-[#3fb950]">${selectedSku.monthlyReserved.toLocaleString()}</div>
              <div className="text-xs text-[#3fb950] font-semibold">Save ${annualSavings.toLocaleString()} annually</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-[#8b949e]">
            <div>
              <span className="font-semibold text-[#e6edf3]">Need exact workload sizing before purchasing?</span> Run our full multi-workload calculator to determine whether {selectedSku.name} matches your Data Factory, Spark, and Power BI needs.
            </div>
            <Link
              to="/wizard"
              className="px-5 py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>Full Capacity Sizing</span>
            </Link>
          </div>
        </div>

        {/* Real-World Sizing Scenarios */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#58a6ff]" />
            Real-World Fabric Cost Benchmarks
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#58a6ff]">PoC / Small Team</div>
              <div className="text-xl font-bold text-[#e6edf3]">F4 Capacity</div>
              <div className="text-2xl font-display font-bold text-[#3fb950]">$310<span className="text-xs text-[#8b949e] font-normal">/mo Reserved</span></div>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Ideal for 1-2 data engineers building lightweight Data Factory pipelines and basic lakehouse tables.
              </p>
            </div>

            <div className="bg-[#161b22] border-2 border-[#58a6ff] rounded-2xl p-6 space-y-3 relative">
              <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/40 font-bold">MOST POPULAR</span>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#58a6ff]">Enterprise Core</div>
              <div className="text-xl font-bold text-[#e6edf3]">F64 Capacity</div>
              <div className="text-2xl font-display font-bold text-[#3fb950]">$4,961<span className="text-xs text-[#8b949e] font-normal">/mo Reserved</span></div>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Unlocks free Power BI report viewing across the entire company and includes Microsoft Fabric Copilot AI.
              </p>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#58a6ff]">Hyperscale Hub</div>
              <div className="text-xl font-bold text-[#e6edf3]">F256 Capacity</div>
              <div className="text-2xl font-display font-bold text-[#3fb950]">$19,846<span className="text-xs text-[#8b949e] font-normal">/mo Reserved</span></div>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Multi-department analytics mesh supporting thousands of active users and massive parallel Spark ETL jobs.
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
              <div className="font-bold text-[#e6edf3]">Calculations Formulated by Datta Sable</div>
              <div className="text-xs text-[#58a6ff]">Microsoft Fabric Engineer & Data Platform Architect</div>
              <div className="text-xs text-[#8b949e] mt-1">Based on official Azure retail rates and 730 operating hours/month.</div>
            </div>
          </div>

          <a
            href="https://dattasable.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs text-[#e6edf3] hover:border-[#58a6ff] transition-colors shrink-0"
          >
            Read FinOps Articles on dattasable.com →
          </a>
        </div>

        {/* FAQs */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#d29922]" />
            Frequently Asked Cost & Billing Questions
          </h2>

          <div className="space-y-4">
            {costFaqs.map((f, idx) => (
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
