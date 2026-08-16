import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Server, Database, Activity, LayoutDashboard, Shield } from "lucide-react";

export function ArchitecturePlanner() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  
  const [workload, setWorkload] = useState("");
  const [volume, setVolume] = useState("");
  const [concurrency, setConcurrency] = useState("");
  const [latency, setLatency] = useState("");
  const [sources, setSources] = useState("");
  const [governance, setGovernance] = useState("");

  const steps = [
    { num: 1, title: t("What are you building?") },
    { num: 2, title: t("Data Volume") },
    { num: 3, title: t("Users & Concurrency") },
    { num: 4, title: t("Latency") },
    { num: 5, title: t("Sources") },
    { num: 6, title: t("Governance Requirements") },
  ];

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);
  
  // Render nodes based on selections
  const generateDiagram = () => {
    // Basic logic mapping
    const hasStreaming = latency === "Real-Time" || latency === "Near Real-Time" || sources === "Streaming devices";
    const isWarehouse = workload === "Data Warehouse" || workload === "Enterprise Data Platform";
    const isLakehouse = workload === "Data Lakehouse" || workload === "Enterprise Data Platform";
    
    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 py-8 w-full overflow-x-auto text-sm text-center">
        {/* Source Tier */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-[#30363d] bg-[#0d1117] min-w-[140px]">
            <Server className="w-6 h-6 text-[#8b949e] mx-auto mb-2" />
            <div className="font-semibold text-white">{sources || "Data Sources"}</div>
          </div>
        </div>

        <ArrowRight className="hidden md:block w-6 h-6 text-[#58a6ff]" />
        <ArrowRight className="md:hidden w-6 h-6 text-[#58a6ff] rotate-90" />

        {/* Ingestion & Storage Tier (OneLake) */}
        <div className="flex flex-col gap-4 p-6 rounded-2xl border border-[#1f6feb]/30 bg-[#1f6feb]/5 min-w-[200px] relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0d1117] px-2 text-xs font-semibold text-[#58a6ff] border border-[#1f6feb]/30 rounded-full">
            OneLake
          </div>
          
          {hasStreaming && (
            <div className="p-3 rounded-lg border border-[#30363d] bg-[#161b22]">
              <Activity className="w-5 h-5 text-[#d29922] mx-auto mb-1" />
              <div className="text-white font-medium">Eventstream</div>
              <div className="text-xs text-[#8b949e]">KQL Database</div>
            </div>
          )}
          
          {isLakehouse && (
            <div className="p-3 rounded-lg border border-[#30363d] bg-[#161b22]">
              <Database className="w-5 h-5 text-[#3fb950] mx-auto mb-1" />
              <div className="text-white font-medium">Lakehouse</div>
              <div className="text-xs text-[#8b949e]">Medallion (Bronze/Silver/Gold)</div>
            </div>
          )}

          {isWarehouse && (
            <div className="p-3 rounded-lg border border-[#30363d] bg-[#161b22]">
              <Database className="w-5 h-5 text-[#58a6ff] mx-auto mb-1" />
              <div className="text-white font-medium">Data Warehouse</div>
              <div className="text-xs text-[#8b949e]">T-SQL Enterprise</div>
            </div>
          )}
          
          {!hasStreaming && !isLakehouse && !isWarehouse && (
            <div className="p-3 rounded-lg border border-[#30363d] bg-[#161b22]">
              <Database className="w-5 h-5 text-[#3fb950] mx-auto mb-1" />
              <div className="text-white font-medium">Lakehouse</div>
            </div>
          )}
        </div>

        <ArrowRight className="hidden md:block w-6 h-6 text-[#58a6ff]" />
        <ArrowRight className="md:hidden w-6 h-6 text-[#58a6ff] rotate-90" />

        {/* Serving Tier */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-[#a371f7]/30 bg-[#a371f7]/10 min-w-[160px]">
            <LayoutDashboard className="w-6 h-6 text-[#a371f7] mx-auto mb-2" />
            <div className="font-semibold text-white">Semantic Model</div>
            <div className="text-xs text-[#a371f7] font-medium mt-1">Direct Lake Mode</div>
          </div>
          <div className="p-3 rounded-xl border border-[#d29922]/30 bg-[#d29922]/10 min-w-[160px]">
            <Activity className="w-6 h-6 text-[#d29922] mx-auto mb-2" />
            <div className="font-semibold text-white">Power BI</div>
            <div className="text-xs text-[#8b949e]">{concurrency} Users</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>{t("Architecture Planner")} | {t("Fabric Master")}</title>
        <meta name="description" content={t("Interactive Architecture Planner for Microsoft Fabric.")} />
        <link rel="canonical" href="https://fabric.dattasable.com/architecture/planner" />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-[#58a6ff]" />
          {t("Architecture Planner")}
        </h1>
        <p className="text-[#8b949e]">
          {t("Design and validate your Microsoft Fabric architecture based on workloads, data volume, and latency requirements.")}
        </p>
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl">
        {/* Progress Bar */}
        <div className="flex border-b border-[#30363d] bg-[#0d1117] overflow-x-auto">
          {steps.map((s) => (
            <div 
              key={s.num} 
              className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium text-center border-r border-[#30363d] last:border-r-0 flex items-center justify-center gap-2
                ${step === s.num ? "bg-[#1f6feb]/10 text-[#58a6ff] border-b-2 border-b-[#58a6ff]" : 
                  step > s.num ? "text-[#3fb950]" : "text-[#8b949e]"}`}
            >
              {step > s.num && <CheckCircle2 className="w-4 h-4" />}
              <span className="hidden md:inline">{s.num}. {s.title}</span>
              <span className="md:hidden">{s.num}</span>
            </div>
          ))}
          {step === 7 && (
            <div className="flex-1 min-w-[120px] px-4 py-3 text-sm font-medium text-center bg-[#238636]/10 text-[#3fb950] border-b-2 border-b-[#3fb950]">
              Architecture Gen
            </div>
          )}
        </div>

        <div className="p-6 md:p-10">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-semibold text-white">{t("What are you building?")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Data Warehouse", "Data Lakehouse", "Real-Time Analytics", "BI Platform", "Enterprise Data Platform"].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWorkload(w)}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      workload === w ? "bg-[#1f6feb]/20 border-[#58a6ff] text-white ring-1 ring-[#58a6ff]" : "bg-[#0d1117] border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e]"
                    }`}
                  >
                    <div className="font-semibold text-base">{w}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-semibold text-white">{t("What is the expected Data Volume?")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["< 1 TB", "1 - 10 TB", "10 - 100 TB", "> 100 TB"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVolume(v)}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      volume === v ? "bg-[#1f6feb]/20 border-[#58a6ff] text-white ring-1 ring-[#58a6ff]" : "bg-[#0d1117] border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e]"
                    }`}
                  >
                    <div className="font-semibold text-base">{v}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-semibold text-white">{t("How many users / concurrency?")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["< 50 Users", "50 - 200 Users", "200 - 1000 Users", "> 1000 Users"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setConcurrency(c)}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      concurrency === c ? "bg-[#1f6feb]/20 border-[#58a6ff] text-white ring-1 ring-[#58a6ff]" : "bg-[#0d1117] border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e]"
                    }`}
                  >
                    <div className="font-semibold text-base">{c}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-semibold text-white">{t("What is the latency requirement?")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Batch (Daily/Hourly)", "Near Real-Time (Mins)", "Real-Time (Secs)"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLatency(l)}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      latency === l ? "bg-[#1f6feb]/20 border-[#58a6ff] text-white ring-1 ring-[#58a6ff]" : "bg-[#0d1117] border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e]"
                    }`}
                  >
                    <div className="font-semibold text-base">{l}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-semibold text-white">{t("What are the primary data sources?")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Cloud Native (SaaS, Azure, AWS)", "On-Prem Databases (SQL, Oracle)", "Streaming Devices / IoT", "Mixed Environment"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSources(s)}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      sources === s ? "bg-[#1f6feb]/20 border-[#58a6ff] text-white ring-1 ring-[#58a6ff]" : "bg-[#0d1117] border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e]"
                    }`}
                  >
                    <div className="font-semibold text-base">{s}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-semibold text-white">{t("Governance & Security Requirements?")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Basic Workspace Isolation", "Row/Column Level Security", "Advanced Purview & Lineage"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGovernance(g)}
                    className={`p-5 rounded-xl border text-left transition-all ${
                      governance === g ? "bg-[#1f6feb]/20 border-[#58a6ff] text-white ring-1 ring-[#58a6ff]" : "bg-[#0d1117] border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e]"
                    }`}
                  >
                    <div className="font-semibold text-base flex items-center gap-2">
                      {g.includes("Advanced") && <Shield className="w-4 h-4 text-[#3fb950]" />}
                      {g}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
                <h2 className="text-2xl font-bold text-white">{t("Generated Architecture")}</h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#1f6feb]/20 text-[#58a6ff] text-xs font-semibold">
                    {workload}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#3fb950]/20 text-[#3fb950] text-xs font-semibold">
                    {volume}
                  </span>
                </div>
              </div>
              
              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 md:p-8">
                {generateDiagram()}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5">
                  <h3 className="font-semibold text-[#c9d1d9] mb-2 border-b border-[#30363d] pb-2">Storage Strategy</h3>
                  <p className="text-sm text-[#8b949e]">
                    {volume === "> 100 TB" ? "Partitioned Delta tables with aggressive V-Order compression required." : "Standard Delta Lake tables using OneLake shortcuts."}
                  </p>
                </div>
                <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5">
                  <h3 className="font-semibold text-[#c9d1d9] mb-2 border-b border-[#30363d] pb-2">Compute Focus</h3>
                  <p className="text-sm text-[#8b949e]">
                    {concurrency === "> 1000 Users" ? "High SKU needed (F64+) for Semantic Model query concurrency." : "Moderate compute needed. Direct Lake recommended."}
                  </p>
                </div>
                <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5">
                  <h3 className="font-semibold text-[#c9d1d9] mb-2 border-b border-[#30363d] pb-2">Security Posture</h3>
                  <p className="text-sm text-[#8b949e]">
                    {governance.includes("Advanced") ? "Implement Purview Data Map and rigorous Row-Level Security in Warehouse/SQL endpoint." : "Standard Workspace Viewer/Contributor isolation."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-[#30363d]">
            {step > 1 && step < 7 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 text-[#8b949e] hover:text-white px-4 py-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> {t("Back")}
              </button>
            ) : <div />}
            
            {step < 6 ? (
              <button
                onClick={handleNext}
                disabled={(step === 1 && !workload) || (step === 2 && !volume) || (step === 3 && !concurrency) || (step === 4 && !latency) || (step === 5 && !sources)}
                className="flex items-center gap-2 bg-[#1f6feb] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#388bfd] disabled:opacity-50 transition-colors"
              >
                {t("Next Step")} <ArrowRight className="w-4 h-4" />
              </button>
            ) : step === 6 ? (
              <button
                onClick={handleNext}
                disabled={!governance}
                className="flex items-center gap-2 bg-[#238636] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#2ea043] disabled:opacity-50 transition-colors shadow-lg shadow-green-900/20"
              >
                <Sparkles className="w-4 h-4" /> {t("Generate Architecture")}
              </button>
            ) : (
              <button
                onClick={() => { setStep(1); setWorkload(""); setVolume(""); setConcurrency(""); setLatency(""); setSources(""); setGovernance(""); }}
                className="flex items-center gap-2 bg-[#21262d] text-white px-6 py-2.5 rounded-lg font-medium border border-[#30363d] hover:bg-[#30363d] transition-colors"
              >
                {t("Start Over")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
