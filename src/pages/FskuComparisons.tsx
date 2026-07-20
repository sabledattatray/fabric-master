import React from "react";
import { SEO } from "../components/SEO";
import { GitCompare, ArrowRight, BookOpen, Layers, CheckCircle2, HelpCircle, ShieldCheck, Clock, Sparkles, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { KnowledgeGraphLinks } from "../components/KnowledgeGraphLinks";
import { COMPARISONS_DATA } from "../data/comparisons";
import { FABRIC_SKU_DATA } from "../data/fskus";

export function FskuComparisons() {
  const { t } = useTranslation();

  const comparisonFaqs = [
    {
      q: "Why compare Microsoft Fabric SKUs before purchasing?",
      a: "Choosing the correct SKU prevents capacity throttling, ensures smooth background job processing, and unlocks key enterprise features like Power BI Free user distribution and Copilot AI assistant capabilities."
    },
    {
      q: "What is the most popular Microsoft Fabric enterprise SKU?",
      a: "Microsoft Fabric F64 is the flagship enterprise tier because it is the minimum capacity SKU that allows organizational users with free Power BI licenses to consume reports without buying individual Pro licenses."
    },
    {
      q: "Can I scale up from F32 to F64 without downtime?",
      a: "Yes. Resizing a Microsoft Fabric capacity takes less than a minute in the Azure Portal with zero data loss, zero workspace migration, and zero service interruption."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": comparisonFaqs.map(f => ({
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
        title="Microsoft Fabric SKU & Architecture Comparison Directory"
        description="Comprehensive technical and pricing comparison directory for Microsoft Fabric SKUs. Compare F32 vs F64, Power BI Premium vs Fabric, Synapse vs Fabric, and Warehouse vs Lakehouse."
        keywords="Microsoft Fabric SKU Comparisons, F32 vs F64, Power BI Premium vs Fabric, Synapse vs Fabric, Warehouse vs Lakehouse, Fabric Capacity Matrix"
        url="https://fabric.dattasable.com/fsku-comparisons"
        schema={[faqSchema]}
      />

      <div className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-12 space-y-12">
        {/* Header & Metadata */}
        <div className="border-b border-[#30363d] pb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#58a6ff]/10 border border-[#58a6ff]/30 text-[#58a6ff] text-xs font-semibold">
              <GitCompare className="w-4 h-4" />
              Comparison & Architecture Hub
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
            Microsoft Fabric Comparison Directory
          </h1>

          <p className="text-base md:text-lg text-[#8b949e] max-w-3xl leading-relaxed">
            Understand exact technical limits, throttling thresholds, pricing models, and architectural trade-offs across Microsoft Fabric SKUs and legacy Azure analytics platforms.
          </p>
        </div>

        {/* Featured Deep-Dive Comparisons */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-[#d29922]" />
            Featured Architectural & SKU Comparisons
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMPARISONS_DATA.map(comp => (
              <Link
                key={comp.slug}
                to={`/compare/${comp.slug}`}
                className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 hover:border-[#d29922] transition-all group shadow-md space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#0d1117] text-[#d29922] border border-[#30363d] font-semibold">
                      Comparison Guide
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#8b949e] group-hover:text-[#d29922] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-bold text-[#e6edf3] group-hover:text-[#d29922] transition-colors">
                    {comp.title}
                  </h3>
                  <p className="text-xs text-[#8b949e] line-clamp-2 leading-relaxed">
                    {comp.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#30363d] flex items-center justify-between text-xs text-[#58a6ff]">
                  <span>Comparing {comp.leftName} vs {comp.rightName}</span>
                  <span className="font-semibold text-[#d29922]">Read Spec Matrix →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All F-SKU Specification Pages */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#3fb950]" />
            Microsoft Fabric F-SKU Reference Pages
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {FABRIC_SKU_DATA.map(sku => (
              <Link
                key={sku.slug}
                to={`/fsku/${sku.slug}`}
                className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#3fb950] transition-all group text-left space-y-1.5"
              >
                <div className="font-bold text-sm text-[#3fb950] group-hover:underline flex items-center justify-between">
                  {sku.name} Capacity
                </div>
                <div className="text-xs text-[#e6edf3] font-mono">{sku.cu} Capacity Units</div>
                <div className="text-[11px] text-[#8b949e]">${sku.monthlyReserved.toLocaleString()}/mo Reserved</div>
              </Link>
            ))}
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
              <div className="font-bold text-[#e6edf3]">Comparison Directory by Datta Sable</div>
              <div className="text-xs text-[#58a6ff]">Microsoft Fabric Engineer & Data Platform Architect</div>
              <div className="text-xs text-[#8b949e] mt-1">Independent technical evaluation based on official Microsoft Fabric benchmarks.</div>
            </div>
          </div>

          <a
            href="https://dattasable.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs text-[#e6edf3] hover:border-[#58a6ff] transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>Read Architecture Articles on dattasable.com</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#58a6ff]" />
          </a>
        </div>

        {/* FAQs */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#d29922]" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {comparisonFaqs.map((f, idx) => (
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
