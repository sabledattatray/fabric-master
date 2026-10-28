import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useMemo } from "react";
import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import {
  Layers,
  Cpu,
  Coins,
  Sliders,
  BarChart3,
  Copy,
  Plus,
  Trash2,
  FolderDown,
  Upload,
  RotateCcw,
  ShieldCheck,
  Info,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Database,
  Users,
  Activity,
  Zap,
  ChevronRight,
  ExternalLink,
  X,
  AlertTriangle,
  HelpCircle,
  Clock,
  Bot,
  FileText,
  Printer,
} from "lucide-react";
import { Scenario, WorkloadCalculationInput } from "../types";
import {
  getScenarios,
  getScenario,
  saveScenario,
  createScenario,
  duplicateScenario,
  deleteScenario,
  getActiveScenarioId,
  setActiveScenarioId,
  exportScenarioAsJSON,
  exportAllScenariosAsJSON,
  importScenarioFromJSON,
  resetScenarioToDefault,
} from "../lib/scenarios";
import { calculateCapacity } from "../lib/calculator";
import {
  REGIONAL_PRICING_CATALOG,
  SUPPORTED_CURRENCIES,
  PRICING_PROVENANCE_METADATA,
  OPERATING_HOURS_PROFILES,
  OperatingProfileKey,
  calculateReservationEconomics,
  UNSUPPORTED_REGIONS_CATALOG,
  HEADROOM_OPTIONS,
  calculateConfiguredHeadroom,
  getFinOpsResultMetadata,
  getRegionalComparison,
  calculateSensitivityAnalysis,
  getStepByStepExplanation,
} from "../lib/pricing";
import {
  ObservabilitySummary,
  getSampleMedallionLakehouse,
  getSampleThrottledWorkload,
  getSampleSparkBatchBurn,
  compareTelemetryWithScenario,
} from "../lib/observability";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
type TabId =
  | "overview"
  | "inputs"
  | "capacity"
  | "finops"
  | "comparison"
  | "architecture"
  | "observability";
