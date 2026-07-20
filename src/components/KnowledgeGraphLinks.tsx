import React from "react";
import { Link } from "react-router-dom";
import { Calculator, GitCompare, BookOpen, ExternalLink, Sparkles, ArrowRight, GraduationCap } from "lucide-react";
import { FABRIC_SKU_DATA } from "../data/fskus";
import { COMPARISONS_DATA } from "../data/comparisons";
import { ARTICLES } from "../data/articles";

interface KnowledgeGraphLinksProps {
  currentCategory?: string;
  currentSku?: string;
  currentComparison?: string;
  className?: string;
}

export function KnowledgeGraphLinks({ 
  currentCategory, 
  currentSku, 
  currentComparison,
  className = "" 
}: KnowledgeGraphLinksProps) {
  // Related SKUs (exclude current if provided)
  const relatedSkus = FABRIC_SKU_DATA
    .filter(s => s.slug !== currentSku)
    .slice(0, 4);

  // Related Comparisons
  const relatedComparisons = COMPARISONS_DATA
    .filter(c => c.slug !== currentComparison)
    .slice(0, 3);

  // Related Articles
  const relatedArticles = ARTICLES.slice(0, 3);

  return (
    <section className={`w-full bg-[#161b22] border-t border-[#30363d] py-12 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#58a6ff]" />
              Microsoft Fabric Knowledge Graph & Related Tools
            </h2>
            <p className="text-sm text-[#8b949e] mt-1">
              Explore interconnected capacity calculators, SKU comparisons, and technical guides.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Related Tools */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#58a6ff] flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Planning & Estimators
            </h3>
            <div className="space-y-2">
              <Link to="/wizard" className="block p-3 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] transition-all group">
                <div className="font-semibold text-sm text-[#e6edf3] group-hover:text-[#58a6ff] flex items-center justify-between">
                  Capacity Sizing Wizard
                  <ArrowRight className="w-4 h-4 text-[#8b949e] group-hover:text-[#58a6ff] transition-colors" />
                </div>
                <div className="text-xs text-[#8b949e] mt-1">AI-guided multi-workload Fabric SKU calculation</div>
              </Link>

              <Link to="/cost-calculator" className="block p-3 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] transition-all group">
                <div className="font-semibold text-sm text-[#e6edf3] group-hover:text-[#58a6ff] flex items-center justify-between">
                  Cost & Pricing Estimator
                  <ArrowRight className="w-4 h-4 text-[#8b949e] group-hover:text-[#58a6ff] transition-colors" />
                </div>
                <div className="text-xs text-[#8b949e] mt-1">Translate CUs into monthly PAYG & Reserved costs</div>
              </Link>

              <Link to="/spark-estimator" className="block p-3 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] transition-all group">
                <div className="font-semibold text-sm text-[#e6edf3] group-hover:text-[#58a6ff] flex items-center justify-between">
                  Spark CU Estimator
                  <ArrowRight className="w-4 h-4 text-[#8b949e] group-hover:text-[#58a6ff] transition-colors" />
                </div>
                <div className="text-xs text-[#8b949e] mt-1">Size Apache Spark pools and batch workloads</div>
              </Link>

              <Link to="/power-bi-capacity" className="block p-3 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] transition-all group">
                <div className="font-semibold text-sm text-[#e6edf3] group-hover:text-[#58a6ff] flex items-center justify-between">
                  Power BI Capacity Calculator
                  <ArrowRight className="w-4 h-4 text-[#8b949e] group-hover:text-[#58a6ff] transition-colors" />
                </div>
                <div className="text-xs text-[#8b949e] mt-1">Model peak concurrency and Direct Lake queries</div>
              </Link>
            </div>
          </div>

          {/* Related F-SKU Guides */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#3fb950] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Fabric F-SKU Deep Dives
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {relatedSkus.map(s => (
                <Link key={s.slug} to={`/fsku/${s.slug}`} className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] transition-all group">
                  <div className="font-semibold text-sm text-[#3fb950] group-hover:underline flex items-center justify-between">
                    {s.name} Capacity
                  </div>
                  <div className="text-[11px] text-[#8b949e] mt-1">{s.cu} CUs • ${s.monthlyReserved.toLocaleString()}/mo</div>
                </Link>
              ))}
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-semibold uppercase text-[#8b949e] mb-2 flex items-center gap-1.5">
                <GitCompare className="w-3.5 h-3.5" /> Popular Comparisons
              </h4>
              <div className="space-y-1.5">
                {relatedComparisons.map(c => (
                  <Link key={c.slug} to={`/compare/${c.slug}`} className="block text-xs text-[#c9d1d9] hover:text-[#58a6ff] transition-colors line-clamp-1">
                    • {c.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Related Articles & Deep Learning Paths on dattasable.com */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a371f7] flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Deep Learning Paths & Articles
            </h3>
            <div className="space-y-2">
              {relatedArticles.map(a => (
                <Link key={a.id} to={`/docs/${a.id}`} className="block p-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#a371f7] transition-all group">
                  <div className="font-medium text-xs text-[#e6edf3] group-hover:text-[#a371f7] transition-colors line-clamp-1">
                    {a.title}
                  </div>
                  <div className="text-[11px] text-[#8b949e] line-clamp-1 mt-0.5">{a.description}</div>
                </Link>
              ))}

              {/* Contextual dattasable.com Learning Path Links */}
              <div className="pt-2 space-y-2">
                <a 
                  href="https://dattasable.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block p-3 rounded-xl bg-[#0d1117] border border-[#a371f7]/40 hover:border-[#a371f7] transition-all group"
                >
                  <div className="font-semibold text-xs text-[#a371f7] flex items-center justify-between">
                    <span>DP-600 & DP-700 Certification Deep Dive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] text-[#8b949e] mt-1">Read complete Microsoft Fabric exam study guides on dattasable.com</div>
                </a>

                <a 
                  href="https://dattasable.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block p-3 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] transition-all group"
                >
                  <div className="font-semibold text-xs text-[#58a6ff] flex items-center justify-between">
                    <span>OneLake & Medallion Architecture Guide</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] text-[#8b949e] mt-1">Enterprise Delta Lake & OneLake shortcut design patterns</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
