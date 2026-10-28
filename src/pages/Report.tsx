/**
 * Fabric Master v4.0 - Enterprise Decision Report Viewer
 *
 * Implements PRD Section 22:
 * Interactive multi-page report viewer with live print-to-PDF,
 * self-contained HTML download, and tabular CSV export.
 */

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FileText,
  Printer,
  FolderDown,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Cpu,
  Layers,
  ExternalLink,
  BookOpen
} from "lucide-react";
import {
  getScenarios,
  getActiveScenarioId,
  setActiveScenarioId
} from "../lib/scenarios";
import { Scenario } from "../types";
import {
  generatePrintableHTMLReport,
  downloadHTMLReport,
  downloadCSVReport,
  REPORT_DISCLAIMER_TEXT
} from "../lib/reports";
import { calculateCapacity } from "../lib/calculator";
import {
  calculateReservationEconomics,
  SUPPORTED_CURRENCIES,
  REGIONAL_PRICING_CATALOG
} from "../lib/pricing";

export function Report() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const list = getScenarios();
    setScenarios(list);
    const paramId = searchParams.get("scenario");
    const activeId = getActiveScenarioId();

    if (paramId && list.some(s => s.id === paramId)) {
      setSelectedId(paramId);
    } else if (activeId && list.some(s => s.id === activeId)) {
      setSelectedId(activeId);
    } else if (list.length > 0) {
      setSelectedId(list[0].id);
    }
  }, [searchParams]);

  const activeScenario = useMemo(() => {
    return scenarios.find(s => s.id === selectedId) || scenarios[0] || null;
  }, [scenarios, selectedId]);

  const handleSelectScenario = (id: string) => {
    setSelectedId(id);
    setActiveScenarioId(id);
    setSearchParams({ scenario: id });
  };

  const handlePrint = () => {
    if (!activeScenario) return;
    const html = generatePrintableHTMLReport(activeScenario);
    const win = window.open("", "_blank");
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
      }, 300);
    }
  };

  const evalResult = useMemo(() => {
    if (!activeScenario) return null;
    return activeScenario.evaluation || calculateCapacity(activeScenario.inputs);
  }, [activeScenario]);

  const economics = useMemo(() => {
    if (!activeScenario || !evalResult) return null;
    const safeSkuCu = evalResult.targetSkuRecommendation.safeSkuCu;
    const reg = activeScenario.region || "eastus";
    const curr = activeScenario.currency || "USD";
    return calculateReservationEconomics(safeSkuCu, reg, curr, 730);
  }, [activeScenario, evalResult]);

  if (!activeScenario || !evalResult || !economics) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white">
        <Helmet>
          <title>Engineering Decision Report | Fabric Master</title>
        </Helmet>
        Loading Report...
      </div>
    );
  }

  const safeSku = evalResult.targetSkuRecommendation.safeSkuName;
  const safeSkuCu = evalResult.targetSkuRecommendation.safeSkuCu;
  const baselineCu = evalResult.calculatedCuBaseline;
  const currDef = SUPPORTED_CURRENCIES[activeScenario.currency || "USD"] || SUPPORTED_CURRENCIES.USD;
  const regionInfo = REGIONAL_PRICING_CATALOG[activeScenario.region || "eastus"] || REGIONAL_PRICING_CATALOG.eastus;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] pb-16">
      <Helmet>
        <title>{activeScenario.name} - Decision Report | Fabric Master</title>
        <meta
          name="description"
          content="Enterprise engineering decision report for Microsoft Fabric. Capacity sizing, FinOps reservations, and multi-tier architecture specification."
        />
        <link rel="canonical" href={`https://fabric.dattasable.com/report?scenario=${activeScenario.id}`} />
      </Helmet>

      {/* Control Top Bar */}
      <div className="border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/workspace"
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#8b949e] hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Workspace
            </Link>
            <div className="h-4 w-px bg-[#30363d]"></div>
            <select
              aria-label="Report scenario"
              value={selectedId}
              onChange={(e) => handleSelectScenario(e.target.value)}
              className="min-w-0 max-w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs font-semibold text-white focus:outline-none focus:border-[#58a6ff]"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.region.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>
            <button
              onClick={() => downloadHTMLReport(activeScenario)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] border border-[#30363d] transition"
            >
              <FolderDown className="w-3.5 h-3.5" />
              Download HTML
            </button>
            <button
              onClick={() => downloadCSVReport(activeScenario)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] border border-[#30363d] transition"
            >
              <FileText className="w-3.5 h-3.5" />
              Download CSV
            </button>
          </div>
        </div>
      </div>

      {/* Main Report Container - Paper Aesthetic */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Document Header Page */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
            <div>
              <div className="text-xl font-extrabold text-white tracking-tight">FABRIC MASTER</div>
              <div className="text-xs uppercase tracking-wider text-[#8b949e] font-semibold">
                Enterprise Capacity & FinOps Workbench
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Decision Report
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#58a6ff]">
              Capacity Sizing & Architecture Report
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              {activeScenario.name}
            </h1>
            <p className="text-sm text-[#8b949e]">
              {activeScenario.description || "Comprehensive workload capacity sizing, Azure regional pricing model, reservation breakeven analysis, and multi-tier Fabric architecture specification."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#0d1117] rounded-xl border border-[#30363d] text-xs">
            <div>
              <span className="text-[#8b949e] block">Azure Region</span>
              <span className="font-semibold text-white">{regionInfo.name}</span>
            </div>
            <div>
              <span className="text-[#8b949e] block">Currency</span>
              <span className="font-semibold text-white">{activeScenario.currency || "USD"}</span>
            </div>
            <div>
              <span className="text-[#8b949e] block">Prepared Date</span>
              <span className="font-semibold text-white">{new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-[#8b949e] block">Engine Version</span>
              <span className="font-mono text-[#58a6ff]">v4.0.0</span>
            </div>
          </div>
        </div>

        {/* Executive Summary & KPIs */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 shadow-md space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-[#30363d] pb-3">
            1. Executive Summary & Recommended Capacity
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl space-y-1">
              <span className="text-[11px] text-[#8b949e] font-semibold uppercase">Target Safe Tier</span>
              <div className="text-2xl font-bold text-[#58a6ff]">{safeSku}</div>
              <span className="text-[11px] text-[#8b949e]">{safeSkuCu} Capacity Units</span>
            </div>
            <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl space-y-1">
              <span className="text-[11px] text-[#8b949e] font-semibold uppercase">Continuous PAYG</span>
              <div className="text-2xl font-bold text-white">{economics.formattedMonthlyPayg}</div>
              <span className="text-[11px] text-[#8b949e]">730 hours / month</span>
            </div>
            <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl space-y-1">
              <span className="text-[11px] text-[#8b949e] font-semibold uppercase">1-Yr Reserved</span>
              <div className="text-2xl font-bold text-[#3fb950]">{economics.formattedMonthlyReserved}</div>
              <span className="text-[11px] text-[#8b949e]">40.56% discount</span>
            </div>
            <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl space-y-1">
              <span className="text-[11px] text-[#8b949e] font-semibold uppercase">Break-Even</span>
              <div className="text-2xl font-bold text-[#e3b341]">
                {economics.breakEvenOperatingHoursPerMonth}h
              </div>
              <span className="text-[11px] text-[#8b949e]">Monthly operating threshold</span>
            </div>
          </div>

          <div className="text-xs text-[#c9d1d9] space-y-2 leading-relaxed">
            <p>
              • <strong>Capacity Recommendation:</strong> The composite mathematical demand across all engines totals <strong>{baselineCu} CUs</strong>. Adding the recommended <strong>+50% enterprise safety headroom</strong> establishes <strong>{safeSku} ({safeSkuCu} CUs)</strong> as the safe production sizing target.
            </p>
            <p>
              • <strong>Power BI Licensing Strategy:</strong> {safeSkuCu >= 64 ? (
                <span className="text-[#3fb950]">Because {safeSku} supplies ≥64 CUs, reports shared via Fabric workspaces can be consumed by unlimited free Power BI users without individual Pro licenses.</span>
              ) : (
                <span className="text-[#e3b341]">Because {safeSku} supplies &lt;64 CUs, free report viewing is not supported. All consumers must be licensed individually with Power BI Pro ($10/user/mo) or PPU.</span>
              )}
            </p>
          </div>
        </div>

        {/* Workload Sizing Breakdown Table */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 shadow-md space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-[#30363d] pb-3">
            2. Detailed Workload Demand & Sizing Analysis
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#30363d] text-[#8b949e] bg-[#0d1117]">
                  <th className="py-2.5 px-3">Engine Layer</th>
                  <th className="py-2.5 px-3">Configured Workload Inputs</th>
                  <th className="py-2.5 px-3">Derived Demand</th>
                  <th className="py-2.5 px-3">Smoothing Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-white">Data Factory</td>
                  <td className="py-2.5 px-3 text-[#8b949e]">
                    {activeScenario.inputs.dataFactoryInput.monthlyPipelines.toLocaleString()} pipelines, {activeScenario.inputs.dataFactoryInput.dataVolumeGb} GB
                  </td>
                  <td className="py-2.5 px-3 font-mono text-white">
                    ~{Math.round((activeScenario.inputs.dataFactoryInput.monthlyPipelines * 0.05 + activeScenario.inputs.dataFactoryInput.dataVolumeGb * 0.01) * 10) / 10} CUs
                  </td>
                  <td className="py-2.5 px-3 text-[#8b949e]">24-Hour background sliding window</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-white">Apache Spark</td>
                  <td className="py-2.5 px-3 text-[#8b949e]">
                    {activeScenario.inputs.sparkComputeInput.totalNodes} nodes × {activeScenario.inputs.sparkComputeInput.vCoresPerNode} vCores ({activeScenario.inputs.sparkComputeInput.dailyRuntimeHours}h/day)
                  </td>
                  <td className="py-2.5 px-3 font-mono text-white">
                    {activeScenario.inputs.sparkComputeInput.totalNodes * activeScenario.inputs.sparkComputeInput.vCoresPerNode * 2} CUs
                  </td>
                  <td className="py-2.5 px-3 text-[#8b949e]">2:1 vCore-to-CU cloud equivalence</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-white">Power BI</td>
                  <td className="py-2.5 px-3 text-[#8b949e]">
                    {activeScenario.inputs.powerBiInput.peakConcurrentUsers} concurrent users (Scale {activeScenario.inputs.powerBiInput.queryComplexityScale}/5)
                  </td>
                  <td className="py-2.5 px-3 font-mono text-white">
                    {Math.round(activeScenario.inputs.powerBiInput.peakConcurrentUsers * 1.0 * (1 + (activeScenario.inputs.powerBiInput.queryComplexityScale - 1) * 0.25))} CUs
                  </td>
                  <td className="py-2.5 px-3 text-[#8b949e]">5-Minute interactive smoothing window</td>
                </tr>
                <tr className="bg-[#0d1117] font-semibold">
                  <td colSpan={2} className="py-2.5 px-3 text-[#c9d1d9]">Composite Baseline Demand</td>
                  <td className="py-2.5 px-3 font-mono text-white">{baselineCu} CUs</td>
                  <td className="py-2.5 px-3 text-[#8b949e]">Raw mathematical sum</td>
                </tr>
                <tr className="bg-blue-950/30 text-blue-300 font-bold">
                  <td colSpan={2} className="py-2.5 px-3">Target Safe SKU (+50% Headroom)</td>
                  <td className="py-2.5 px-3 font-mono">{safeSkuCu} CUs ({safeSku})</td>
                  <td className="py-2.5 px-3">Buffers burst concurrency</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer & Provenance Box */}
        <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-[#58a6ff]" />
            Independent Tool Legal Disclaimer
          </div>
          <p className="text-[#8b949e] leading-relaxed">
            {REPORT_DISCLAIMER_TEXT}
          </p>
        </div>
      </div>
    </div>
  );
}