export function Workspace() {
  const tx = useTranslation().t;
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success",
  );
  // Phase 5 FinOps & Sensitivity State
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [selectedRegion, setSelectedRegion] = useState<string>("eastus");
  const [selectedOperatingProfile, setSelectedOperatingProfile] =
    useState<OperatingProfileKey>("continuous");
  const [operatingHours, setOperatingHours] = useState<number>(730);
  const [selectedHeadroomPercent, setSelectedHeadroomPercent] =
    useState<number>(50);
  const [showUnsupportedModal, setShowUnsupportedModal] =
    useState<boolean>(false);
  const [sensitivityVariant, setSensitivityVariant] = useState<
    "conservative" | "baseline" | "peak"
  >("baseline");
  const [showMathDetails, setShowMathDetails] = useState<boolean>(false);
  // Phase 7 Telemetry & Observability State
  const [telemetryDataset, setTelemetryDataset] = useState<
    "medallion" | "throttled" | "spark"
  >("medallion");
  const telemetrySummary = useMemo(() => {
    if (telemetryDataset === "throttled") return getSampleThrottledWorkload();
    if (telemetryDataset === "spark") return getSampleSparkBatchBurn();
    return getSampleMedallionLakehouse();
  }, [telemetryDataset]);
  // Modal States
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newScenarioName, setNewScenarioName] = useState<string>("");
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>("");
  const [importError, setImportError] = useState<string | null>(null);
  // Load scenarios on mount
  useEffect(() => {
    const list = getScenarios();
    setScenarios(list);
    const savedActiveId = getActiveScenarioId();
    if (list.some((s) => s.id === savedActiveId)) {
      setActiveId(savedActiveId);
    } else if (list.length > 0) {
      setActiveId(list[0].id);
      setActiveScenarioId(list[0].id);
    }
  }, []);
  const showToast = (
    msg: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };
  const activeScenario = useMemo(() => {
    return scenarios.find((s) => s.id === activeId) || scenarios[0] || null;
  }, [scenarios, activeId]);
  const evalData = activeScenario?.evaluation;
  // Sync regional and currency defaults from activeScenario
  useEffect(() => {
    if (
      activeScenario?.region &&
      REGIONAL_PRICING_CATALOG[activeScenario.region]
    ) {
      setSelectedRegion(activeScenario.region);
    }
    if (
      activeScenario?.currency &&
      SUPPORTED_CURRENCIES[activeScenario.currency]
    ) {
      setSelectedCurrency(activeScenario.currency);
    }
  }, [activeScenario]);
  const handleOperatingProfileChange = (key: OperatingProfileKey) => {
    setSelectedOperatingProfile(key);
    if (key !== "custom") {
      setOperatingHours(OPERATING_HOURS_PROFILES[key].hoursPerMonth);
    }
  };
  const reservationEconomics = useMemo(() => {
    if (!evalData) return null;
    return calculateReservationEconomics(
      evalData.targetSkuRecommendation.safeSkuCu,
      selectedRegion,
      selectedCurrency,
      operatingHours,
    );
  }, [evalData, selectedRegion, selectedCurrency, operatingHours]);
  const headroomSizing = useMemo(() => {
    if (!evalData) return null;
    return calculateConfiguredHeadroom(
      evalData.calculatedCuBaseline,
      selectedHeadroomPercent,
    );
  }, [evalData, selectedHeadroomPercent]);
  const provenanceMeta = useMemo(() => {
    if (!evalData) return null;
    return getFinOpsResultMetadata(
      selectedRegion,
      selectedCurrency,
      evalData.targetSkuRecommendation.safeSkuName,
      evalData.targetSkuRecommendation.safeSkuCu,
      operatingHours,
    );
  }, [evalData, selectedRegion, selectedCurrency, operatingHours]);
  const sensitivityData = useMemo(() => {
    if (!activeScenario) return null;
    return calculateSensitivityAnalysis(activeScenario.inputs);
  }, [activeScenario]);
  const mathExplanation = useMemo(() => {
    if (!activeScenario) return null;
    return getStepByStepExplanation(activeScenario.inputs);
  }, [activeScenario]);
  const regionalComparisonList = useMemo(() => {
    if (!evalData) return [];
    return getRegionalComparison(
      evalData.targetSkuRecommendation.safeSkuCu,
      selectedCurrency,
      operatingHours,
    );
  }, [evalData, selectedCurrency, operatingHours]);
  const currencyObj =
    SUPPORTED_CURRENCIES[selectedCurrency] || SUPPORTED_CURRENCIES.USD;
  const currentRegionInfo =
    REGIONAL_PRICING_CATALOG[selectedRegion] || REGIONAL_PRICING_CATALOG.eastus;
  const handleSelectScenario = (id: string) => {
    setActiveId(id);
    setActiveScenarioId(id);
  };
  const handleInputChange = <K extends keyof WorkloadCalculationInput>(
    section: K,
    subKey: string,
    value: number | string,
  ) => {
    if (!activeScenario) return;
    const currentInputs = { ...activeScenario.inputs };
    if (
      section === "dataFactoryInput" ||
      section === "sparkComputeInput" ||
      section === "powerBiInput"
    ) {
      const currentSection = { ...(currentInputs[section] as any) };
      currentSection[subKey] = Number(value);
      (currentInputs as any)[section] = currentSection;
    } else {
      (currentInputs as any)[section] = value;
    }
    const updatedEvaluation = calculateCapacity(currentInputs);
    const updatedScenario: Scenario = {
      ...activeScenario,
      inputs: currentInputs,
      evaluation: updatedEvaluation,
      updatedAt: new Date().toISOString(),
    };
    saveScenario(updatedScenario);
    setScenarios((prev) =>
      prev.map((s) => (s.id === updatedScenario.id ? updatedScenario : s)),
    );
  };
  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScenarioName.trim()) return;
    const created = createScenario(newScenarioName.trim());
    setScenarios(getScenarios());
    setActiveId(created.id);
    setShowNewModal(false);
    setNewScenarioName("");
    showToast(`Created scenario: "${created.name}"`);
  };
  const handleDuplicate = () => {
    if (!activeScenario) return;
    const duplicated = duplicateScenario(activeScenario.id);
    if (duplicated) {
      setScenarios(getScenarios());
      setActiveId(duplicated.id);
      showToast(`Duplicated as "${duplicated.name}"`);
    }
  };
  const handleDelete = () => {
    if (!activeScenario) return;
    if (scenarios.length <= 1) {
      showToast("Cannot delete the only remaining scenario.", "error");
      return;
    }
    const name = activeScenario.name;
    const success = deleteScenario(activeScenario.id);
    if (success) {
      const refreshed = getScenarios();
      setScenarios(refreshed);
      setActiveId(getActiveScenarioId());
      showToast(`Deleted scenario "${name}"`, "info");
    }
  };
  const handleReset = () => {
    if (!activeScenario) return;
    const reset = resetScenarioToDefault(activeScenario.id);
    if (reset) {
      setScenarios(getScenarios());
      showToast(`Reset "${reset.name}" to standard baseline`, "info");
    }
  };
  const handleExportActive = () => {
    if (!activeScenario) return;
    exportScenarioAsJSON(activeScenario);
    showToast(`Exported "${activeScenario.name}" as JSON`);
  };
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) {
      setImportError("Please provide scenario JSON to import.");
      return;
    }
    const res = importScenarioFromJSON(importJsonText);
    if (!res.success) {
      setImportError(res.error || "Failed to validate scenario schema.");
    } else {
      setScenarios(getScenarios());
      if (res.scenario) {
        setActiveId(res.scenario.id);
      }
      setShowImportModal(false);
      setImportJsonText("");
      setImportError(null);
      showToast("Scenario imported successfully with 100% schema validation!");
    }
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        setImportJsonText(content);
        setImportError(null);
      }
    };
    reader.readAsText(file);
  };
  return (
    <div className="workspace-page min-h-screen bg-[#080F1D] text-[#F0F6FC]">
      <SEO
        title="Engineering Workspace"
        description="Plan capacity, understand costs, and design your Microsoft Fabric architecture in one independent engineering workspace."
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg border shadow-xl flex items-center space-x-3 transition-all duration-300 ${
            toastType === "success"
              ? "bg-[#0d1f38] border-cyan-500/50 text-cyan-200"
              : toastType === "error"
                ? "bg-[#331118] border-red-500/50 text-red-200"
                : "bg-[#162032] border-blue-500/50 text-blue-200"
          }`}
        >
          {toastType === "success" && (
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          )}
          {toastType === "error" && (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          {toastType === "info" && (
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace Header Bar */}
      <header className="border-b border-[#21262d] bg-[#0b1329] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Project & Scenario Breadcrumb */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {tx("Project Estate")}
                </span>
                <span className="text-slate-600">/</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
                  v4.0
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                <span>{tx("Unified Engineering Workspace")}</span>
              </h1>
            </div>
          </div>

          {/* Scenario Selector & Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Scenario Dropdown */}
            <div className="relative">
              <label htmlFor="scenario-select" className="sr-only">
                {tx("Select Active Scenario")}
              </label>
              <select
                id="scenario-select"
                value={activeId}
                onChange={(e) => handleSelectScenario(e.target.value)}
                className="bg-[#11192e] border border-[#30363d] text-slate-200 text-sm font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {scenarios.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {tx(String(sc.name ?? ""))}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
              title={tx("Create new scenario")}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tx("New")}</span>
            </button>

            <button
              onClick={handleDuplicate}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#162032] hover:bg-[#1f2d47] border border-[#30363d] text-slate-300 text-xs font-medium transition"
              title={tx("Duplicate active scenario")}
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">{tx("Duplicate")}</span>
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#162032] hover:bg-[#1f2d47] border border-[#30363d] text-slate-300 text-xs font-medium transition"
              title={tx("Reset scenario inputs")}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">{tx("Reset")}</span>
            </button>

            <button
              onClick={handleDelete}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#1f1618] hover:bg-[#331118] border border-red-900/50 text-red-300 text-xs font-medium transition"
              title={tx("Delete active scenario")}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">{tx("Delete")}</span>
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block"></div>

            {/* Import / Export Controls */}
            <button
              onClick={handleExportActive}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#162032] hover:bg-[#1f2d47] border border-[#30363d] text-cyan-300 text-xs font-medium transition"
              title={tx("Export scenario as validated JSON")}
            >
              <FolderDown className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{tx("Export")}</span>
            </button>

            <button
              onClick={() => {
                setShowImportModal(true);
                setImportError(null);
              }}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#162032] hover:bg-[#1f2d47] border border-[#30363d] text-slate-300 text-xs font-medium transition"
              title={tx("Import scenario JSON")}
            >
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">{tx("Import")}</span>
            </button>

            {/* Toggle Assumptions Drawer */}
            <button
              onClick={() => setShowAssumptions(!showAssumptions)}
              className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                showAssumptions
                  ? "bg-blue-600/20 border-blue-500 text-blue-300"
                  : "bg-[#162032] border-[#30363d] text-slate-300 hover:bg-[#1f2d47]"
              }`}
              title={tx("Toggle assumptions & calculation methodology drawer")}
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tx("Assumptions")}</span>
            </button>

            {/* AI Advisor Contextual Link */}
            <Link
              to="/ai-advisor"
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 border border-[#58a6ff]/30 text-[#58a6ff] text-xs font-semibold transition"
              title={tx(
                "Open AI Engineering Advisor grounded in this scenario",
              )}
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tx("AI Advisor")}</span>
            </Link>

            {/* Decision Report Link */}
            <Link
              to={`/report?scenario=${activeId}`}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold shadow-sm transition"
              title={tx("Open full printable enterprise decision report")}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tx("Decision Report")}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="workspace-body max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
        {/* Left Navigation Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <nav
            aria-label={tx("Workspace navigation")}
            className="bg-[#0f172a] rounded-xl border border-[#21262d] p-2 space-y-1 sticky top-36"
          >
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-300 hover:bg-[#162032] hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Layers className="w-4 h-4" />
                <span>{tx("Overview & KPIs")}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 ${activeTab === "overview" ? "text-white" : "text-slate-500"}`}
              />
            </button>

            <button
              onClick={() => setActiveTab("inputs")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === "inputs"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-300 hover:bg-[#162032] hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Sliders className="w-4 h-4" />
                <span>{tx("Workload Inputs")}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 ${activeTab === "inputs" ? "text-white" : "text-slate-500"}`}
              />
            </button>

            <button
              onClick={() => setActiveTab("capacity")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === "capacity"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-300 hover:bg-[#162032] hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Cpu className="w-4 h-4" />
                <span>{tx("Capacity Intelligence")}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 ${activeTab === "capacity" ? "text-white" : "text-slate-500"}`}
              />
            </button>

            <button
              onClick={() => setActiveTab("finops")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === "finops"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-300 hover:bg-[#162032] hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Coins className="w-4 h-4" />
                <span>{tx("FinOps Studio")}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 ${activeTab === "finops" ? "text-white" : "text-slate-500"}`}
              />
            </button>

            <button
              onClick={() => setActiveTab("comparison")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === "comparison"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-300 hover:bg-[#162032] hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-4 h-4" />
                <span>{tx("Scenario Comparison")}</span>
              </div>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                {scenarios.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("architecture")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === "architecture"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-300 hover:bg-[#162032] hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Database className="w-4 h-4" />
                <span>{tx("Topology & Flow")}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 ${activeTab === "architecture" ? "text-white" : "text-slate-500"}`}
              />
            </button>

            <button
              onClick={() => setActiveTab("observability")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === "observability"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-300 hover:bg-[#162032] hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Activity className="w-4 h-4" />
                <span>{tx("Observability & Telemetry")}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 ${activeTab === "observability" ? "text-white" : "text-slate-500"}`}
              />
            </button>

            {/* Active Scenario Metadata Pill */}
            {activeScenario && (
              <div className="pt-4 mt-4 border-t border-[#21262d] px-2 text-xs text-slate-400 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    {tx("Schema Version:")}
                  </span>
                  <span className="font-mono text-slate-300">
                    {activeScenario.schemaVersion}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    {tx("Evidence Level:")}
                  </span>
                  <span className="capitalize px-1.5 py-0.2 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-800/40">
                    {activeScenario.evidenceLevel?.replace("_", " ") ||
                      "Model Based"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{tx("Updated:")}</span>
                  <span className="text-slate-300">
                    {new Date(activeScenario.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </nav>
        </aside>

        {/* Central Workspace Tab Content */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === "overview" && activeScenario && evalData && (
            <div className="space-y-6">
              {/* Scenario Overview Banner */}
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#21262d] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {tx("Active Scenario")}
                      </span>
                      <span className="text-xs text-slate-400">
                        {tx("Region:") + " "}
                        <strong className="text-slate-200 uppercase">
                          {activeScenario.region}
                        </strong>
                        {" " + tx("(US East Baseline)")}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {tx(String(activeScenario.name ?? ""))}
                    </h2>
                    <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                      {tx(String(activeScenario.description ?? ""))}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={() => setActiveTab("inputs")}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition flex items-center space-x-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{tx("Adjust Inputs")}</span>
                    </button>
                    <button
                      onClick={() => exportAllScenariosAsJSON()}
                      className="px-3 py-2 rounded-lg bg-[#162032] hover:bg-[#1f2d47] border border-[#30363d] text-slate-300 text-xs font-medium transition flex items-center space-x-1.5"
                    >
                      <FolderDown className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{tx("Export All")}</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#21262d]">
                  <div className="bg-[#11192e] p-4 rounded-xl border border-[#21262d]">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {tx("Recommended SKU")}
                    </div>
                    <div className="text-2xl font-black text-cyan-400 mt-1">
                      {evalData.targetSkuRecommendation.safeSkuName}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {evalData.targetSkuRecommendation.safeSkuCu}
                      {" " + tx("CUs with +50% Headroom")}
                    </div>
                  </div>

                  <div className="bg-[#11192e] p-4 rounded-xl border border-[#21262d]">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {tx("Baseline Compute")}
                    </div>
                    <div className="text-2xl font-black text-white mt-1">
                      {evalData.calculatedCuBaseline}{" "}
                      <span className="text-sm font-semibold text-slate-400">
                        CU
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {tx("Composite Workload Demand")}
                    </div>
                  </div>

                  <div className="bg-[#11192e] p-4 rounded-xl border border-[#21262d]">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {tx("PAYG Cost (Monthly)")}
                    </div>
                    <div className="text-2xl font-black text-white mt-1">
                      $
                      {evalData.financialSummary.payAsYouGoMonthlyEstimate.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {tx("@ $0.1800/CU/hr (730h)")}
                    </div>
                  </div>

                  <div className="bg-[#11192e] p-4 rounded-xl border border-[#21262d]">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {tx("1-Yr Reserved Savings")}
                    </div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">
                      ~$
                      {evalData.financialSummary.potentialSavingsMonthly.toLocaleString()}
                    </div>
                    <div className="text-xs text-emerald-300/80 mt-0.5">
                      {tx("~41% Commitment Discount")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sizing & Throttling Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Safe Headroom Meter */}
                <div className="p-6 rounded-xl bg-[#0f172a] border border-[#21262d] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-cyan-400" />
                      <span>{tx("Capacity Headroom Buffer")}</span>
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono border border-cyan-500/20">
                      {tx("+50% Safety")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tx(
                      "Production workloads require capacity buffering above baseline demands to absorb concurrent ad-hoc queries and job spikes without triggering smoothing throttle thresholds.",
                    )}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300">
                        {tx("Baseline Demand:") + " "}
                        {evalData.calculatedCuBaseline} CU
                      </span>
                      <span className="text-cyan-400 font-bold">
                        {tx("Buffer Target:") + " "}
                        {(evalData.calculatedCuBaseline * 1.5).toFixed(1)} CU
                      </span>
                    </div>
                    <div className="w-full bg-[#162032] rounded-full h-3 overflow-hidden p-0.5 border border-[#30363d]">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              ((evalData.calculatedCuBaseline * 1.5) /
                                evalData.targetSkuRecommendation.safeSkuCu) *
                                100,
                            ),
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{tx("0 CU")}</span>
                      <span>
                        {tx("Target SKU:") + " "}
                        {evalData.targetSkuRecommendation.safeSkuName} (
                        {evalData.targetSkuRecommendation.safeSkuCu}
                        {" " + tx("CU)")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Power BI & Governance Licensing Rules */}
                <div className="p-6 rounded-xl bg-[#0f172a] border border-[#21262d] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span>{tx("Organizational Licensing")}</span>
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-mono border ${
                        evalData.targetSkuRecommendation.safeSkuCu >= 64
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                      }`}
                    >
                      {evalData.targetSkuRecommendation.safeSkuCu >= 64
                        ? tx("F64+ Threshold Met")
                        : tx("Below F64")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tx(
                      "Fabric capacities equal to or larger than F64 allow unlimited report viewing by users with standard Power BI Free licenses. For SKUs smaller than F64, each viewer requires a paid Power BI Pro or PPU license.",
                    )}
                  </p>

                  <div className="pt-2">
                    <div className="p-3 rounded-lg bg-[#11192e] border border-[#21262d] flex items-center justify-between text-xs">
                      <span className="text-slate-300">
                        {tx("Free Viewer Report Distribution:")}
                      </span>
                      <span
                        className={`font-semibold ${evalData.targetSkuRecommendation.safeSkuCu >= 64 ? "text-emerald-400" : "text-amber-400"}`}
                      >
                        {evalData.targetSkuRecommendation.safeSkuCu >= 64
                          ? tx("Included at No Extra Cost")
                          : tx("Requires Individual Pro ($10/user/mo)")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engineering Reasons & Timeline */}
              <div className="p-6 rounded-xl bg-[#0f172a] border border-[#21262d] space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>{tx("Explainable Sizing Rationale")}</span>
                </h3>
                <ul className="space-y-2 pt-1">
                  {evalData.reasons.map((reason, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-2.5 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-[#21262d] text-xs text-slate-400 flex items-center justify-between">
                  <span>{tx("Growth Projection:")}</span>
                  <span className="font-semibold text-blue-300">
                    {evalData.upgradeTimeline}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORKLOAD INPUTS */}
          {activeTab === "inputs" && activeScenario && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#21262d]">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {tx("Workload Parameters")}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {tx(
                    "Adjust data factory pipeline activity, Apache Spark compute clusters, and concurrent Power BI report interactions. Values recalculate instantly.",
                  )}
                </p>

                {/* Section A: Data Factory */}
                <div className="mt-6 pt-6 border-t border-[#21262d]">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-4">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span>{tx("Data Factory Pipelines & Ingestion")}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {tx("Monthly Pipeline Runs")}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        value={
                          activeScenario.inputs.dataFactoryInput
                            .monthlyPipelines
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "dataFactoryInput",
                            "monthlyPipelines",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#11192e] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {tx("Scheduled pipeline triggers per month")}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {tx("Avg Activities per Pipeline")}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={
                          activeScenario.inputs.dataFactoryInput.avgActivities
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "dataFactoryInput",
                            "avgActivities",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#11192e] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {tx("Copy, notebook, and lookup steps")}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {tx("Monthly Volume (GB)")}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5000000"
                        value={
                          activeScenario.inputs.dataFactoryInput.dataVolumeGb
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "dataFactoryInput",
                            "dataVolumeGb",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#11192e] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {tx("Total ingested data volume into OneLake")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section B: Spark Compute */}
                <div className="mt-6 pt-6 border-t border-[#21262d]">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-4">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span>{tx("Apache Spark Compute Clusters")}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {tx("Total Worker Nodes")}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="256"
                        value={
                          activeScenario.inputs.sparkComputeInput.totalNodes
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "sparkComputeInput",
                            "totalNodes",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#11192e] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {tx("Active executor nodes in pool")}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {tx("vCores per Node")}
                      </label>
                      <select
                        value={
                          activeScenario.inputs.sparkComputeInput.vCoresPerNode
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "sparkComputeInput",
                            "vCoresPerNode",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#11192e] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      >
                        {[2, 4, 8, 16, 32, 64].map((cores) => (
                          <option key={cores} value={cores}>
                            {cores}
                            {" " + tx("vCores")}
                          </option>
                        ))}
                      </select>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {tx("Standard Azure cloud VM vCores")}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {tx("Daily Runtime (Hours)")}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={
                          activeScenario.inputs.sparkComputeInput
                            .dailyRuntimeHours
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "sparkComputeInput",
                            "dailyRuntimeHours",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#11192e] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {tx("Hours active per 24h smoothing window")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section C: Power BI */}
                <div className="mt-6 pt-6 border-t border-[#21262d]">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-4">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>{tx("Power BI Concurrency & Semantic Models")}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {tx("Peak Concurrent Users")}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50000"
                        value={
                          activeScenario.inputs.powerBiInput.peakConcurrentUsers
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "powerBiInput",
                            "peakConcurrentUsers",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#11192e] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {tx("Simultaneous active dashboard viewers")}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {tx("Query Complexity Scale (1\u20135)")}
                      </label>
                      <select
                        value={
                          activeScenario.inputs.powerBiInput
                            .queryComplexityScale
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "powerBiInput",
                            "queryComplexityScale",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#11192e] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      >
                        <option value={1}>
                          {tx(
                            "1 \u2014 Simple aggregations & low visual density",
                          )}
                        </option>
                        <option value={2}>
                          {tx("2 \u2014 Moderate dimensional filtering")}
                        </option>
                        <option value={3}>
                          {tx(
                            "3 \u2014 Standard enterprise Direct Lake models",
                          )}
                        </option>
                        <option value={4}>
                          {tx(
                            "4 \u2014 Heavy iterative DAX & high visual counts",
                          )}
                        </option>
                        <option value={5}>
                          {tx(
                            "5 \u2014 Complex composite models & many-to-many relationships",
                          )}
                        </option>
                      </select>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {tx("Affects 5-minute interactive smoothing peak")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAPACITY INTELLIGENCE */}
          {activeTab === "capacity" && activeScenario && evalData && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#21262d] space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {tx("Capacity Sizing & Smoothing Evaluation")}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {tx(
                      "Evaluates multi-engine demand across 24-hour background smoothing (Spark, Data Factory) and 5-minute interactive smoothing (Power BI).",
                    )}
                  </p>
                </div>

                {/* SKU Recommendation Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Lower Cost Alternative */}
                  <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d]">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      {tx("Lower-Cost Tier")}
                    </span>
                    <div className="text-xl font-bold text-slate-300 mt-1">
                      {evalData.alternatives.lowerCostSku}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {evalData.alternatives.lowerCostCu}
                      {" " + tx("Capacity Units")}
                    </div>
                    <p className="text-xs text-amber-400/90 mt-3 pt-3 border-t border-[#21262d]">
                      {tx(
                        "Risk of interactive throttling under peak concurrency.",
                      )}
                    </p>
                  </div>

                  {/* Primary Recommended Safe SKU */}
                  <div className="p-4 rounded-xl bg-[#0d2238] border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-cyan-300 font-bold">
                        {tx("Target Safe SKU")}
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-cyan-500 text-slate-950">
                        {tx("RECOMMENDED")}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-cyan-300 mt-1">
                      {evalData.targetSkuRecommendation.safeSkuName}
                    </div>
                    <div className="text-xs text-cyan-200 mt-0.5 font-medium">
                      {evalData.targetSkuRecommendation.safeSkuCu}
                      {" " + tx("Capacity Units (+50% Headroom)")}
                    </div>
                    <p className="text-xs text-cyan-200/90 mt-3 pt-3 border-t border-cyan-800/40">
                      {tx(
                        "Sufficient headroom for concurrent workloads and burst operations.",
                      )}
                    </p>
                  </div>

                  {/* Future Ready Alternative */}
                  <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d]">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      {tx("Future-Ready Tier")}
                    </span>
                    <div className="text-xl font-bold text-slate-300 mt-1">
                      {evalData.alternatives.futureReadySku}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {evalData.alternatives.futureReadyCu}
                      {" " + tx("Capacity Units")}
                    </div>
                    <p className="text-xs text-blue-300/90 mt-3 pt-3 border-t border-[#21262d]">
                      {tx(
                        "Extended runway for 25%+ annual data estate expansion.",
                      )}
                    </p>
                  </div>
                </div>

                {/* Phase 5: Configurable Headroom Sizing Buffer */}
                <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <span>{tx("Configurable Headroom Sizing Buffer")}</span>
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {tx(
                          "Adjust safety margin above composite baseline demand (",
                        )}
                        {evalData.calculatedCuBaseline}
                        {" " + tx("CU).")}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5 p-1 rounded-lg bg-[#0a0f1d] border border-[#21262d]">
                      {HEADROOM_OPTIONS.map((opt) => (
                        <button
                          key={opt.percent}
                          onClick={() =>
                            setSelectedHeadroomPercent(opt.percent)
                          }
                          className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                            selectedHeadroomPercent === opt.percent
                              ? "bg-blue-600 text-white shadow-sm font-semibold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          +{opt.percent}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {headroomSizing && (
                    <div className="pt-2 border-t border-[#21262d] flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-slate-300">
                        {tx(
                          String(
                            HEADROOM_OPTIONS.find(
                              (o) => o.percent === selectedHeadroomPercent,
                            )?.description ?? "",
                          ),
                        )}
                      </span>
                      <span className="font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40 text-[11px]">
                        {tx("Target:") + " "}
                        {headroomSizing.targetBufferedCu}
                        {" " + tx("CU \u2192 Recommended SKU:") + " "}
                        <strong>
                          {headroomSizing.recommendedSku} (
                          {headroomSizing.recommendedSkuCu}
                          {" " + tx("CUs)")}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Throttling Risk & Mitigation */}
                <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      {tx("Cost-Optimized Tier Throttling Risk:")}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {evalData.throttlingAnalysis.optimizedTierRiskPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-[#162032] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{
                        width: `${evalData.throttlingAnalysis.optimizedTierRiskPercentage}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {tx(
                      "Microsoft Fabric distributes background job execution across a 24-hour smoothing period. However, interactive visual queries are smoothed over 5 minutes and may trigger interactive delays if capacity is undersized.",
                    )}
                  </p>
                </div>

                {/* Phase 5 Feature 1: Workload Sensitivity Analysis */}
                {sensitivityData && (
                  <div className="p-5 rounded-xl bg-[#11192e] border border-[#21262d] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                          <Sliders className="w-4 h-4 text-cyan-400" />
                          <span>
                            {tx("Workload Sensitivity & Volatility Modeling")}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {tx(
                            "Simulate workload variance against sizing recommendations and throttling risk.",
                          )}
                        </p>
                      </div>

                      {/* Sensitivity Variant Toggle Pills */}
                      <div className="flex items-center space-x-1.5 p-1 rounded-lg bg-[#0a0f1d] border border-[#21262d] self-start sm:self-auto">
                        {(["conservative", "baseline", "peak"] as const).map(
                          (type) => (
                            <button
                              key={type}
                              onClick={() => setSensitivityVariant(type)}
                              className={`px-3 py-1 rounded text-xs font-medium transition ${
                                sensitivityVariant === type
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "text-slate-400 hover:text-white"
                              }`}
                            >
                              {tx(String(sensitivityData[type].label ?? ""))}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 italic border-l-2 border-cyan-500 pl-3">
                      {tx(
                        String(
                          sensitivityData[sensitivityVariant].description ?? "",
                        ),
                      )}
                    </p>

                    {/* Sensitivity Comparison Cards */}
                    {(() => {
                      const v = sensitivityData[sensitivityVariant];
                      const ev = v.evaluation;
                      return (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                          <div className="p-3 rounded-lg bg-[#0f172a] border border-[#21262d]">
                            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                              {tx("Target Safe SKU")}
                            </span>
                            <div className="text-lg font-bold text-cyan-300 mt-1">
                              {ev.targetSkuRecommendation.safeSkuName}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {ev.targetSkuRecommendation.safeSkuCu} CUs
                            </span>
                          </div>

                          <div className="p-3 rounded-lg bg-[#0f172a] border border-[#21262d]">
                            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                              {tx("Baseline Demand")}
                            </span>
                            <div className="text-lg font-bold text-white mt-1">
                              {ev.calculatedCuBaseline} CU
                            </div>
                            <span
                              className={`text-[10px] font-semibold ${
                                v.deltaCuPercent > 0
                                  ? "text-amber-400"
                                  : v.deltaCuPercent < 0
                                    ? "text-emerald-400"
                                    : "text-slate-500"
                              }`}
                            >
                              {v.deltaCuPercent > 0
                                ? `+${v.deltaCuPercent}%`
                                : v.deltaCuPercent < 0
                                  ? `${v.deltaCuPercent}%`
                                  : tx("Baseline")}
                            </span>
                          </div>

                          <div className="p-3 rounded-lg bg-[#0f172a] border border-[#21262d]">
                            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                              {tx("Monthly PAYG")}
                            </span>
                            <div className="text-lg font-bold text-white mt-1">
                              $
                              {ev.financialSummary.payAsYouGoMonthlyEstimate.toLocaleString()}
                            </div>
                            <span
                              className={`text-[10px] font-semibold ${
                                v.deltaCostPercent > 0
                                  ? "text-amber-400"
                                  : v.deltaCostPercent < 0
                                    ? "text-emerald-400"
                                    : "text-slate-500"
                              }`}
                            >
                              {v.deltaCostPercent > 0
                                ? `+${v.deltaCostPercent}%`
                                : v.deltaCostPercent < 0
                                  ? `${v.deltaCostPercent}%`
                                  : tx("Baseline")}
                            </span>
                          </div>

                          <div className="p-3 rounded-lg bg-[#0f172a] border border-[#21262d]">
                            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                              {tx("Throttling Risk")}
                            </span>
                            <div
                              className={`text-lg font-bold mt-1 ${
                                ev.throttlingAnalysis
                                  .optimizedTierRiskPercentage > 40
                                  ? "text-red-400"
                                  : ev.throttlingAnalysis
                                        .optimizedTierRiskPercentage > 20
                                    ? "text-amber-400"
                                    : "text-emerald-400"
                              }`}
                            >
                              {
                                ev.throttlingAnalysis
                                  .optimizedTierRiskPercentage
                              }
                              %
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {tx("Smoothing Buffer")}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Phase 5 Feature 2: Step-by-Step Mathematical Explanation */}
                {mathExplanation && (
                  <div className="p-5 rounded-xl bg-[#11192e] border border-[#21262d] space-y-3">
                    <button
                      onClick={() => setShowMathDetails(!showMathDetails)}
                      className="w-full flex items-center justify-between text-left text-sm font-bold text-white focus:outline-none"
                    >
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span>
                          {tx(
                            "Step-by-Step Mathematical Formulation Breakdown",
                          )}
                        </span>
                      </div>
                      <span className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
                        {showMathDetails
                          ? tx("Hide Formulas")
                          : tx("View Explanations")}
                      </span>
                    </button>

                    {showMathDetails && (
                      <div className="pt-3 border-t border-[#21262d] space-y-3 text-xs">
                        <div className="p-3 rounded-lg bg-[#0f172a] border border-[#21262d] space-y-1">
                          <span className="text-cyan-300 font-semibold block">
                            {tx("1. Data Factory Component:")}
                          </span>
                          <code className="text-slate-300 font-mono block text-[11px]">
                            {mathExplanation.dfFormula}
                          </code>
                          <span className="text-[10px] text-slate-500">
                            {tx(
                              "Evaluated over standard 730h month: 0.005 CU/activity execution + 0.002 CU/GB OneLake volume.",
                            )}
                          </span>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0f172a] border border-[#21262d] space-y-1">
                          <span className="text-cyan-300 font-semibold block">
                            {tx("2. Apache Spark Compute Component:")}
                          </span>
                          <code className="text-slate-300 font-mono block text-[11px]">
                            {mathExplanation.sparkFormula}
                          </code>
                          <span className="text-[10px] text-slate-500">
                            {tx(
                              "Maps standard 2:1 cloud vCore to Fabric CU with 24-hour background smoothing.",
                            )}
                          </span>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0f172a] border border-[#21262d] space-y-1">
                          <span className="text-cyan-300 font-semibold block">
                            {tx("3. Power BI Interactive Component:")}
                          </span>
                          <code className="text-slate-300 font-mono block text-[11px]">
                            {mathExplanation.pbiFormula}
                          </code>
                          <span className="text-[10px] text-slate-500">
                            {tx(
                              "Applies DAX query complexity scalar across 5-minute interactive smoothing peak.",
                            )}
                          </span>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0d2238] border border-cyan-800/40 text-cyan-200 space-y-1">
                          <span className="font-bold text-white block">
                            {tx("Composite Baseline & Headroom Sizing:")}
                          </span>
                          <div className="font-mono text-[11px]">
                            {mathExplanation.dfCu}
                            {" " + tx("CU (DF) +") + " "}
                            {mathExplanation.sparkCu}
                            {" " + tx("CU (Spark) +") + " "}
                            {mathExplanation.pbiCu}
                            {" " + tx("CU (PBI) =")}{" "}
                            <strong>
                              {mathExplanation.compositeBaselineCu}
                              {" " + tx("Baseline CU")}
                            </strong>
                          </div>
                          <div className="font-mono text-[11px]">
                            {tx("Buffer Target:") + " "}
                            {mathExplanation.compositeBaselineCu}
                            {" " + tx("CU \u00D7 1.5 (+50% Headroom) =")}{" "}
                            <strong>
                              {mathExplanation.bufferedSafeCu}
                              {" " + tx("Safe CU")}
                            </strong>
                            {" " + tx("\u2192 Selects")}{" "}
                            <strong>
                              {mathExplanation.recommendedSku} (
                              {mathExplanation.recommendedSkuCu}
                              {" " + tx("CU)")}
                            </strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: FINOPS STUDIO */}
          {activeTab === "finops" && activeScenario && evalData && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#21262d] space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {tx("FinOps Cost & Commitment Modeling")}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {tx(
                        "Multi-regional pricing comparison, currency normalization, and 1-Year Reserved Instance analysis.",
                      )}
                    </p>
                  </div>

                  {/* Region & Currency Selectors */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Region Selector */}
                    <div>
                      <label htmlFor="finops-region" className="sr-only">
                        {tx("Select Azure Region")}
                      </label>
                      <select
                        id="finops-region"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="bg-[#11192e] border border-[#30363d] text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.values(REGIONAL_PRICING_CATALOG).map((r) => (
                          <option key={r.id} value={r.id}>
                            {tx(String(r.name ?? ""))} (
                            {r.multiplier.toFixed(2)}x)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Currency Selector */}
                    <div>
                      <label htmlFor="finops-currency" className="sr-only">
                        {tx("Select Display Currency")}
                      </label>
                      <select
                        id="finops-currency"
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="bg-[#11192e] border border-[#30363d] text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.keys(SUPPORTED_CURRENCIES).map((c) => (
                          <option key={c} value={c}>
                            {c} ({SUPPORTED_CURRENCIES[c].symbol})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Regional Rate Banner */}
                <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d] flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">
                      {tx("Selected Region:")}
                    </span>
                    <strong className="text-white">
                      {tx(String(currentRegionInfo.name ?? ""))}
                    </strong>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20 text-[10px]">
                      ${currentRegionInfo.ratePerCuHourUSD.toFixed(4)} / CU / hr
                      USD
                    </span>
                  </div>
                  <div className="text-slate-400">
                    {tx("Target SKU:") + " "}
                    <strong className="text-cyan-400">
                      {evalData.targetSkuRecommendation.safeSkuName}
                    </strong>{" "}
                    ({evalData.targetSkuRecommendation.safeSkuCu}
                    {" " + tx("CUs)")}
                  </div>
                </div>

                {/* Operating Hours Profiles & Schedule Modeling */}
                <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span>{tx("Operating Hours & Runtime Schedule")}</span>
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {tx(
                          "Model active billing runtime per month to evaluate capacity pausing vs reservation commitments.",
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#0a0f1d] border border-[#21262d]">
                      {(
                        Object.keys(
                          OPERATING_HOURS_PROFILES,
                        ) as OperatingProfileKey[]
                      ).map((key) => {
                        const prof = OPERATING_HOURS_PROFILES[key];
                        return (
                          <button
                            key={key}
                            onClick={() => handleOperatingProfileChange(key)}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                              selectedOperatingProfile === key
                                ? "bg-blue-600 text-white shadow-sm font-semibold"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {prof.label.split(" (")[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedOperatingProfile === "custom" && (
                    <div className="pt-2 border-t border-[#21262d] flex items-center space-x-4">
                      <span className="text-xs text-slate-400 shrink-0">
                        {tx("Custom Hours / Month:")}
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={730}
                        step={10}
                        value={operatingHours}
                        onChange={(e) =>
                          setOperatingHours(Number(e.target.value))
                        }
                        className="flex-1 accent-cyan-400"
                      />
                      <span className="font-mono text-cyan-300 font-bold text-xs shrink-0 w-16 text-right">
                        {operatingHours}
                        {" " + tx("hrs")}
                      </span>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 italic">
                    {tx(
                      String(
                        OPERATING_HOURS_PROFILES[selectedOperatingProfile]
                          .description ?? "",
                      ),
                    )}
                  </div>
                </div>

                {/* Financial Comparison Cards (Calculated with Reservation Economics) */}
                {reservationEconomics && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* PAYG Card */}
                      <div className="p-5 rounded-xl bg-[#11192e] border border-[#21262d] space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {tx("Pay-As-You-Go (PAYG)")}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                            {operatingHours < 730
                              ? `${operatingHours}h Active Runtime`
                              : tx("Continuous (730h)")}
                          </span>
                        </div>

                        <div className="text-3xl font-black text-white">
                          {reservationEconomics.formattedMonthlyPayg}
                          <span className="text-xs font-normal text-slate-400">
                            {" "}
                            / month
                          </span>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-[#21262d] text-xs text-slate-300">
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              {tx("Hourly Rate:")}
                            </span>
                            <span className="font-mono">
                              {currencyObj.format(
                                reservationEconomics.hourlyPaygUSD,
                              )}
                              /hr
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              {tx("Annual Projection (")}
                              {operatingHours}
                              {tx("h/mo):")}
                            </span>
                            <span className="font-mono">
                              {currencyObj.format(
                                reservationEconomics.annualPaygUSD,
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              {tx("Commitment:")}
                            </span>
                            <span>
                              {tx("None (Pause or delete capacity anytime)")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 1-Year Reserved Card */}
                      <div className="p-5 rounded-xl bg-[#0d2238] border border-cyan-500/40 space-y-4 shadow-lg shadow-cyan-500/5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                            {tx("1-Year Reserved Instance")}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              reservationEconomics.isReservationRecommended
                                ? "bg-cyan-500 text-slate-950"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {reservationEconomics.isReservationRecommended
                              ? tx("SAVE ~41%")
                              : tx("FIXED COMMITMENT")}
                          </span>
                        </div>

                        <div className="text-3xl font-black text-cyan-300">
                          {reservationEconomics.formattedMonthlyReserved}
                          <span className="text-xs font-normal text-cyan-200">
                            {" "}
                            / month
                          </span>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-cyan-800/40 text-xs text-cyan-100">
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              {tx("Hourly Equivalent (730h):")}
                            </span>
                            <span className="font-mono">
                              {currencyObj.format(
                                reservationEconomics.hourlyReservedUSD,
                              )}
                              /hr
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              {tx("Annual Commitment:")}
                            </span>
                            <span className="font-mono">
                              {currencyObj.format(
                                reservationEconomics.annualReservedCommitmentUSD,
                              )}
                            </span>
                          </div>
                          <div
                            className={`flex justify-between font-semibold ${reservationEconomics.isReservationRecommended ? "text-emerald-300" : "text-amber-300"}`}
                          >
                            <span>{tx("Effective Delta:")}</span>
                            <span>
                              {reservationEconomics.isReservationRecommended
                                ? `+${reservationEconomics.formattedSavings} / mo Saved`
                                : `PAYG Saves ${reservationEconomics.formattedSavings} / mo`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reservation Economics & Break-Even Insight Box */}
                    <div
                      className={`p-4 rounded-xl border space-y-2 text-xs ${
                        reservationEconomics.isReservationRecommended
                          ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                          : "bg-blue-950/20 border-blue-500/40 text-blue-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-white flex items-center space-x-1.5">
                          <Coins className="w-4 h-4 text-cyan-400" />
                          <span>
                            {tx("Reservation Economics & Utilization Analysis")}
                          </span>
                        </strong>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700 text-slate-300">
                          {tx(
                            "Break-Even Threshold: 434 hours / month (~14.5h/day)",
                          )}
                        </span>
                      </div>
                      <p className="text-slate-300">
                        {reservationEconomics.recommendationReason}
                      </p>
                      {operatingHours < 730 && (
                        <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex items-center justify-between">
                          <span>
                            {tx("Idle / Unused Reserved Capacity Cost:")}
                          </span>
                          <span className="font-mono text-amber-400">
                            {currencyObj.format(
                              reservationEconomics.unusedCommitmentUSD,
                            )}{" "}
                            / month
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Phase 5 Feature 3: Multi-Region Cost Comparison Table */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-cyan-400" />
                      <span>
                        {tx("Cross-Region Azure Pricing Matrix (")}
                        {evalData.targetSkuRecommendation.safeSkuName})
                      </span>
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {tx("Standardized across 8 official cloud regions (")}
                      {operatingHours}
                      {tx("h/mo runtime)")}
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-[#21262d]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#11192e] text-slate-400 uppercase tracking-wider font-semibold border-b border-[#21262d]">
                        <tr>
                          <th className="py-3 px-4">{tx("Azure Region")}</th>
                          <th className="py-3 px-4">
                            {tx("Rate / CU / hr (USD)")}
                          </th>
                          <th className="py-3 px-4">{tx("Monthly PAYG")}</th>
                          <th className="py-3 px-4">
                            {tx("1-Yr Reserved / Mo")}
                          </th>
                          <th className="py-3 px-4">
                            {tx("Annual Commitment Savings")}
                          </th>
                          <th className="py-3 px-4 text-right">
                            {tx("Rate Status")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#21262d]">
                        {regionalComparisonList.map((rc) => {
                          const isSelected = rc.regionId === selectedRegion;
                          return (
                            <tr
                              key={rc.regionId}
                              className={`transition hover:bg-[#162032] ${isSelected ? "bg-blue-950/20 font-medium" : ""}`}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-white font-semibold">
                                    {rc.regionName}
                                  </span>
                                  {isSelected && (
                                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 text-[10px] border border-cyan-500/30">
                                      {tx("SELECTED")}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-3 px-4 font-mono text-slate-300">
                                ${rc.ratePerCuHourUSD.toFixed(4)}
                              </td>

                              <td className="py-3 px-4 font-mono text-slate-200">
                                {rc.formattedPayg}
                              </td>

                              <td className="py-3 px-4 font-mono text-emerald-400">
                                {rc.formattedReserved}
                              </td>

                              <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                                ~{currencyObj.format(rc.annualSavings)}
                              </td>

                              <td className="py-3 px-4 text-right">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                  {tx("Verified Oct 2026")}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Phase 5 Feature 4: Sovereign Clouds & Unsupported Regions Disclosure Drawer */}
                <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {tx(
                          "Sovereign Clouds & Unsupported Regions Disclosure",
                        )}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setShowUnsupportedModal(!showUnsupportedModal)
                      }
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium focus:outline-none"
                    >
                      {showUnsupportedModal
                        ? tx("Hide Disclosures")
                        : tx("View Disclosures (3 Regions)")}
                    </button>
                  </div>

                  {showUnsupportedModal && (
                    <div className="pt-3 border-t border-[#21262d] grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {UNSUPPORTED_REGIONS_CATALOG.map((u) => (
                        <div
                          key={u.id}
                          className="p-3 rounded-lg bg-[#0f172a] border border-[#21262d] space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-white text-[11px]">
                              {tx(String(u.name ?? ""))}
                            </strong>
                            <span className="uppercase text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {tx(String(u.category ?? ""))}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {u.statusReason}
                          </p>
                          <p className="text-[10px] text-cyan-300 font-medium pt-1 border-t border-[#21262d]">
                            {tx("Guidance:") + " "}
                            {u.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phase 5 Feature 5: Standardized Provenance & Integrity Card (All 9 Mandatory Parameters) */}
                {provenanceMeta && (
                  <div className="p-4 rounded-xl bg-[#0d1829] border border-cyan-800/40 text-xs text-slate-300 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-cyan-900/40">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <strong className="text-white text-xs uppercase tracking-wider">
                          {tx("FinOps Pricing Provenance & Data Integrity")}
                        </strong>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-300">
                        {tx("Version") + " "}
                        {provenanceMeta.pricingDatasetVersion}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">
                          {tx("Calculation Engine:")}
                        </span>
                        <span className="font-mono text-slate-200">
                          v{provenanceMeta.calculationEngineVersion}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">
                          {tx("Active Region:")}
                        </span>
                        <span className="font-mono text-slate-200">
                          {provenanceMeta.regionName}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">
                          {tx("Currency & Runtime:")}
                        </span>
                        <span className="font-mono text-slate-200">
                          {provenanceMeta.currencyCode} •{" "}
                          {provenanceMeta.operatingHoursPerMonth}
                          {tx("h/mo")}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">
                          {tx("Timestamp:")}
                        </span>
                        <span className="font-mono text-slate-400 text-[10px]">
                          {new Date(
                            provenanceMeta.calculationTimestamp,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-cyan-900/30 text-[11px] text-slate-400">
                      {tx("Derived from official")}{" "}
                      <a
                        href={provenanceMeta.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline inline-flex items-center space-x-0.5"
                      >
                        <span>{provenanceMeta.sourceReference}</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>{" "}
                      ({provenanceMeta.retrievalDate}
                      {tx(
                        "). Reservations apply to 1-year commitments and charge for 730h/month. Workloads running &lt; 434h/month are more economical via PAYG with automated pause.",
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SCENARIO COMPARISON (MULTI-SCENARIO) */}
          {activeTab === "comparison" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#21262d] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {tx("Multi-Scenario Comparison")}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {tx(
                        "Evaluate capacity demands, SKUs, and expenditure differences across all saved estate models.",
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNewModal(true)}
                    className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition flex items-center space-x-1.5 self-start"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{tx("Add Scenario")}</span>
                  </button>
                </div>

                {/* Comparison Matrix Table */}
                <div className="overflow-x-auto rounded-xl border border-[#21262d]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#11192e] text-slate-400 uppercase tracking-wider font-semibold border-b border-[#21262d]">
                      <tr>
                        <th className="py-3 px-4">{tx("Scenario Name")}</th>
                        <th className="py-3 px-4">{tx("Target Safe SKU")}</th>
                        <th className="py-3 px-4">{tx("Baseline CU")}</th>
                        <th className="py-3 px-4">{tx("PAYG / Month")}</th>
                        <th className="py-3 px-4">
                          {tx("1-Yr Reserved / Mo")}
                        </th>
                        <th className="py-3 px-4">{tx("Annual Savings")}</th>
                        <th className="py-3 px-4">{tx("PBI Free Viewers")}</th>
                        <th className="py-3 px-4 text-right">
                          {tx("Actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#21262d]">
                      {scenarios.map((sc) => {
                        const ev =
                          sc.evaluation || calculateCapacity(sc.inputs);
                        const isCurrent = sc.id === activeId;
                        return (
                          <tr
                            key={sc.id}
                            className={`transition hover:bg-[#162032] ${isCurrent ? "bg-blue-950/20 font-medium" : ""}`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-semibold">
                                  {tx(String(sc.name ?? ""))}
                                </span>
                                {isCurrent && (
                                  <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 text-[10px] border border-blue-500/30">
                                    {tx("ACTIVE")}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 block">
                                {sc.region.toUpperCase()}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded font-bold font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/50">
                                {ev.targetSkuRecommendation.safeSkuName}
                              </span>
                              <span className="text-[11px] text-slate-500 block mt-0.5">
                                {ev.targetSkuRecommendation.safeSkuCu} CUs
                              </span>
                            </td>

                            <td className="py-3 px-4 font-mono text-slate-200">
                              {ev.calculatedCuBaseline} CU
                            </td>

                            <td className="py-3 px-4 font-mono text-slate-200">
                              $
                              {ev.financialSummary.payAsYouGoMonthlyEstimate.toLocaleString()}
                            </td>

                            <td className="py-3 px-4 font-mono text-emerald-400">
                              $
                              {ev.financialSummary.reservedInstanceMonthlyEstimate.toLocaleString()}
                            </td>

                            <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                              ~$
                              {(
                                ev.financialSummary.potentialSavingsMonthly * 12
                              ).toLocaleString()}
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                  ev.targetSkuRecommendation.safeSkuCu >= 64
                                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                    : "bg-slate-800 text-slate-400"
                                }`}
                              >
                                {ev.targetSkuRecommendation.safeSkuCu >= 64
                                  ? tx("Included (F64+)")
                                  : tx("Requires Pro")}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              {isCurrent ? (
                                <span className="text-slate-500 text-xs italic">
                                  {tx("Selected")}
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleSelectScenario(sc.id)}
                                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                                >
                                  {tx("Switch")}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TOPOLOGY & FLOW */}
          {activeTab === "architecture" && activeScenario && evalData && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#21262d] space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {tx("Fabric Estate Architecture Topology")}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {tx(
                      "Visual data movement from ingestion through Medallion lakehouse layers, Spark computation, Direct Lake caching, and consumption.",
                    )}
                  </p>
                </div>

                {/* Architecture Stages Flow */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Step 1: Ingestion */}
                  <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d] relative">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">
                      {tx("STAGE 01")}
                    </div>
                    <div className="text-sm font-bold text-white mb-1">
                      {tx("Data Factory")}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {activeScenario.inputs.dataFactoryInput.monthlyPipelines.toLocaleString()}
                      {" " + tx("pipeline runs moving")}{" "}
                      {activeScenario.inputs.dataFactoryInput.dataVolumeGb}
                      {" " + tx("GB into OneLake landing.")}
                    </p>
                    <div className="mt-3 text-[10px] text-slate-500 font-mono">
                      {tx("Smoothing: 24h background window")}
                    </div>
                  </div>

                  {/* Step 2: Storage */}
                  <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d] relative">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">
                      {tx("STAGE 02")}
                    </div>
                    <div className="text-sm font-bold text-white mb-1">
                      {tx("OneLake Medallion")}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {tx(
                        "Multi-tenant Delta Parquet tables split across Bronze, Silver clean, and Gold curated business views.",
                      )}
                    </p>
                    <div className="mt-3 text-[10px] text-slate-500 font-mono">
                      {tx("Storage: Pure SaaS Lakehouse")}
                    </div>
                  </div>

                  {/* Step 3: Compute */}
                  <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d] relative">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">
                      {tx("STAGE 03")}
                    </div>
                    <div className="text-sm font-bold text-white mb-1">
                      {tx("Apache Spark")}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {activeScenario.inputs.sparkComputeInput.totalNodes}
                      {" " + tx("worker nodes \u00D7")}{" "}
                      {activeScenario.inputs.sparkComputeInput.vCoresPerNode}
                      {" " + tx("vCores running")}{" "}
                      {
                        activeScenario.inputs.sparkComputeInput
                          .dailyRuntimeHours
                      }
                      {" " + tx("hours/day.")}
                    </p>
                    <div className="mt-3 text-[10px] text-slate-500 font-mono">
                      {tx("2:1 vCore-to-CU baseline")}
                    </div>
                  </div>

                  {/* Step 4: Semantic & Consumption */}
                  <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d] relative">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">
                      {tx("STAGE 04")}
                    </div>
                    <div className="text-sm font-bold text-white mb-1">
                      {tx("Direct Lake / PBI")}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {tx("Direct Lake semantic caching serving")}{" "}
                      {activeScenario.inputs.powerBiInput.peakConcurrentUsers}
                      {" " + tx("concurrent viewers with zero import latency.")}
                    </p>
                    <div className="mt-3 text-[10px] text-slate-500 font-mono">
                      {tx("Smoothing: 5m interactive window")}
                    </div>
                  </div>
                </div>

                {/* Architecture Planner Shortcut */}
                <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-300">
                    {tx(
                      "Want to customize detailed flow nodes, shortcut links, and network security boundaries?",
                    )}
                  </div>
                  <Link
                    to="/architecture/planner"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition"
                  >
                    <span>{tx("Open Architecture Planner")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Phase 7 Telemetry Observability */}
          {activeTab === "observability" && activeScenario && evalData && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#21262d] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {tx("Phase 7 Subsystem")}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        {tx("100% In-Browser Local")}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {tx("Capacity Observability & Telemetry Diagnostics")}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {tx("Correlate your planned scenario (")}
                      {tx(String(activeScenario.name ?? ""))}
                      {tx(
                        ") with measured Microsoft Fabric telemetry, 24-hour background smoothing curves, and throttling risk.",
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to="/observability"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition shadow-sm"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>{tx("Open Full Observability Studio")}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Dataset switcher */}
                <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">
                      {tx("Sample Stress Profile:")}
                    </span>
                    <button
                      onClick={() => setTelemetryDataset("medallion")}
                      className={`px-2.5 py-1 rounded border font-medium transition ${
                        telemetryDataset === "medallion"
                          ? "bg-blue-600 text-white border-blue-500"
                          : "bg-[#162032] text-slate-300 border-[#30363d] hover:bg-[#1f2d47]"
                      }`}
                    >
                      {tx("Medallion Lakehouse (F64 Healthy)")}
                    </button>
                    <button
                      onClick={() => setTelemetryDataset("throttled")}
                      className={`px-2.5 py-1 rounded border font-medium transition ${
                        telemetryDataset === "throttled"
                          ? "bg-red-600 text-white border-red-500"
                          : "bg-[#162032] text-slate-300 border-[#30363d] hover:bg-[#1f2d47]"
                      }`}
                    >
                      {tx("Morning Throttling Surge (F32)")}
                    </button>
                    <button
                      onClick={() => setTelemetryDataset("spark")}
                      className={`px-2.5 py-1 rounded border font-medium transition ${
                        telemetryDataset === "spark"
                          ? "bg-amber-600 text-white border-amber-500"
                          : "bg-[#162032] text-slate-300 border-[#30363d] hover:bg-[#1f2d47]"
                      }`}
                    >
                      {tx("Continuous Spark Burn (F16)")}
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {telemetrySummary.validRecords}
                    {" " + tx("telemetry events (")}
                    {telemetrySummary.timeRange.durationHours}
                    {tx("h window)")}
                  </span>
                </div>

                {/* Reality Check Comparison Banner */}
                {(() => {
                  const comparison = compareTelemetryWithScenario(
                    telemetrySummary,
                    evalData.targetSkuRecommendation.safeSkuName,
                  );
                  return (
                    <div className="p-4 rounded-xl bg-[#11192e] border border-[#21262d] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {tx("Scenario Reality Check")}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                            comparison.fitAssessment === "Optimal"
                              ? "bg-emerald-950/40 text-emerald-300 border-emerald-800"
                              : comparison.fitAssessment ===
                                  "Critical Throttling Risk"
                                ? "bg-red-950/40 text-red-300 border-red-800"
                                : "bg-amber-950/40 text-amber-300 border-amber-800"
                          }`}
                        >
                          {comparison.fitAssessment}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-1">
                        <div>
                          <span className="text-slate-500 block">
                            {tx("Planned SKU Sizing:")}
                          </span>
                          <span className="font-bold text-white text-sm">
                            {comparison.scenarioSku} ({comparison.scenarioSkuCu}
                            {" " + tx("CUs)")}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">
                            {tx("Observed Smoothed Peak:")}
                          </span>
                          <span className="font-bold text-cyan-300 text-sm">
                            {comparison.observedSmoothedPeakCu} CUs
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">
                            {tx("Capacity Utilization:")}
                          </span>
                          <span className="font-bold text-white text-sm">
                            {comparison.utilizationPercent}
                            {tx("% (Headroom:") + " "}
                            {comparison.headroomPercent}%)
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">
                            {tx("Throttling Incidents:")}
                          </span>
                          <span
                            className={`font-bold text-sm ${telemetrySummary.throttlingEventsCount > 0 ? "text-red-400" : "text-emerald-400"}`}
                          >
                            {telemetrySummary.throttlingEventsCount}
                            {" " + tx("recorded")}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 border-t border-[#21262d] pt-2 leading-relaxed">
                        <strong>{tx("Engineering Guidance:")}</strong>{" "}
                        {comparison.recommendation}
                      </p>
                    </div>
                  );
                })()}

                {/* Hourly Smoothing Timeline Chart */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      {tx("Hourly CU Consumption & 24-hr Smoothing Curve")}
                    </span>
                    <span className="text-slate-400">
                      {tx("Limit:") + " "}
                      {evalData.targetSkuRecommendation.safeSkuCu} CUs
                    </span>
                  </div>
                  <div className="h-64 w-full bg-[#11192e] p-3 rounded-xl border border-[#21262d]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={telemetrySummary.hourlyTimeSeries}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#21262d"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="hour"
                          stroke="#64748b"
                          fontSize={10}
                          tickFormatter={(val) => {
                            const parts = val.split(" ");
                            return parts.length > 1
                              ? parts[1].replace(":00 UTC", "h")
                              : val;
                          }}
                        />
                        <YAxis
                          stroke="#64748b"
                          fontSize={11}
                          domain={[0, "auto"]}
                        />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              return (
                                <div className="bg-[#0f172a] border border-[#21262d] p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                                  <div className="font-bold text-white">
                                    {label}
                                  </div>
                                  <div className="text-blue-400">
                                    {tx("Background:") + " "}
                                    {d.backgroundCu} CU
                                  </div>
                                  <div className="text-emerald-400">
                                    {tx("Interactive:") + " "}
                                    {d.interactiveCu} CU
                                  </div>
                                  <div className="text-amber-400 font-semibold">
                                    {tx("Smoothed:") + " "}
                                    {d.smoothedCu} CU
                                  </div>
                                  {d.throttled && (
                                    <div className="text-red-400 font-bold">
                                      {tx("Throttling Detected")}
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
                        />
                        <Area
                          type="monotone"
                          dataKey="interactiveCu"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.4}
                        />
                        <Area
                          type="monotone"
                          dataKey="smoothedCu"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          fill="none"
                        />
                        <ReferenceLine
                          y={evalData.targetSkuRecommendation.safeSkuCu}
                          stroke="#ef4444"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Consuming Artifacts Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      {tx("Top Consuming Artifacts")}
                    </span>
                    <Link
                      to="/observability"
                      className="text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>{tx("View All & Upload Custom CSV")}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {telemetrySummary.topConsumers
                      .slice(0, 4)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#11192e] rounded-xl border border-[#21262d] space-y-1"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono text-[10px] text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/50">
                              {item.itemKind}
                            </span>
                            <span className="font-bold text-white">
                              {item.percentage}%
                            </span>
                          </div>
                          <div
                            className="text-xs font-semibold text-white truncate"
                            title={item.itemName}
                          >
                            {item.itemName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {item.cuHours}
                            {" " + tx("CU-h consumed (")}
                            {item.operationCount}
                            {" " + tx("ops)")}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right-Hand Contextual Assumptions Drawer */}
        {showAssumptions && (
          <aside className="lg:w-80 shrink-0 bg-[#0f172a] rounded-2xl border border-[#21262d] p-5 space-y-4 self-start sticky top-36">
            <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>{tx("Assumptions & Methodology")}</span>
              </h3>
              <button
                onClick={() => setShowAssumptions(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
                title={tx("Close panel")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <strong className="text-cyan-300 block mb-1">
                  {tx("Deterministic Calculation Engine:")}
                </strong>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {tx(
                    "All estimates are derived deterministically using documented formulas without speculative AI invented sizing.",
                  )}
                </p>
              </div>

              <div>
                <strong className="text-cyan-300 block mb-1">
                  {tx("Pricing Provenance:")}
                </strong>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {tx(
                    "Base rate: $0.1800/CU/hour PAYG in US East / US West. 1-Year Reserved Instance discount applies ~41% reduction. Source: Microsoft Fabric Azure Pricing.",
                  )}
                </p>
              </div>

              <div>
                <strong className="text-cyan-300 block mb-1">
                  {tx("Smoothing Windows:")}
                </strong>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {tx(
                    "Background compute operations (Spark, Data Factory) smooth over 24 hours. Interactive operations (DAX queries) smooth over 5 minutes.",
                  )}
                </p>
              </div>

              <div>
                <strong className="text-cyan-300 block mb-1">
                  {tx("Sizing Buffer:")}
                </strong>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {tx(
                    "Safe SKU recommendations incorporate a +50% headroom buffer to prevent operational throttling under concurrency spikes.",
                  )}
                </p>
              </div>

              <div className="pt-3 border-t border-[#21262d]">
                <strong className="text-amber-400 block mb-1 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{tx("Model Limitations:")}</span>
                </strong>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {tx(
                    "Calculations represent preliminary architectural estimates. Actual production consumption must be validated against real metrics using the Microsoft Fabric Capacity Metrics App.",
                  )}
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* MODAL 1: Create New Scenario */}
      {showNewModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <div className="bg-[#0f172a] border border-[#21262d] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {tx("Create New Scenario")}
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {tx("Scenario Name")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={tx("e.g., Marketing Lakehouse Phase 2")}
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  className="w-full bg-[#11192e] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <p className="text-xs text-slate-400">
                {tx(
                  "New scenarios initialize with standard baseline parameters and are saved locally in browser storage.",
                )}
              </p>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#162032] hover:bg-[#1f2d47] text-slate-300 text-xs font-medium"
                >
                  {tx("Cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
                >
                  {tx("Create Scenario")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Import Scenario JSON */}
      {showImportModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <div className="bg-[#0f172a] border border-[#21262d] rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                <span>{tx("Import Scenario JSON")}</span>
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {tx("Select JSON File")}
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {tx("Or Paste Valid Scenario JSON")}
                </label>
                <textarea
                  rows={6}
                  value={importJsonText}
                  onChange={(e) => {
                    setImportJsonText(e.target.value);
                    setImportError(null);
                  }}
                  placeholder={tx(
                    '{"name": "Custom Model", "inputs": { ... }}',
                  )}
                  className="w-full bg-[#11192e] border border-[#30363d] rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {importError && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{importError}</span>
                </div>
              )}

              <p className="text-[11px] text-slate-400">
                {tx(
                  "All imported data is strictly sanitized and validated against the Fabric Master v4.0 Zod schema. Scripts or unauthorized metadata tags are automatically stripped.",
                )}
              </p>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#162032] hover:bg-[#1f2d47] text-slate-300 text-xs font-medium"
                >
                  {tx("Cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
                >
                  {tx("Validate & Import")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
