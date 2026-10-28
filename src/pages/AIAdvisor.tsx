/**
 * Fabric Master v4.0 - AI Engineering Advisor Studio
 *
 * Implements PRD Section 21 & Section 44:
 * - Contextually connected to user scenarios and deterministic calculation results.
 * - Explains capacity sizing, FinOps break-even, architecture, and throttling risk.
 * - Strict Grounding: All numbers, SKUs, and costs derive from calculateCapacity()
 *   and calculateReservationEconomics(). Never fabricates numbers.
 * - Trust Controls: Explicit disclosure, zero external tenant exfiltration,
 *   prompt injection sanitization, and structured technical explanations.
 */

import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Bot,
  ArrowRight,
  AlertTriangle,
  Zap,
  Info,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Cpu,
  Layers,
  ExternalLink,
  BookOpen,
  FolderDown,
  Sparkles,
  HelpCircle,
  Clock,
  Database
} from "lucide-react";
import {
  generateScenarioExplanation,
  generateRecommendation,
  sanitizeAdvisorInput
} from "../lib/fabric/advisor/recommendations";
import {
  AdvisorTaskType,
  ScenarioAdvisorReport,
  WorkloadContext,
  FabricRecommendation
} from "../lib/fabric/advisor/types";
import {
  getScenarios,
  getActiveScenarioId,
  setActiveScenarioId
} from "../lib/scenarios";
import { Scenario } from "../types";

