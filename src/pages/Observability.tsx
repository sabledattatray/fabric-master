/**
 * Fabric Master v4.0 - Capacity Observability & Telemetry Diagnostics Studio
 *
 * Provides deep operational observability into Microsoft Fabric telemetry exports:
 * - CSV & JSON telemetry ingestion
 * - 24-hour background sliding window smoothing & interactive burst tracking
 * - Throttling risk analysis & interactive delay / rejection warnings
 * - Engine consumption breakdown (Lakehouse, Warehouse, Spark, Semantic Model, Data Factory)
 * - Reality-check comparison between observed telemetry and planned capacity scenarios
 * - 100% Client-side in-memory execution with zero network exfiltration
 */

import React, { useState, useMemo, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Activity,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Upload,
  FolderDown,
  RefreshCw,
  BarChart3,
  Layers,
  Zap,
  Clock,
  FileText,
  HelpCircle,
  Info,
  X,
  ArrowRight,
  TrendingUp,
  AlertOctagon,
  ChevronDown,
  Database
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  BarChart,
  Bar,
  Cell
} from "recharts";
import {
  ObservabilitySummary,
  TelemetryRecord,
  parseTelemetryCSV,
  parseTelemetryJSON,
  getSampleMedallionLakehouse,
  getSampleThrottledWorkload,
  getSampleSparkBatchBurn,
  compareTelemetryWithScenario
} from "../lib/observability";
import { getScenarios, getActiveScenarioId } from "../lib/scenarios";

const CAPACITY_SKUS = [
  { sku: "F2", cu: 2 },
  { sku: "F4", cu: 4 },
  { sku: "F8", cu: 8 },
  { sku: "F16", cu: 16 },
  { sku: "F32", cu: 32 },
  { sku: "F64", cu: 64 },
  { sku: "F128", cu: 128 },
  { sku: "F256", cu: 256 },
  { sku: "F512", cu: 512 },
  { sku: "F1024", cu: 1024 },
  { sku: "F2048", cu: 2048 }
];

