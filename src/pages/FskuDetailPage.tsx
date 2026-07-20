import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { FABRIC_SKU_DATA } from "../data/fskus";
import { SEO } from "../components/SEO";
import { Footer } from "../components/Footer";
import { KnowledgeGraphLinks } from "../components/KnowledgeGraphLinks";
import { 
  CheckCircle2, DollarSign, Zap, ShieldCheck, ArrowRight, Calculator, 
  Sparkles, HelpCircle, Layers, Award
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function FskuDetailPage() {
  const { sku } = useParams<{ sku: string }>();
  const { t } = useTranslation();

  const skuInfo = FABRIC_SKU_DATA.find(s => s.slug.toLowerCase() === sku?.toLowerCase());

  if (!skuInfo) {
    return <Navigate to="/pricing" replace />;
  }

  const annualPayg = skuInfo.monthlyPayg * 12;
  const annualReserved = skuInfo.monthlyReserved * 12;
  const annualSavings = annualPayg - annualReserved;

  // Custom Product & FAQ Schemas
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `Microsoft Fabric ${skuInfo.name} Capacity`,
    "description": skuInfo.description,
    "brand": {
      "@type": "Brand",
      "name": "Microsoft Fabric"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": skuInfo.monthlyReserved.toString(),
      "highPrice": skuInfo.monthlyPayg.toString(),
      "offerCount": "2"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": skuInfo.faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col bg-[#0d1117] custom-scrollbar">
      <SEO
        title={`Microsoft Fabric ${skuInfo.name} Capacity - Sizing, Pricing & Specs`}
        description={`Complete specification guide for Microsoft Fabric ${skuInfo.name} (${skuInfo.cu} CUs). Pay-As-You-Go ($${skuInfo.monthlyPayg}/mo) vs 1-Year Reserved ($${skuInfo.monthlyReserved}/mo), Power BI Free user distribution, and Copilot support.`}
        keywords={`Microsoft Fabric ${skuInfo.name}, Fabric ${skuInfo.name} Price, Fabric ${skuInfo.name} Specs, Fabric ${skuInfo.cu} CU, Microsoft Fabric ${skuInfo.name} Capacity`}
        url={`https://fabric.dattasable.com/fsku/${skuInfo.slug}`}
        schema={[productSchema, faqSchema]}
      />

      <div className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-12 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs text-[#8b949e] space-x-2">
          <Link to="/" className="hover:text-[#58a6ff]">Home</Link>
          <span>/</span>
          <Link to="/pricing" className="hover:text-[#58a6ff]">SKU Pricing</Link>
          <span>/</span>
          <span className="text-[#e6edf3] font-medium">{skuInfo.name} Capacity</span>
        </nav>

        {/* Hero Banner */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <FabricBigLogo text={skuInfo.name} />
          </div>

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#58a6ff]/10 border border-[#58a6ff]/30 text-[#58a6ff] text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              {skuInfo.cu} Dedicated Capacity Units (CU)
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-[#f0f6fc]">
              Microsoft Fabric {skuInfo.name} Capacity
            </h1>

            <p className="text-lg text-[#8b949e] leading-relaxed">
              {skuInfo.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/wizard"
                className="px-6 py-3 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-semibold flex items-center gap-2 shadow-lg shadow-green-900/20 transition-all"
              >
                <Calculator className="w-5 h-5" />
                Run Capacity Sizing Wizard
              </Link>
              <Link
                to="/reserved-savings"
                className="px-6 py-3 rounded-xl bg-[#21262d] border border-[#30363d] hover:border-[#58a6ff] text-[#e6edf3] font-semibold flex items-center gap-2 transition-all"
              >
                <DollarSign className="w-5 h-5 text-[#3fb950]" />
                Calculate Reserved Savings
              </Link>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pay-As-You-Go */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8b949e]">Billing Option 1</div>
            <h2 className="text-2xl font-bold text-[#e6edf3]">Pay-As-You-Go (PAYG)</h2>
            <div className="text-3xl font-display font-bold text-[#58a6ff]">
              ${skuInfo.hourlyPrice.toFixed(2)} <span className="text-sm font-normal text-[#8b949e]">/ hour</span>
            </div>
            <div className="text-sm text-[#8b949e]">
              ~${skuInfo.monthlyPayg.toLocaleString()} / month (${annualPayg.toLocaleString()} / yr)
            </div>
            <p className="text-xs text-[#8b949e]">
              Billed per second with no long-term commitment. Ideal for temporary development, testing, or workloads that auto-pause on weekends.
            </p>
          </div>

          {/* 1-Year Reserved */}
          <div className="bg-[#161b22] border-2 border-[#3fb950] rounded-2xl p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#238636] text-white text-[11px] font-bold">
              ~41% Savings
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#3fb950]">Recommended Enterprise Billing</div>
            <h2 className="text-2xl font-bold text-[#e6edf3]">1-Year Reserved Instance</h2>
            <div className="text-3xl font-display font-bold text-[#3fb950]">
              ${skuInfo.monthlyReserved.toLocaleString()} <span className="text-sm font-normal text-[#8b949e]">/ month</span>
            </div>
            <div className="text-sm text-[#8b949e]">
              ${annualReserved.toLocaleString()} / year (<span className="text-[#3fb950] font-semibold">Save ${annualSavings.toLocaleString()}/yr</span>)
            </div>
            <p className="text-xs text-[#8b949e]">
              Commit to 1 year of continuous baseline capacity to lock in massive cost savings across all data workloads.
            </p>
          </div>
        </div>

        {/* Feature & Capability Matrix */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#58a6ff]" />
            {skuInfo.name} Technical Specifications & Entitlements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-start gap-3">
              <CheckCircle2 className={`w-5 h-5 mt-0.5 shrink-0 ${skuInfo.powerBiFreeUsers ? "text-[#3fb950]" : "text-[#8b949e]"}`} />
              <div>
                <div className="font-semibold text-sm text-[#e6edf3]">Power BI Free License Viewer Access</div>
                <div className="text-xs text-[#8b949e] mt-1">
                  {skuInfo.powerBiFreeUsers 
                    ? "UNLOCKED: Organizational users with free Power BI licenses can view content hosted in this capacity." 
                    : "LOCKED: Users require individual Power BI Pro or PPU licenses to view reports on this capacity."}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-start gap-3">
              <CheckCircle2 className={`w-5 h-5 mt-0.5 shrink-0 ${skuInfo.copilotSupport ? "text-[#3fb950]" : "text-[#8b949e]"}`} />
              <div>
                <div className="font-semibold text-sm text-[#e6edf3]">Microsoft Fabric Copilot AI Assistant</div>
                <div className="text-xs text-[#8b949e] mt-1">
                  {skuInfo.copilotSupport 
                    ? "UNLOCKED: Built-in Copilot AI features enabled for notebooks, DAX generation, and report insights." 
                    : "LOCKED: Copilot AI features require upgrading to F64 or higher."}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-start gap-3">
              <Zap className="w-5 h-5 text-[#d29922] mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-sm text-[#e6edf3]">Max Burst Compute Limit</div>
                <div className="text-xs text-[#8b949e] mt-1">
                  Up to {skuInfo.maxBurstCu} CUs allowed during short burst spikes under 24-hour background smoothing.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-start gap-3">
              <Award className="w-5 h-5 text-[#a371f7] mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-sm text-[#e6edf3]">Recommended Use Cases</div>
                <div className="text-xs text-[#8b949e] mt-1">
                  {skuInfo.recommendedFor.join(" • ")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#d29922]" />
            Frequently Asked Questions about Fabric {skuInfo.name}
          </h2>

          <div className="space-y-4">
            {skuInfo.faqs.map((f, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
                <div className="font-semibold text-sm text-[#e6edf3]">{f.question}</div>
                <div className="text-xs text-[#8b949e] mt-2 leading-relaxed">{f.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Internal Knowledge Graph */}
      <KnowledgeGraphLinks currentSku={skuInfo.slug} />

      <Footer />
    </div>
  );
}

function FabricBigLogo({ text }: { text: string }) {
  return (
    <div className="text-9xl font-black text-white select-none">
      {text}
    </div>
  );
}
