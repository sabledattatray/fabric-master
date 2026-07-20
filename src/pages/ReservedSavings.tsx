import React from "react";
import { SEO } from "../components/SEO";
import { DollarSign, ArrowRight, TrendingDown, Calculator, CheckCircle2, HelpCircle, ShieldCheck, Clock, Award, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { KnowledgeGraphLinks } from "../components/KnowledgeGraphLinks";
import { FABRIC_SKU_DATA } from "../data/fskus";

export function ReservedSavings() {
  const { t } = useTranslation();

  const reservedFaqs = [
    {
      q: "What is a Microsoft Fabric Reserved Instance?",
      a: "A Microsoft Fabric Reserved Instance (RI) is an enterprise commitment to purchase Fabric Capacity Units (CUs) for a 1-year term. In exchange for this continuous commitment, Microsoft grants ~41% discounts compared to standard hourly Pay-As-You-Go rates."
    },
    {
      q: "Can I exchange or resize my Reserved Instance capacity?",
      a: "Yes. Microsoft permits capacity exchanges and SKU upgrades within the Azure Portal, allowing organizations to scale up as their data workload demands grow."
    },
    {
      q: "Are Reserved Instances billed upfront or monthly?",
      a: "Azure supports flexible monthly billing for 1-Year Reserved Instances at no extra interest charge, allowing you to pay the discounted rate month-by-month."
    },
    {
      q: "What happens if our workload exceeds the Reserved Instance capacity?",
      a: "Any compute usage exceeding your Reserved CU baseline automatically spills over into standard Pay-As-You-Go rates, ensuring your applications never experience outages."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": reservedFaqs.map(f => ({
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
        title="Microsoft Fabric Reserved Instance Savings Calculator (~41% Off)"
        description="Calculate annual budget savings with Microsoft Fabric 1-Year Reserved Capacity Instances. Compare PAYG vs Reserved pricing for F2 to F2048 SKUs."
        keywords="Microsoft Fabric Reserved Savings, Fabric Reserved Instance Calculator, Fabric 1-Year Commitment Discount, Fabric FinOps Savings"
        url="https://fabric.dattasable.com/reserved-savings"
        schema={[faqSchema]}
      />

      <div className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-12 space-y-12">
        {/* Header & Metadata */}
        <div className="border-b border-[#30363d] pb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3fb950]/10 border border-[#3fb950]/30 text-[#3fb950] text-xs font-semibold">
              <TrendingDown className="w-4 h-4" />
              FinOps Discount Engine
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
            Reserved Capacity Savings Estimator
          </h1>

          <p className="text-base md:text-lg text-[#8b949e] max-w-3xl leading-relaxed">
            Explore how a 1-year Microsoft Fabric capacity commitment reduces compute costs by approximately 41%. Model annual budget savings across F-SKUs.
          </p>
        </div>

        {/* Savings Comparison Table */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl space-y-6">
          <div className="p-6 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-[#f0f6fc]">
                F-SKU Reserved Capacity Savings Matrix
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">Official Microsoft Fabric 1-Year Reserved vs Pay-As-You-Go monthly pricing.</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 font-semibold hidden sm:inline-block">
              ~41% SAVINGS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#161b22] text-xs uppercase text-[#8b949e] border-b border-[#30363d]">
                <tr>
                  <th className="py-3.5 px-6">SKU Tier</th>
                  <th className="py-3.5 px-6">Capacity Units</th>
                  <th className="py-3.5 px-6">PAYG Monthly</th>
                  <th className="py-3.5 px-6 text-[#3fb950]">1-Yr Reserved</th>
                  <th className="py-3.5 px-6 text-[#3fb950]">Annual Savings</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {FABRIC_SKU_DATA.map(sku => {
                  const paygYr = sku.monthlyPayg * 12;
                  const resYr = sku.monthlyReserved * 12;
                  const savYr = paygYr - resYr;
                  return (
                    <tr key={sku.slug} className="hover:bg-[#21262d]/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#e6edf3]">{sku.name}</td>
                      <td className="py-4 px-6 text-[#8b949e]">{sku.cu} CU</td>
                      <td className="py-4 px-6 text-[#c9d1d9]">${sku.monthlyPayg.toLocaleString()}</td>
                      <td className="py-4 px-6 text-[#3fb950] font-bold">${sku.monthlyReserved.toLocaleString()}</td>
                      <td className="py-4 px-6 text-[#3fb950] font-semibold">${savYr.toLocaleString()} / yr</td>
                      <td className="py-4 px-6 text-right">
                        <Link to={`/fsku/${sku.slug}`} className="text-xs text-[#58a6ff] hover:underline">
                          View Specs →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strategic FinOps Framework */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8b949e]">When to Use Pay-As-You-Go</div>
            <h3 className="text-lg font-bold text-[#e6edf3]">Variable & Temporary Workloads</h3>
            <ul className="space-y-2 text-xs text-[#8b949e]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#58a6ff] shrink-0" />
                <span>Development and testing environments that auto-pause on weekends.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#58a6ff] shrink-0" />
                <span>Short-term proof of concepts (PoC) under 3 months.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#58a6ff] shrink-0" />
                <span>Highly unpredictable seasonal bursts.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#161b22] border-2 border-[#3fb950] rounded-2xl p-6 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#3fb950]">When to Use 1-Year Reserved</div>
            <h3 className="text-lg font-bold text-[#e6edf3]">Production Enterprise Baseline</h3>
            <ul className="space-y-2 text-xs text-[#8b949e]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Production Lakehouse, Data Warehouse, and Power BI capacities.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Capacities running 24/7 background scheduled ETL jobs.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Locking in guaranteed 41% cost savings for predictable budgets.</span>
              </li>
            </ul>
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
              <div className="text-xs text-[#8b949e] mt-1">Based on official Azure Reserved Instance pricing guidance.</div>
            </div>
          </div>

          <Link
            to="/wizard"
            className="px-5 py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            <span>Run Workload Assessment</span>
          </Link>
        </div>

        {/* FAQs */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#d29922]" />
            Frequently Asked Questions about Reserved Capacity
          </h2>

          <div className="space-y-4">
            {reservedFaqs.map((f, idx) => (
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