export function Observability() {
  // Initial state loads the Healthy Enterprise Medallion Lakehouse sample
  const [summary, setSummary] = useState<ObservabilitySummary>(() => getSampleMedallionLakehouse());
  const [selectedSku, setSelectedSku] = useState<string>("F64");
  const [selectedItemFilter, setSelectedItemFilter] = useState<string>("all");
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadText, setUploadText] = useState<string>("");
  const [uploadDatasetName, setUploadDatasetName] = useState<string>("Custom Telemetry Export");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showQualityModal, setShowQualityModal] = useState<boolean>(false);
  const [showSmoothingHelp, setShowSmoothingHelp] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active planning scenarios for comparison
  const scenarios = useMemo(() => getScenarios(), []);
  const activeScenarioId = useMemo(() => getActiveScenarioId(), []);
  const activeScenario = useMemo(() => {
    return scenarios.find(s => s.id === activeScenarioId) || scenarios[0] || null;
  }, [scenarios, activeScenarioId]);

  // Evaluated capacity limit in CUs
  const evaluatedCapacityLimit = useMemo(() => {
    const found = CAPACITY_SKUS.find(s => s.sku === selectedSku);
    return found ? found.cu : 64;
  }, [selectedSku]);

  // Telemetry comparison against active scenario
  const scenarioComparison = useMemo(() => {
    const plannedSku = activeScenario?.evaluation?.targetSkuRecommendation?.safeSkuName || "F64";
    return compareTelemetryWithScenario(summary, plannedSku);
  }, [summary, activeScenario]);

  // Handle switching sample datasets
  const loadSample = (type: "medallion" | "throttled" | "spark") => {
    if (type === "medallion") {
      setSummary(getSampleMedallionLakehouse());
      setSelectedSku("F64");
    } else if (type === "throttled") {
      setSummary(getSampleThrottledWorkload());
      setSelectedSku("F32");
    } else if (type === "spark") {
      setSummary(getSampleSparkBatchBurn());
      setSelectedSku("F16");
    }
  };

  // Handle direct file upload (CSV or JSON)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const fileName = file.name;
      try {
        if (fileName.toLowerCase().endsWith(".json")) {
          const res = parseTelemetryJSON(content, fileName, evaluatedCapacityLimit);
          setSummary(res.summary);
          setSelectedSku(res.summary.recommendedSku);
        } else {
          const res = parseTelemetryCSV(content, fileName, evaluatedCapacityLimit);
          setSummary(res.summary);
          setSelectedSku(res.summary.recommendedSku);
        }
        setShowUploadModal(false);
        setUploadText("");
        setUploadError(null);
      } catch (err: any) {
        setUploadError(err?.message || "Failed to parse telemetry file.");
      }
    };
    reader.readAsText(file);
  };

  // Handle manual paste upload
  const handleManualUpload = () => {
    if (!uploadText.trim()) {
      setUploadError("Please paste valid CSV or JSON content.");
      return;
    }

    try {
      const isJson = uploadText.trim().startsWith("{") || uploadText.trim().startsWith("[");
      if (isJson) {
        const res = parseTelemetryJSON(uploadText, uploadDatasetName, evaluatedCapacityLimit);
        setSummary(res.summary);
        setSelectedSku(res.summary.recommendedSku);
      } else {
        const res = parseTelemetryCSV(uploadText, uploadDatasetName, evaluatedCapacityLimit);
        setSummary(res.summary);
        setSelectedSku(res.summary.recommendedSku);
      }
      setShowUploadModal(false);
      setUploadText("");
      setUploadError(null);
    } catch (err: any) {
      setUploadError(err?.message || "Failed to parse pasted telemetry.");
    }
  };

  // Filter top consumers
  const filteredConsumers = useMemo(() => {
    if (selectedItemFilter === "all") return summary.topConsumers;
    return summary.topConsumers.filter(c => c.itemKind.toLowerCase() === selectedItemFilter.toLowerCase());
  }, [summary.topConsumers, selectedItemFilter]);

  // Export summary as JSON
  const handleExportSummary = () => {
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fabric-observability-${summary.datasetName.replace(/\s+/g, "_").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] pb-16">
      <Helmet>
        <title>Capacity Observability & Telemetry Diagnostics | Fabric Master</title>
        <meta
          name="description"
          content="Enterprise telemetry analytics and capacity metrics parser for Microsoft Fabric. Analyze hourly CU demand, 24-hour background smoothing, and throttling risk."
        />
        <link rel="canonical" href="https://fabric.dattasable.com/observability" />
      </Helmet>

      {/* Hero Header */}
      <div className="border-b border-[#30363d] bg-[#161b22]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40">
                  <Activity className="w-3.5 h-3.5" />
                  Phase 7 Telemetry Subsystem
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% In-Browser Local
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Fabric Capacity Observability & Diagnostics
              </h1>
              <p className="mt-2 text-base text-[#8b949e] max-w-3xl">
                Ingest official Microsoft Fabric Capacity Metrics App exports or test synthetic stress scenarios. Evaluate 24-hour background smoothing, pinpoint peak query spikes, and predict throttling before users are impacted.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#238636] text-white hover:bg-[#2ea043] transition-colors shadow-sm"
              >
                <Upload className="w-4 h-4" />
                Upload Telemetry
              </button>
              <button
                onClick={handleExportSummary}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] border border-[#30363d] transition-colors"
              >
                <FolderDown className="w-4 h-4" />
                Export Audit JSON
              </button>
            </div>
          </div>

          {/* Privacy & Methodology Callout */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 bg-[#1f6feb]/10 border border-[#1f6feb]/30 rounded-lg text-xs text-[#58a6ff]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-[#58a6ff]" />
              <span>
                <strong>Zero Exfiltration Guarantee:</strong> Your Fabric telemetry data is processed entirely in your browser memory. No operational logs, timestamps, or dataset names are ever transmitted to any external server or AI provider.
              </span>
            </div>
            <button
              onClick={() => setShowSmoothingHelp(true)}
              className="inline-flex items-center gap-1 font-semibold underline hover:text-white flex-shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              How Fabric Smoothing Works
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Controls & Dataset Selector */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8b949e]">Active Telemetry Dataset</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-lg font-bold text-white">{summary.datasetName}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#30363d] text-[#c9d1d9] font-mono">
                  {summary.validRecords} records ({summary.timeRange.durationHours}h span)
                </span>
                {summary.rejectedRecords > 0 && (
                  <button
                    onClick={() => setShowQualityModal(true)}
                    className="text-xs px-2 py-0.5 rounded bg-[#da3633]/20 text-[#f85149] border border-[#da3633]/40 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {summary.rejectedRecords} rejected rows
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-[#8b949e]">Test Scenarios:</span>
              <button
                onClick={() => loadSample("medallion")}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  summary.sourceType === "sample_medallion"
                    ? "bg-[#1f6feb]/20 text-[#58a6ff] border-[#1f6feb]"
                    : "bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]"
                }`}
              >
                Medallion Lakehouse (F64)
              </button>
              <button
                onClick={() => loadSample("throttled")}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  summary.sourceType === "sample_throttled"
                    ? "bg-[#da3633]/20 text-[#f85149] border-[#da3633]"
                    : "bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]"
                }`}
              >
                Morning Throttling (F32)
              </button>
              <button
                onClick={() => loadSample("spark")}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  summary.sourceType === "sample_spark"
                    ? "bg-[#d29922]/20 text-[#e3b341] border-[#d29922]"
                    : "bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]"
                }`}
              >
                Spark Batch Burn (F16)
              </button>

              <div className="h-6 w-px bg-[#30363d] hidden sm:block"></div>

              {/* Sizing Evaluator Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8b949e]">Evaluated Capacity:</span>
                <select
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-[#58a6ff]"
                >
                  {CAPACITY_SKUS.map((item) => (
                    <option key={item.sku} value={item.sku}>
                      {item.sku} ({item.cu} CUs)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Operational Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Peak Demand */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8b949e]">
              <span>Peak Instantaneous Demand</span>
              <TrendingUp className="w-4 h-4 text-[#58a6ff]" />
            </div>
            <div className="text-2xl font-bold text-white flex items-baseline gap-1">
              {summary.peakCuDemand}{" "}
              <span className="text-xs font-normal text-[#8b949e]">CUs</span>
            </div>
            <div className="text-xs text-[#8b949e] truncate">
              Recorded: {summary.peakTimestamp ? summary.peakTimestamp.split(" ")[1] : "N/A"}
            </div>
          </div>

          {/* Card 2: 24h Smoothed Peak */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8b949e]">
              <span>24h Smoothed Peak</span>
              <Cpu className="w-4 h-4 text-[#3fb950]" />
            </div>
            <div className="text-2xl font-bold text-white flex items-baseline gap-1">
              {scenarioComparison.observedSmoothedPeakCu}{" "}
              <span className="text-xs font-normal text-[#8b949e]">CUs</span>
            </div>
            <div className="text-xs text-[#8b949e]">
              Amortized across background window
            </div>
          </div>

          {/* Card 3: Throttling Incidents */}
          <div
            className={`border rounded-xl p-4 space-y-1 ${
              summary.throttlingEventsCount > 0
                ? "bg-[#da3633]/10 border-[#da3633]/40"
                : "bg-[#161b22] border-[#30363d]"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-[#8b949e]">
              <span>Throttling Events</span>
              {summary.throttlingEventsCount > 0 ? (
                <AlertOctagon className="w-4 h-4 text-[#f85149]" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#3fb950]" />
              )}
            </div>
            <div
              className={`text-2xl font-bold flex items-baseline gap-1 ${
                summary.throttlingEventsCount > 0 ? "text-[#f85149]" : "text-white"
              }`}
            >
              {summary.throttlingEventsCount}
              <span className="text-xs font-normal text-[#8b949e]">incidents</span>
            </div>
            <div className="text-xs text-[#8b949e]">
              Risk Index: {summary.throttlingRiskScore} / 100
            </div>
          </div>

          {/* Card 4: Operation Type Ratio */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8b949e]">
              <span>Interactive vs Background</span>
              <Layers className="w-4 h-4 text-[#d29922]" />
            </div>
            <div className="text-2xl font-bold text-white flex items-baseline gap-1">
              {Math.round(summary.interactiveRatio * 100)}% / {Math.round(summary.backgroundRatio * 100)}%
            </div>
            <div className="text-xs text-[#8b949e]">
              Interactive: 5m | Batch: 24h smooth
            </div>
          </div>

          {/* Card 5: Safe Recommended SKU */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8b949e]">
              <span>Recommended Safe Tier</span>
              <Zap className="w-4 h-4 text-[#a371f7]" />
            </div>
            <div className="text-2xl font-bold text-[#a371f7] flex items-baseline gap-1">
              {summary.recommendedSku}{" "}
              <span className="text-xs font-normal text-[#8b949e]">({summary.recommendedSkuCu} CUs)</span>
            </div>
            <div className="text-xs text-[#8b949e]">
              Includes +20% operating headroom
            </div>
          </div>
        </div>

        {/* Reality Check: Telemetry vs Planned Active Scenario */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363d] pb-4 mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#58a6ff]">
                Reality Check: Active Scenario Alignment
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Observed Telemetry vs Planned Scenario ({activeScenario?.name || "Default Lakehouse"})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  scenarioComparison.fitAssessment === "Optimal"
                    ? "bg-[#238636]/20 text-[#3fb950] border-[#238636]"
                    : scenarioComparison.fitAssessment === "Critical Throttling Risk"
                    ? "bg-[#da3633]/20 text-[#f85149] border-[#da3633]"
                    : "bg-[#d29922]/20 text-[#e3b341] border-[#d29922]"
                }`}
              >
                {scenarioComparison.fitAssessment}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-[#8b949e]">Planned Capacity Model:</span>
              <div className="font-semibold text-white">
                {scenarioComparison.scenarioSku} ({scenarioComparison.scenarioSkuCu} CUs)
              </div>
              <p className="text-xs text-[#8b949e]">
                Derived from active scenario inputs in Workspace.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-[#8b949e]">Observed Smoothed Demand:</span>
              <div className="font-semibold text-white">
                {scenarioComparison.observedSmoothedPeakCu} CUs (Peak: {scenarioComparison.observedPeakCu} CUs)
              </div>
              <p className="text-xs text-[#8b949e]">
                Utilization: {scenarioComparison.utilizationPercent}% | Headroom: {scenarioComparison.headroomPercent}%
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-[#8b949e]">Engineering Guidance:</span>
              <p className="text-xs text-[#c9d1d9] leading-relaxed">
                {scenarioComparison.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Time-Series Chart: Hourly CU Demand vs Capacity Threshold */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#58a6ff]" />
                Hourly CU Consumption & 24-Hour Smoothing Timeline
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">
                Visualizes raw interactive and background CU demand along with Microsoft Fabric's 24-hour background smoothing curve against the {selectedSku} capacity threshold.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#3b82f6]"></div>
                <span>Background CU</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#10b981]"></div>
                <span>Interactive CU</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#f59e0b]"></div>
                <span>Smoothed Demand</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#f85149] border-t border-dashed"></div>
                <span>Limit ({evaluatedCapacityLimit} CU)</span>
              </div>
            </div>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.hourlyTimeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                <XAxis
                  dataKey="hour"
                  stroke="#8b949e"
                  fontSize={10}
                  tickFormatter={(val) => {
                    const parts = val.split(" ");
                    return parts.length > 1 ? parts[1].replace(":00 UTC", "h") : val;
                  }}
                />
                <YAxis stroke="#8b949e" fontSize={11} domain={[0, "auto"]} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg shadow-xl text-xs space-y-1.5">
                          <div className="font-bold text-white border-b border-[#30363d] pb-1">{label}</div>
                          <div className="text-[#3b82f6]">Background: {data.backgroundCu} CU</div>
                          <div className="text-[#10b981]">Interactive: {data.interactiveCu} CU</div>
                          <div className="text-white font-semibold">Total Raw: {data.totalCu} CU</div>
                          <div className="text-[#f59e0b] font-semibold">Smoothed Demand: {data.smoothedCu} CU</div>
                          <div className="text-[#8b949e]">Capacity Limit: {data.capacityLimit} CU</div>
                          <div className="text-[#8b949e]">Borrow Balance: {data.cumulativeBorrowPercent}%</div>
                          {data.throttled && (
                            <div className="text-[#f85149] font-bold flex items-center gap-1 pt-1">
                              <AlertTriangle className="w-3 h-3" />
                              Throttling / Delay Active
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="backgroundCu"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                  name="Background CU"
                />
                <Area
                  type="monotone"
                  dataKey="interactiveCu"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                  name="Interactive CU"
                />
                <Area
                  type="monotone"
                  dataKey="smoothedCu"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="none"
                  name="Smoothed Demand"
                />
                <ReferenceLine
                  y={evaluatedCapacityLimit}
                  stroke="#f85149"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `Limit: ${evaluatedCapacityLimit} CU`,
                    fill: "#f85149",
                    fontSize: 10,
                    position: "top"
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown by Workload Engine & Throttling Diagnostics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Engine Consumption Breakdown */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 lg:col-span-1 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#58a6ff]" />
              Workload Engine Distribution
            </h2>
            <p className="text-xs text-[#8b949e]">
              Proportion of total CU-hours consumed across Microsoft Fabric engines during the observed timeframe.
            </p>

            <div className="space-y-3 pt-2">
              {summary.engineBreakdown.map((eng) => (
                <div key={eng.kind} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{eng.kind}</span>
                    <span className="text-[#8b949e]">
                      {eng.cuHours} CU-h ({eng.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#21262d] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(2, eng.percentage)}%`,
                        backgroundColor: eng.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Microsoft Fabric Smoothing & Throttling Mechanics */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#e3b341]" />
                Smoothing & Throttling Mechanics
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-[#30363d] text-[#8b949e]">
                Microsoft Fabric Specification
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-1.5">
                <span className="font-semibold text-[#58a6ff]">Interactive Operations (5-Min Smoothing)</span>
                <p className="text-[#8b949e] leading-relaxed">
                  Power BI report renders, DAX queries, and lakehouse previews are smoothed over a 5-minute sliding window. Sudden concurrent spikes can immediately trigger <strong>Interactive Delays</strong> (UI pauses) if borrow thresholds are exceeded.
                </p>
              </div>

              <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-1.5">
                <span className="font-semibold text-[#3fb950]">Background Operations (24-Hour Smoothing)</span>
                <p className="text-[#8b949e] leading-relaxed">
                  Spark notebooks, Data Factory pipelines, and Lakehouse compaction are smoothed over a 24-hour sliding window. A heavy batch job borrows capacity against future hours without immediate throttling, provided it clears within 24 hours.
                </p>
              </div>

              <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-1.5">
                <span className="font-semibold text-[#e3b341]">Interactive Delay Threshold (10 Min)</span>
                <p className="text-[#8b949e] leading-relaxed">
                  When continuous consumption exceeds capacity limit for 10 consecutive minutes, subsequent user queries experience artificial delays to protect compute stability.
                </p>
              </div>

              <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-1.5">
                <span className="font-semibold text-[#f85149]">Cumulative Rejection Threshold (60 Min)</span>
                <p className="text-[#8b949e] leading-relaxed">
                  If accumulated borrow debt reaches the equivalent of 60 minutes of full capacity starvation, new interactive operations are rejected with HTTP 429 throttling errors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Consuming Artifacts Table */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#30363d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#58a6ff]" />
                Top Capacity-Consuming Artifacts
              </h2>
              <p className="text-xs text-[#8b949e] mt-0.5">
                Identify which workspaces, notebooks, models, or pipelines are driving your monthly compute costs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8b949e]">Filter by Engine:</span>
              <select
                value={selectedItemFilter}
                onChange={(e) => setSelectedItemFilter(e.target.value)}
                className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#58a6ff]"
              >
                <option value="all">All Engines</option>
                <option value="Lakehouse">Lakehouse</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Notebook">Notebook</option>
                <option value="SparkJob">Spark</option>
                <option value="SemanticModel">Semantic Model</option>
                <option value="Pipeline">Pipeline</option>
                <option value="Eventhouse">Eventhouse</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#30363d] bg-[#21262d]/50 text-[#8b949e]">
                  <th className="py-3 px-4 font-semibold">Artifact / Item Name</th>
                  <th className="py-3 px-4 font-semibold">Engine / Kind</th>
                  <th className="py-3 px-4 font-semibold">Total CU-Hours</th>
                  <th className="py-3 px-4 font-semibold">% of Capacity</th>
                  <th className="py-3 px-4 font-semibold">Total Operations</th>
                  <th className="py-3 px-4 font-semibold">Peak Burst CU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {filteredConsumers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#8b949e]">
                      No artifacts found matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredConsumers.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#21262d]/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#58a6ff]" />
                        {item.itemName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#30363d] text-[#c9d1d9] font-mono text-[11px]">
                          {item.itemKind}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">{item.cuHours} CU-h</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-right text-[#c9d1d9]">{item.percentage}%</span>
                          <div className="w-20 h-1.5 rounded-full bg-[#21262d] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#58a6ff]"
                              style={{ width: `${Math.min(100, item.percentage * 2)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#8b949e]">{item.operationCount}</td>
                      <td className="py-3 px-4 font-mono text-white">{item.maxBurstCu} CU</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation Link back to Workspace */}
        <div className="flex items-center justify-between p-4 bg-[#161b22] border border-[#30363d] rounded-xl text-xs">
          <span className="text-[#8b949e]">
            Want to correlate this telemetry with your multi-region FinOps budget and architecture topology?
          </span>
          <Link
            to="/workspace"
            className="inline-flex items-center gap-1 font-semibold text-[#58a6ff] hover:underline"
          >
            Open Unified Engineering Workspace
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Upload Modal (CSV or JSON) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#238636]" />
                Import Capacity Telemetry Export
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#8b949e] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#8b949e]">
              Upload or paste exported data from the Microsoft Fabric Capacity Metrics App (CSV format or JSON array). Data is parsed locally in-memory.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">Dataset Label</label>
                <input
                  type="text"
                  value={uploadDatasetName}
                  onChange={(e) => setUploadDatasetName(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                  placeholder="e.g. Production Capacity October Export"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
                  Upload CSV or JSON file
                </label>
                <input
                  type="file"
                  accept=".csv,.json,text/csv,application/json"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-[#8b949e] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#21262d] file:text-white hover:file:bg-[#30363d] file:cursor-pointer"
                />
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#30363d]"></div>
                <span className="flex-shrink mx-4 text-xs text-[#8b949e]">OR PASTE RAW DATA</span>
                <div className="flex-grow border-t border-[#30363d]"></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
                  Paste Raw CSV or JSON
                </label>
                <textarea
                  rows={6}
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  placeholder="Timestamp,Item Name,Item Kind,Operation Name,Operation Type,Total CU (s),Status&#10;2026-10-26T09:00:00Z,Finance Model,SemanticModel,DAX Query,Interactive,3600,Success"
                  className="w-full font-mono bg-[#0d1117] border border-[#30363d] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                ></textarea>
              </div>

              {uploadError && (
                <div className="p-3 rounded-lg bg-[#da3633]/20 border border-[#da3633]/40 text-xs text-[#f85149] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#30363d]">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#c9d1d9] hover:bg-[#21262d]"
              >
                Cancel
              </button>
              <button
                onClick={handleManualUpload}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#238636] text-white hover:bg-[#2ea043]"
              >
                Parse & Analyze
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quality Issues Modal */}
      {showQualityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#f85149]" />
                Data Quality & Rejected Rows Audit
              </h2>
              <button
                onClick={() => setShowQualityModal(false)}
                className="text-[#8b949e] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#8b949e]">
              The following rows were omitted during ingestion due to missing mandatory columns or invalid timestamp formats:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
              {summary.qualityIssues.map((issue, idx) => (
                <div key={idx} className="p-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg">
                  <div className="flex items-center justify-between font-semibold text-[#f85149]">
                    <span>Row {issue.row}</span>
                    <span className="text-[#8b949e]">{issue.reason}</span>
                  </div>
                  <pre className="mt-1 text-[11px] text-[#8b949e] overflow-x-auto font-mono">
                    {issue.rawSnippet}
                  </pre>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#30363d]">
              <button
                onClick={() => setShowQualityModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#21262d] text-white hover:bg-[#30363d]"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How Smoothing Works Modal */}
      {showSmoothingHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#58a6ff]" />
                Understanding Microsoft Fabric Smoothing
              </h2>
              <button
                onClick={() => setShowSmoothingHelp(false)}
                className="text-[#8b949e] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#c9d1d9] space-y-3 leading-relaxed">
              <p>
                Unlike traditional cloud VMs that throttle compute the microsecond usage hits 100%, Microsoft Fabric employs an asynchronous <strong>Smoothing Algorithm</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#8b949e]">
                <li>
                  <strong className="text-white">Background Operations (24h window):</strong> Spark jobs, data pipelines, and semantic model refreshes are smoothed over 24 hours. A job using 240 CU-seconds is charged at 10 CU-seconds per hour across the next 24 hours.
                </li>
                <li>
                  <strong className="text-white">Interactive Operations (5m window):</strong> Direct Lake queries, paginated reports, and UI interactions are smoothed over 5 minutes. High concurrency can cause instantaneous spikes.
                </li>
                <li>
                  <strong className="text-white">Carryforward Borrowing:</strong> Capacities can borrow compute power into future hours up to 24x their hourly CU quota. If usage stays elevated and debt exceeds 100%, Fabric triggers <strong>Interactive Rejections</strong>.
                </li>
              </ul>
              <div className="p-3 bg-[#1f6feb]/10 border border-[#1f6feb]/30 rounded-lg text-[#58a6ff]">
                <strong>Best Practice:</strong> Always evaluate the <strong>Smoothed Demand</strong> rather than momentary raw peaks when sizing your production F-SKU.
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#30363d]">
              <button
                onClick={() => setShowSmoothingHelp(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#21262d] text-white hover:bg-[#30363d]"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
