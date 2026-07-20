import React from "react";
import { Link } from "react-router-dom";
import { LABS_EXPERIMENTS } from "../data/labs";
import { SEO } from "../components/SEO";
import { Footer } from "../components/Footer";
import { KnowledgeGraphLinks } from "../components/KnowledgeGraphLinks";
import { Beaker, Sparkles, ArrowRight, Zap, CheckCircle2, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Labs() {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto flex flex-col bg-[#0d1117] custom-scrollbar">
      <SEO
        title="Fabric Master Labs - Experimental Calculators & Feature Radar"
        description="Explore experimental Microsoft Fabric calculators, Direct Lake memory estimators, Copilot token compute engines, and Microsoft Build announcement breakdowns."
        keywords="Fabric Master Labs, Microsoft Fabric Experimental Features, Direct Lake Memory Estimator, Fabric Copilot Calculator, Microsoft Build Fabric Announcements"
        url="https://fabric.dattasable.com/labs"
        noindex={true}
      />

      <div className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-12 space-y-12">
        {/* Header */}
        <div className="border-b border-[#30363d] pb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3fb950]/10 border border-[#3fb950]/30 text-[#3fb950] text-xs font-semibold">
            <Beaker className="w-4 h-4" />
            Fabric Master Labs Sandbox
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#f0f6fc]">
            Fabric Master Labs
          </h1>

          <p className="text-lg text-[#8b949e] max-w-3xl leading-relaxed">
            Test experimental estimators, preview upcoming Microsoft Fabric features, and explore bleeding-edge capacity planning tools before they hit mainstream production.
          </p>
        </div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LABS_EXPERIMENTS.map(exp => (
            <div 
              key={exp.id} 
              className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col justify-between hover:border-[#3fb950] transition-all group shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#0d1117] border border-[#30363d] text-[#3fb950] font-mono font-medium">
                    {exp.badge}
                  </span>
                  <span className="text-xs text-[#8b949e]">{exp.releaseDate}</span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#e6edf3] group-hover:text-[#3fb950] transition-colors">
                    {exp.title}
                  </h2>
                  <p className="text-xs text-[#8b949e] mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-semibold uppercase text-[#8b949e]">Key Capabilities:</div>
                  {exp.features.map((feat, idx) => (
                    <div key={idx} className="text-xs text-[#c9d1d9] flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#30363d] flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {exp.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#0d1117] text-[#8b949e] border border-[#30363d]">
                      #{t}
                    </span>
                  ))}
                </div>

                <Link
                  to="/wizard"
                  className="text-xs font-semibold text-[#3fb950] hover:underline flex items-center gap-1 shrink-0"
                >
                  Test Experiment
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Labs Notice */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex items-start gap-4 text-xs text-[#8b949e]">
          <ShieldAlert className="w-5 h-5 text-[#d29922] shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-[#e6edf3]">Disclaimer for Fabric Master Labs</div>
            <div className="mt-1 leading-relaxed">
              Lab experiments contain pre-release equations, community heuristics, and upcoming Microsoft Build roadmap analyses. Features may graduate to stable tools or undergo formula refinements.
            </div>
          </div>
        </div>
      </div>

      <KnowledgeGraphLinks />

      <Footer />
    </div>
  );
}
