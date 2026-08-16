import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Bot, ArrowRight, AlertTriangle, Zap, Info } from "lucide-react";
import { generateRecommendation } from "../lib/fabric/advisor/recommendations";
import { WorkloadContext, FabricRecommendation } from "../lib/fabric/advisor/types";

export function AIAdvisor() {
  const { t } = useTranslation();
  
  const [context, setContext] = useState<WorkloadContext>({
    dataVolumeGB: 100,
    concurrentUsers: 10,
    latencyRequirement: "batch",
    primaryWorkload: "bi",
    sourceSystems: 1
  });

  const [recommendation, setRecommendation] = useState<FabricRecommendation | null>(null);

  const handleGenerate = () => {
    const rec = generateRecommendation(context);
    setRecommendation(rec);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>{t("AI Advisor")} | {t("Fabric Master")}</title>
        <meta name="description" content={t("Deterministic AI Advisor for Microsoft Fabric architecture and capacity planning.")} />
        <link rel="canonical" href="https://fabric.dattasable.com/ai-advisor" />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Bot className="w-8 h-8 text-[#58a6ff]" />
          {t("Fabric AI Advisor")}
        </h1>
        <p className="text-[#8b949e]">
          {t("Get deterministic engineering recommendations for your Microsoft Fabric workloads.")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white border-b border-[#30363d] pb-2">{t("Workload Context")}</h2>
            
            <div>
              <label className="block text-sm font-medium text-[#c9d1d9] mb-1">{t("Data Volume (GB)")}</label>
              <input 
                type="number" 
                value={context.dataVolumeGB}
                onChange={(e) => setContext({...context, dataVolumeGB: parseInt(e.target.value) || 0})}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#58a6ff]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#c9d1d9] mb-1">{t("Concurrent Users")}</label>
              <input 
                type="number" 
                value={context.concurrentUsers}
                onChange={(e) => setContext({...context, concurrentUsers: parseInt(e.target.value) || 0})}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#58a6ff]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c9d1d9] mb-1">{t("Latency Requirement")}</label>
              <select 
                value={context.latencyRequirement}
                onChange={(e) => setContext({...context, latencyRequirement: e.target.value as any})}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#58a6ff]"
              >
                <option value="batch">Batch</option>
                <option value="near-real-time">Near Real-Time</option>
                <option value="real-time">Real-Time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c9d1d9] mb-1">{t("Primary Workload")}</label>
              <select 
                value={context.primaryWorkload}
                onChange={(e) => setContext({...context, primaryWorkload: e.target.value as any})}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#58a6ff]"
              >
                <option value="bi">Power BI / Reporting</option>
                <option value="data-engineering">Data Engineering (ETL)</option>
                <option value="data-science">Data Science (ML)</option>
                <option value="real-time-analytics">Real-Time Analytics</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full mt-4 flex justify-center items-center gap-2 bg-[#238636] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2ea043]"
            >
              {t("Generate Recommendation")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {recommendation ? (
            <div className="space-y-6">
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{t("Recommended Architecture")}</h2>
                    <p className="text-[#58a6ff] font-medium mt-1">{recommendation.architecture.name}</p>
                  </div>
                  <div className="bg-[#1f6feb]/20 text-[#58a6ff] px-3 py-1 rounded-full text-sm font-medium border border-[#1f6feb]/30">
                    {recommendation.capacity.sku}
                  </div>
                </div>
                
                <p className="text-[#c9d1d9] mb-6">{recommendation.architecture.description}</p>
                
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-[#8b949e] uppercase mb-2">{t("Data Flow")}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-[#c9d1d9] font-mono text-sm">
                    {recommendation.architecture.flow.split("->").map((step, idx, arr) => (
                      <React.Fragment key={idx}>
                        <span className="bg-[#21262d] px-2 py-1 rounded border border-[#30363d]">{step.trim()}</span>
                        {idx < arr.length - 1 && <ArrowRight className="w-4 h-4 text-[#8b949e]" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-[#8b949e] uppercase flex items-center gap-2 mb-3">
                      <Info className="w-4 h-4 text-[#58a6ff]" /> {t("Why?")}
                    </h3>
                    <ul className="space-y-2">
                      {recommendation.reasoning.map((r, i) => (
                        <li key={i} className="text-sm text-[#c9d1d9]">
                          <span className="font-medium text-white">{r.factor}:</span> {r.deduction}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#8b949e] uppercase flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-[#d29922]" /> {t("Risks")}
                    </h3>
                    {recommendation.risks.length > 0 ? (
                      <ul className="space-y-2">
                        {recommendation.risks.map((r) => (
                          <li key={r.id} className="text-sm text-[#c9d1d9] flex items-start gap-2">
                            <span className="text-[#d29922] mt-0.5">•</span>
                            <span>{r.description}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-[#8b949e]">{t("No major risks identified.")}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {recommendation.optimizations.length > 0 && (
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-[#8b949e] uppercase flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-[#3fb950]" /> {t("Optimizations")}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {recommendation.optimizations.map((opt) => (
                      <div key={opt.id} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                        <h4 className="font-medium text-white text-sm mb-1">{opt.title}</h4>
                        <p className="text-sm text-[#c9d1d9]">{opt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-12 flex flex-col items-center justify-center text-center h-full">
              <Bot className="w-16 h-16 text-[#30363d] mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">{t("Ready for Analysis")}</h3>
              <p className="text-[#8b949e] max-w-md">
                {t("Configure your workload context on the left and click Generate Recommendation to receive a deterministic architecture and capacity plan.")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