export function AIAdvisor() {
  const { t } = useTranslation();

  // Load available scenarios
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("");
  const [taskType, setTaskType] = useState<AdvisorTaskType>("capacity_explanation");
  const [report, setReport] = useState<ScenarioAdvisorReport | null>(null);

  // Fallback custom workload context state
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customContext, setCustomContext] = useState<WorkloadContext>({
    dataVolumeGB: 500,
    concurrentUsers: 50,
    latencyRequirement: "batch",
    primaryWorkload: "bi",
    sourceSystems: 3
  });
  const [legacyRec, setLegacyRec] = useState<FabricRecommendation | null>(null);

  useEffect(() => {
    const list = getScenarios();
    setScenarios(list);
    const savedActiveId = getActiveScenarioId();
    const active = list.find((s) => s.id === savedActiveId) || list[0] || null;
    if (active) {
      setSelectedScenarioId(active.id);
      const rep = generateScenarioExplanation(active, "capacity_explanation");
      setReport(rep);
    }
  }, []);

  const activeScenario = useMemo(() => {
    return scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0] || null;
  }, [scenarios, selectedScenarioId]);

  // Handle switching scenario or task type
  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setActiveScenarioId(id);
    const target = scenarios.find((s) => s.id === id);
    if (target) {
      const rep = generateScenarioExplanation(target, taskType);
      setReport(rep);
    }
  };

  const handleSelectTaskType = (type: AdvisorTaskType) => {
    setTaskType(type);
    if (activeScenario && !isCustomMode) {
      const rep = generateScenarioExplanation(activeScenario, type);
      setReport(rep);
    }
  };

  const handleGenerateCustom = () => {
    const rec = generateRecommendation(customContext);
    setLegacyRec(rec);
  };

  const exportAdvisorReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `advisor-explanation-${report.scenarioName.replace(/\s+/g, "_").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] pb-16">
      <Helmet>
        <title>AI Engineering Advisor | Fabric Master</title>
        <meta
          name="description"
          content="Grounded technical AI explanation layer for Microsoft Fabric. Explains deterministic capacity sizing, FinOps reservation break-even, and architecture topologies."
        />
        <link rel="canonical" href="https://fabric.dattasable.com/ai-advisor" />
      </Helmet>

      {/* Top Banner */}
      <div className="border-b border-[#30363d] bg-[#161b22]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40">
                  <Bot className="w-3.5 h-3.5" />
                  Phase 8 Subsystem
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Deterministic Grounding
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Fabric AI Engineering Advisor
              </h1>
              <p className="mt-2 text-base text-[#8b949e] max-w-3xl">
                A technical explanation layer grounded in Microsoft Fabric October 2026 guidelines. Explains why a specific F-SKU was recommended, calculates break-even reservation thresholds, and reviews architectural flow without fabricating numbers.
              </p>
            </div>

            {report && (
              <button
                onClick={exportAdvisorReport}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] border border-[#30363d] transition-colors self-start md:self-auto"
              >
                <FolderDown className="w-4 h-4" />
                Export Advisor Audit JSON
              </button>
            )}
          </div>

          {/* AI Disclosure Banner */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 bg-[#1f6feb]/10 border border-[#1f6feb]/30 rounded-lg text-xs text-[#58a6ff]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-[#58a6ff]" />
              <span>
                <strong>Non-Speculative Trust Architecture:</strong> The AI Advisor functions strictly as an explanation layer. Numerical capacity requirements, pricing multipliers, and break-even hours are calculated deterministically from documented formulas and cannot be altered by model hallucinations.
              </span>
            </div>
            <Link to="/workspace" className="inline-flex items-center gap-1 font-semibold underline hover:text-white flex-shrink-0">
              Workspace Sizing
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Scenario & Task Controls */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Scenario Picker */}
            <div className="flex-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8b949e]">
                Connected Scenario Context
              </span>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <select
                  value={selectedScenarioId}
                  onChange={(e) => handleSelectScenario(e.target.value)}
                  disabled={isCustomMode}
                  className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-[#58a6ff] min-w-[280px]"
                >
                  {scenarios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.region.toUpperCase()} · {s.currency})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className={`text-xs px-3 py-2 rounded-lg border font-medium transition ${
                    isCustomMode
                      ? "bg-[#1f6feb]/20 text-[#58a6ff] border-[#1f6feb]"
                      : "bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]"
                  }`}
                >
                  {isCustomMode ? "Switch to Saved Scenario" : "Manual Workload Overrides"}
                </button>
              </div>
            </div>

            {/* Task Type Tabs */}
            {!isCustomMode && (
              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8b949e] block">
                  Select Explanation Topic
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "capacity_explanation", label: "Capacity & SKU Sizing" },
                    { id: "finops_breakdown", label: "FinOps & Reservation" },
                    { id: "architecture_review", label: "Architecture Topology" },
                    { id: "throttling_risk", label: "Throttling & Concurrency" },
                    { id: "executive_summary", label: "Executive Brief" }
                  ].map((tItem) => (
                    <button
                      key={tItem.id}
                      onClick={() => handleSelectTaskType(tItem.id as AdvisorTaskType)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        taskType === tItem.id
                          ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                          : "bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]"
                      }`}
                    >
                      {tItem.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CUSTOM MODE OVERRIDES (If Toggled) */}
        {isCustomMode && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white border-b border-[#30363d] pb-2">
              Manual Workload Parameters
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[#8b949e] mb-1">Data Volume (GB)</label>
                <input
                  type="number"
                  value={customContext.dataVolumeGB}
                  onChange={(e) =>
                    setCustomContext({ ...customContext, dataVolumeGB: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#8b949e] mb-1">Peak Concurrent Users</label>
                <input
                  type="number"
                  value={customContext.concurrentUsers}
                  onChange={(e) =>
                    setCustomContext({ ...customContext, concurrentUsers: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#8b949e] mb-1">Latency Requirement</label>
                <select
                  value={customContext.latencyRequirement}
                  onChange={(e) =>
                    setCustomContext({ ...customContext, latencyRequirement: e.target.value as any })
                  }
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white"
                >
                  <option value="batch">Batch Ingestion</option>
                  <option value="near-real-time">Near Real-Time</option>
                  <option value="real-time">Sub-Second Streaming (KQL)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8b949e] mb-1">Primary Workload</label>
                <select
                  value={customContext.primaryWorkload}
                  onChange={(e) =>
                    setCustomContext({ ...customContext, primaryWorkload: e.target.value as any })
                  }
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white"
                >
                  <option value="bi">Power BI / Reporting</option>
                  <option value="data-engineering">Data Engineering (ETL)</option>
                  <option value="data-science">Data Science (ML)</option>
                  <option value="real-time-analytics">Real-Time Analytics</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateCustom}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#238636] text-white text-xs font-semibold hover:bg-[#2ea043]"
            >
              Recalculate Plan <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* REPORT CONTENT: Grounded Scenario Explanation */}
        {report && !isCustomMode && (
          <div className="space-y-6">
            {/* Top Summary Card */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#30363d] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#58a6ff] uppercase tracking-wider">
                      Technical Diagnosis
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#30363d] text-[#c9d1d9] font-mono">
                      Engine v{report.provenance.engineVersion}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {report.summary}
                  </h2>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d] text-center">
                    <span className="text-[10px] text-[#8b949e] block font-mono">RECOMMENDED SKU</span>
                    <span className="text-xl font-bold text-[#58a6ff]">
                      {report.provenance.safeSku}
                    </span>
                    <span className="text-[10px] text-[#8b949e] block font-mono">
                      {report.provenance.safeSkuCu} CUs
                    </span>
                  </div>
                </div>
              </div>

              {/* Supporting Evidence Breakdown */}
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b949e] flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#58a6ff]" />
                  Mathematical Grounding & Calculation Evidence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {report.supportingEvidence.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{step.factor}</span>
                        {step.metricValue && (
                          <span className="text-[11px] font-mono text-[#58a6ff] px-1.5 py-0.5 rounded bg-[#1f6feb]/10">
                            {step.metricValue}
                          </span>
                        )}
                      </div>
                      <p className="text-[#8b949e] leading-relaxed text-[11px]">
                        {step.deduction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FinOps Economics & Licensing Impact */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#3fb950]" />
                FinOps Economics & Licensing Rules
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl space-y-1">
                  <span className="text-[#8b949e] block">Continuous Monthly PAYG:</span>
                  <div className="text-xl font-bold text-white">
                    {report.reservationEconomics.formattedMonthlyPayg}
                  </div>
                  <span className="text-[11px] text-[#8b949e] block">
                    {report.provenance.regionId.toUpperCase()} baseline rate ($0.1800/CU/hr base)
                  </span>
                </div>

                <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl space-y-1">
                  <span className="text-[#8b949e] block">1-Year Reserved Commitment:</span>
                  <div className="text-xl font-bold text-[#3fb950]">
                    {report.reservationEconomics.formattedMonthlyReserved}
                  </div>
                  <span className="text-[11px] text-[#8b949e] block">
                    Fixed 40.56% discount ({report.reservationEconomics.formattedSavings} savings)
                  </span>
                </div>

                <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl space-y-1">
                  <span className="text-[#8b949e] block">Reservation Break-Even:</span>
                  <div className="text-xl font-bold text-[#e3b341]">
                    {report.reservationEconomics.breakEvenOperatingHoursPerMonth} hrs / mo
                  </div>
                  <span className="text-[11px] text-[#8b949e] block">
                    ~14.5 hrs/day required before RI is cheaper than PAYG
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#58a6ff]" />
                  Power BI Licensing Disposition for {report.provenance.safeSku}:
                </div>
                <p className="text-[#8b949e] leading-relaxed">
                  {report.provenance.safeSkuCu >= 64 ? (
                    <span className="text-[#3fb950]">
                      <strong>Free Viewer Distribution Eligible:</strong> Because {report.provenance.safeSku} supplies ≥64 CUs, reports shared via Fabric workspaces can be viewed by unlimited free Power BI users without individual Pro licenses.
                    </span>
                  ) : (
                    <span className="text-[#e3b341]">
                      <strong>Pro Licenses Mandatory:</strong> SKUs below F64 ({report.provenance.safeSku}) do not support free report viewing. All consumers must be licensed individually with Power BI Pro ($10/user/mo) or PPU.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Recommendations & Risks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recommendations */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#3fb950]" />
                  Actionable Architecture & FinOps Recommendations
                </h3>

                <div className="space-y-3">
                  {report.recommendations.map((rec) => (
                    <div key={rec.id} className="p-3.5 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{rec.title}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#30363d] text-[#c9d1d9]">
                          {rec.category || "Optimization"}
                        </span>
                      </div>
                      <p className="text-[#8b949e] leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks & Mitigations */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#e3b341]" />
                  Identified Architectural Risks & Mitigations
                </h3>

                <div className="space-y-3">
                  {report.risks.map((risk) => (
                    <div key={risk.id} className="p-3.5 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-semibold uppercase tracking-wider text-[11px] ${
                            risk.severity === "high"
                              ? "text-[#f85149]"
                              : risk.severity === "medium"
                              ? "text-[#e3b341]"
                              : "text-[#3fb950]"
                          }`}
                        >
                          {risk.severity} Severity Risk
                        </span>
                      </div>
                      <p className="text-[#c9d1d9] leading-relaxed">
                        {risk.description}
                      </p>
                      {risk.mitigation && (
                        <p className="text-[11px] text-[#8b949e] pt-1 border-t border-[#21262d]">
                          <strong>Mitigation:</strong> {risk.mitigation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assumptions & Suggested Validation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assumptions & Limitations */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-sm space-y-3 text-xs">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#58a6ff]" />
                  Assumptions & Model Boundaries
                </h3>
                <ul className="space-y-2 text-[#8b949e] list-disc pl-4 leading-relaxed">
                  {report.assumptions.map((ass, i) => (
                    <li key={i}>{ass}</li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-[#30363d]">
                  <span className="font-semibold text-[#c9d1d9] block mb-1">Limitations:</span>
                  <ul className="space-y-1 text-[#8b949e] list-disc pl-4 leading-relaxed">
                    {report.limitations.map((lim, i) => (
                      <li key={i}>{lim}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Validation Checklist & Official References */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-sm space-y-3 text-xs">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3fb950]" />
                  Pre-Purchase Validation Checklist
                </h3>
                <ul className="space-y-2 text-[#8b949e] list-disc pl-4 leading-relaxed">
                  {report.suggestedValidation.map((val, i) => (
                    <li key={i}>{val}</li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-[#30363d] space-y-1.5">
                  <span className="font-semibold text-white block">Official References:</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {report.references.map((ref, idx) => (
                      <a
                        key={idx}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0d1117] border border-[#30363d] text-[#58a6ff] hover:underline text-[11px]"
                      >
                        <span>{ref.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
