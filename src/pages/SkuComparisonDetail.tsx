import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { COMPARISONS_DATA } from "../data/comparisons";
import { SEO } from "../components/SEO";
import { Footer } from "../components/Footer";
import { KnowledgeGraphLinks } from "../components/KnowledgeGraphLinks";
import { 
  GitCompare, CheckCircle2, XCircle, ArrowRight, Calculator, 
  HelpCircle, Layers, Award, Sparkles 
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function SkuComparisonDetail() {
  const { pair } = useParams<{ pair: string }>();
  const { t } = useTranslation();

  const comparison = COMPARISONS_DATA.find(c => c.slug.toLowerCase() === pair?.toLowerCase());

  if (!comparison) {
    return <Navigate to="/pricing" replace />;
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": comparison.faqs.map(f => ({
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
        title={comparison.title}
        description={comparison.description}
        keywords={`Microsoft Fabric Comparison, ${comparison.leftName} vs ${comparison.rightName}, Fabric SKU Comparison, Power BI Premium vs Fabric`}
        url={`https://fabric.dattasable.com/compare/${comparison.slug}`}
        schema={[faqSchema]}
      />

      <div className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-12 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs text-[#8b949e] space-x-2">
          <Link to="/" className="hover:text-[#58a6ff]">Home</Link>
          <span>/</span>
          <Link to="/pricing" className="hover:text-[#58a6ff]">Comparisons</Link>
          <span>/</span>
          <span className="text-[#e6edf3] font-medium">{comparison.title}</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d29922]/10 border border-[#d29922]/30 text-[#d29922] text-xs font-semibold">
            <GitCompare className="w-3.5 h-3.5" />
            Architectural & Pricing Comparison
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-bold text-[#f0f6fc]">
            {comparison.title}
          </h1>

          <p className="text-lg text-[#8b949e] leading-relaxed">
            {comparison.subtitle}
          </p>

          <p className="text-sm text-[#c9d1d9] leading-relaxed">
            {comparison.description}
          </p>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-[#f0f6fc]">
              Specification Matrix
            </h2>
            <div className="text-xs text-[#8b949e]">
              Comparing <span className="text-[#58a6ff] font-semibold">{comparison.leftName}</span> vs <span className="text-[#3fb950] font-semibold">{comparison.rightName}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#161b22] text-xs uppercase text-[#8b949e] border-b border-[#30363d]">
                <tr>
                  <th className="py-4 px-6">Feature / Capability</th>
                  <th className="py-4 px-6 text-[#58a6ff] font-bold">{comparison.leftName}</th>
                  <th className="py-4 px-6 text-[#3fb950] font-bold">{comparison.rightName}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {comparison.specs.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-[#21262d]/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-[#e6edf3]">{spec.feature}</td>
                    <td className={`py-4 px-6 ${spec.winner === 'left' ? 'text-[#58a6ff] font-semibold bg-[#1f6feb]/10' : 'text-[#c9d1d9]'}`}>
                      {spec.leftValue}
                    </td>
                    <td className={`py-4 px-6 ${spec.winner === 'right' ? 'text-[#3fb950] font-semibold bg-[#238636]/10' : 'text-[#c9d1d9]'}`}>
                      {spec.rightValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Differences Deep Dive */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#58a6ff]" />
            Key Architectural Differences
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {comparison.keyDifferences.map((diff, idx) => (
              <div key={idx} className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-2">
                <h3 className="text-lg font-bold text-[#e6edf3] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#58a6ff]/10 text-[#58a6ff] text-xs font-bold flex items-center justify-center border border-[#58a6ff]/30">
                    {idx + 1}
                  </span>
                  {diff.title}
                </h3>
                <p className="text-sm text-[#8b949e] leading-relaxed pl-8">
                  {diff.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Recommendation */}
        <div className="bg-[#161b22] border-2 border-[#3fb950] rounded-2xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-[#3fb950] font-bold text-sm uppercase tracking-wider">
            <Award className="w-5 h-5" />
            Architectural Verdict & Recommendation
          </div>
          <p className="text-base text-[#e6edf3] leading-relaxed">
            {comparison.recommendation}
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/wizard"
              className="px-5 py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold flex items-center gap-2 shadow-lg transition-all"
            >
              <Calculator className="w-4 h-4" />
              Calculate My Workload SKU
            </Link>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#d29922]" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {comparison.faqs.map((f, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
                <div className="font-semibold text-sm text-[#e6edf3]">{f.question}</div>
                <div className="text-xs text-[#8b949e] mt-2 leading-relaxed">{f.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Internal Knowledge Graph */}
      <KnowledgeGraphLinks currentComparison={comparison.slug} />

      <Footer />
    </div>
  );
}
