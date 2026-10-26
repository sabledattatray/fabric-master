import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Layers,
  Database,
  Server,
  Activity,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  FolderDown,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Eye,
  Sliders,
  ArrowRight,
  X,
  FileCode,
  Share2
} from "lucide-react";
import {
  ArchitectureDiagram,
  ArchitectureNode,
  ArchitectureConnection,
  REFERENCE_ARCHITECTURE_TEMPLATES,
  AVAILABLE_COMPONENT_CATALOG,
  validateArchitecture,
  getSavedDiagrams,
  saveDiagramToStorage,
  exportDiagramAsJSON,
  exportDiagramAsSVG
} from "../lib/architecture";

export function ArchitecturePlanner() {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>("medallion-lakehouse");
  const [currentDiagram, setCurrentDiagram] = useState<ArchitectureDiagram>(
    REFERENCE_ARCHITECTURE_TEMPLATES["medallion-lakehouse"]
  );
  const [isAccessibleView, setIsAccessibleView] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showValidationDrawer, setShowValidationDrawer] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Node State
  const [newNodeLabel, setNewNodeLabel] = useState<string>("");
  const [newNodeCategoryIndex, setNewNodeCategoryIndex] = useState<number>(0);

  // Load from local storage or default template
  useEffect(() => {
    const template = REFERENCE_ARCHITECTURE_TEMPLATES[selectedTemplateKey];
    if (template) {
      setCurrentDiagram(template);
    }
  }, [selectedTemplateKey]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const validationResult = useMemo(() => {
    return validateArchitecture(currentDiagram.nodes, currentDiagram.connections);
  }, [currentDiagram]);

  const handleSelectTemplate = (key: string) => {
    setSelectedTemplateKey(key);
    const tmpl = REFERENCE_ARCHITECTURE_TEMPLATES[key];
    if (tmpl) {
      setCurrentDiagram(tmpl);
      saveDiagramToStorage(tmpl);
      showToast(`Loaded template: ${tmpl.name}`);
    }
  };

  const handleReset = () => {
    const tmpl = REFERENCE_ARCHITECTURE_TEMPLATES[selectedTemplateKey];
    if (tmpl) {
      setCurrentDiagram(tmpl);
      saveDiagramToStorage(tmpl);
      showToast("Reset architecture diagram to default template.");
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    const updatedNodes = currentDiagram.nodes.filter((n) => n.id !== nodeId);
    const updatedConnections = currentDiagram.connections.filter(
      (c) => c.from !== nodeId && c.to !== nodeId
    );
    const updatedDiagram: ArchitectureDiagram = {
      ...currentDiagram,
      nodes: updatedNodes,
      connections: updatedConnections,
      updatedAt: new Date().toISOString(),
    };
    setCurrentDiagram(updatedDiagram);
    saveDiagramToStorage(updatedDiagram);
    showToast("Component removed from canvas.");
  };

  const handleAddComponent = (e: React.FormEvent) => {
    e.preventDefault();
    const catalogItem = AVAILABLE_COMPONENT_CATALOG[newNodeCategoryIndex];
    if (!catalogItem) return;

    const label = newNodeLabel.trim() || catalogItem.label;
    const newNode: ArchitectureNode = {
      id: `node-${Date.now()}`,
      label,
      category: catalogItem.category,
      serviceName: catalogItem.serviceName,
      description: catalogItem.description,
      tier: catalogItem.tier,
    };

    const updatedDiagram: ArchitectureDiagram = {
      ...currentDiagram,
      nodes: [...currentDiagram.nodes, newNode],
      updatedAt: new Date().toISOString(),
    };

    setCurrentDiagram(updatedDiagram);
    saveDiagramToStorage(updatedDiagram);
    setShowAddModal(false);
    setNewNodeLabel("");
    showToast(`Added component "${label}" to canvas.`);
  };

  // Group nodes by tier (1 to 6)
  const tiers = useMemo(() => {
    const map: Record<number, ArchitectureNode[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    currentDiagram.nodes.forEach((n) => {
      const t = n.tier || 1;
      if (!map[t]) map[t] = [];
      map[t].push(n);
    });
    return map;
  }, [currentDiagram.nodes]);

  const tierTitles: Record<number, { title: string; subtitle: string; icon: any; color: string }> = {
    1: { title: "01. Data Sources", subtitle: "Transactional OLTP & Streaming", icon: Server, color: "text-slate-400" },
    2: { title: "02. Ingestion", subtitle: "Pipelines, CDC & Eventstreams", icon: Activity, color: "text-blue-400" },
    3: { title: "03. OneLake Storage", subtitle: "Lakehouse, Warehouse & KQL", icon: Database, color: "text-cyan-400" },
    4: { title: "04. Processing", subtitle: "Spark Compute & SQL Engine", icon: Sparkles, color: "text-purple-400" },
    5: { title: "05. Analytics", subtitle: "Direct Lake & Power BI", icon: LayoutDashboard, color: "text-emerald-400" },
    6: { title: "06. Governance", subtitle: "Purview Lineage & Security", icon: ShieldCheck, color: "text-amber-400" },
  };

  return (
    <div className="min-h-screen bg-[#080F1D] text-[#F0F6FC]">
      <Helmet>
        <title>Architecture Studio | Microsoft Fabric Reference Designer | Fabric Master v4.0</title>
        <meta
          name="description"
          content="Interactive Microsoft Fabric architecture designer. Build, validate, and export Medallion Lakehouses, Direct Lake semantic models, and real-time eventstream topologies."
        />
        <link rel="canonical" href="https://fabric.dattasable.com/architecture/planner" />
      </Helmet>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-6 z-50 px-4 py-3 rounded-lg bg-[#0d1f38] border border-cyan-500/50 text-cyan-200 text-sm font-medium shadow-2xl flex items-center space-x-2"
        >
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Studio Header */}
      <header className="border-b border-[#21262d] bg-[#0b1329] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Design Studio
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
                v4.0 Visual Canvas
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Microsoft Fabric Architecture Studio</span>
            </h1>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Template Selector */}
            <div className="relative">
              <label htmlFor="template-select" className="sr-only">
                Select Reference Template
              </label>
              <select
                id="template-select"
                value={selectedTemplateKey}
                onChange={(e) => handleSelectTemplate(e.target.value)}
                className="bg-[#11192e] border border-[#30363d] text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(REFERENCE_ARCHITECTURE_TEMPLATES).map(([key, t]) => (
                  <option key={key} value={key}>
                    Template: {t.name.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Node</span>
            </button>

            <button
              onClick={() => exportDiagramAsSVG(currentDiagram)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#162032] hover:bg-[#1f2d47] border border-[#30363d] text-cyan-300 text-xs font-medium transition"
              title="Download architecture diagram as SVG image"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Export SVG</span>
            </button>

            <button
              onClick={() => exportDiagramAsJSON(currentDiagram)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#162032] hover:bg-[#1f2d47] border border-[#30363d] text-slate-300 text-xs font-medium transition"
              title="Download architecture diagram as JSON"
            >
              <FolderDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-1.5 px-2.5 py-2 rounded-lg bg-[#162032] hover:bg-[#1f2d47] border border-[#30363d] text-slate-300 text-xs font-medium transition"
              title="Reset diagram to baseline template"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => setIsAccessibleView(!isAccessibleView)}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition ${
                isAccessibleView
                  ? "bg-purple-600/20 border-purple-500 text-purple-300"
                  : "bg-[#162032] border-[#30363d] text-slate-300 hover:bg-[#1f2d47]"
              }`}
              title="Toggle accessible tabular / screen reader view"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAccessibleView ? "Visual Canvas" : "Accessible View"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Template Overview Banner */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#21262d] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                ACTIVE TOPOLOGY
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentDiagram.nodes.length} Components • {currentDiagram.connections.length} Pipeline Flows
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentDiagram.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              {currentDiagram.description}
            </p>
          </div>

          {/* Validation Score Pill */}
          <div className="flex items-center space-x-3 shrink-0">
            <div
              className={`p-4 rounded-xl border flex items-center space-x-3 ${
                validationResult.valid
                  ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                  : "bg-amber-950/20 border-amber-500/40 text-amber-300"
              }`}
            >
              {validationResult.valid ? (
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
              )}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  Architecture Score
                </div>
                <div className="text-2xl font-black">{validationResult.score} / 100</div>
              </div>
            </div>
          </div>
        </div>

        {/* VIEW 1: Visual Interactive Architecture Canvas */}
        {!isAccessibleView && (
          <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-[#21262d] space-y-6 overflow-x-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#21262d]">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                End-to-End Microsoft Fabric Pipeline Flow
              </span>
              <span className="text-xs text-slate-500">
                Left-to-Right: Data Ingestion → OneLake Lakehouse → Semantic Consumption
              </span>
            </div>

            {/* 6-Tier Visual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 min-w-[900px]">
              {[1, 2, 3, 4, 5, 6].map((tierNum) => {
                const tierInfo = tierTitles[tierNum];
                const TierIcon = tierInfo.icon;
                const nodeList = tiers[tierNum] || [];

                return (
                  <div
                    key={tierNum}
                    className="p-3.5 rounded-xl bg-[#0f172a] border border-[#21262d] flex flex-col space-y-3 min-h-[360px]"
                  >
                    {/* Tier Column Header */}
                    <div className="pb-2 border-b border-[#21262d]">
                      <div className="flex items-center space-x-2">
                        <TierIcon className={`w-4 h-4 ${tierInfo.color}`} />
                        <h3 className="text-xs font-bold text-white tracking-tight">{tierInfo.title}</h3>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
                        {tierInfo.subtitle}
                      </span>
                    </div>

                    {/* Nodes in this Tier */}
                    <div className="flex-1 space-y-3">
                      {nodeList.length === 0 ? (
                        <div className="h-full flex items-center justify-center p-4 border border-dashed border-[#21262d] rounded-lg text-center">
                          <span className="text-[11px] text-slate-500 italic">No components</span>
                        </div>
                      ) : (
                        nodeList.map((node) => (
                          <div
                            key={node.id}
                            className="p-3 rounded-lg bg-[#11192e] border border-[#30363d] hover:border-cyan-500/50 transition-all duration-200 group relative shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                                {node.label}
                              </span>
                              <button
                                onClick={() => handleDeleteNode(node.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-0.5 rounded transition"
                                title="Remove node"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="text-[10px] font-mono text-cyan-400/90 block mt-1">
                              {node.serviceName}
                            </span>

                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed line-clamp-3">
                              {node.description}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Connections List Strip */}
            <div className="pt-4 border-t border-[#21262d] space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-cyan-400" />
                <span>Configured Data Pipeline Lineage & Connections ({currentDiagram.connections.length})</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
                {currentDiagram.connections.map((c, idx) => {
                  const fromNode = currentDiagram.nodes.find((n) => n.id === c.from);
                  const toNode = currentDiagram.nodes.find((n) => n.id === c.to);
                  return (
                    <div
                      key={idx}
                      className="p-2 rounded bg-[#11192e] border border-[#21262d] text-[11px] flex flex-col justify-between"
                    >
                      <div className="flex items-center space-x-1.5 text-slate-300">
                        <strong className="text-cyan-300 truncate">{fromNode?.label || c.from}</strong>
                        <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                        <strong className="text-emerald-300 truncate">{toNode?.label || c.to}</strong>
                      </div>
                      {c.label && (
                        <span className="text-[10px] text-slate-500 font-mono mt-1 italic">
                          {c.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Screen-Reader Accessible Outline View */}
        {isAccessibleView && (
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#21262d] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
              <div>
                <h3 className="text-base font-bold text-white">Accessible Component Architecture Matrix</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Semantic table formatted for keyboard navigation and screen readers.
                </p>
              </div>
              <button
                onClick={() => setIsAccessibleView(false)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                Switch back to Visual Canvas
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#21262d]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#11192e] text-slate-400 uppercase tracking-wider font-semibold border-b border-[#21262d]">
                  <tr>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4">Component Label</th>
                    <th className="py-3 px-4">Fabric Service</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Connected Outputs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#21262d]">
                  {currentDiagram.nodes.map((node) => {
                    const outputs = currentDiagram.connections
                      .filter((c) => c.from === node.id)
                      .map((c) => {
                        const target = currentDiagram.nodes.find((n) => n.id === c.to);
                        return target ? target.label : c.to;
                      });

                    return (
                      <tr key={node.id} className="hover:bg-[#162032] transition">
                        <td className="py-3 px-4 font-mono font-semibold text-cyan-400">
                          Tier 0{node.tier}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">{node.label}</td>
                        <td className="py-3 px-4 font-mono text-slate-300">{node.serviceName}</td>
                        <td className="py-3 px-4 capitalize text-slate-400">{node.category}</td>
                        <td className="py-3 px-4 text-slate-300">{node.description}</td>
                        <td className="py-3 px-4 text-slate-400">
                          {outputs.length > 0 ? outputs.join(", ") : "None (Terminal Consumer)"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Architecture Validation & Rule Verification Section */}
        {showValidationDrawer && (
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#21262d] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Automated Architecture Rule Checks & Health Audit
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {validationResult.issues.length} Findings
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {validationResult.recommendation}
            </p>

            <div className="space-y-2.5 pt-1">
              {validationResult.issues.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>All architecture checks passed. Clean data flow from ingestion to semantic reporting.</span>
                </div>
              ) : (
                validationResult.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-3.5 rounded-xl border text-xs flex items-start space-x-3 ${
                      issue.severity === "error"
                        ? "bg-red-950/20 border-red-500/40 text-red-200"
                        : issue.severity === "warning"
                        ? "bg-amber-950/20 border-amber-500/40 text-amber-200"
                        : "bg-blue-950/20 border-blue-500/40 text-blue-200"
                    }`}
                  >
                    {issue.severity === "error" && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                    {issue.severity === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                    {issue.severity === "info" && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}

                    <div className="space-y-1">
                      <div className="font-bold">{issue.message}</div>
                      <div className="text-[11px] opacity-90">
                        <strong>Remediation:</strong> {issue.remediation}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Prerequisites, Governance & Reference Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#21262d] space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Implementation Prerequisites</span>
            </h3>
            <ul className="space-y-2 pt-1 text-xs text-slate-300">
              {currentDiagram.prerequisites.map((p, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-mono font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#21262d] space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Governance & Security Guidance</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {currentDiagram.governanceNotes}
            </p>
            <div className="pt-2">
              <a
                href="https://learn.microsoft.com/en-us/fabric/governance/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-cyan-400 hover:underline"
              >
                <span>Read Microsoft Fabric Governance Documentation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Modal: Add New Component */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <div className="bg-[#0f172a] border border-[#21262d] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Add Component from Catalog</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddComponent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Select Fabric Component Template
                </label>
                <select
                  value={newNodeCategoryIndex}
                  onChange={(e) => setNewNodeCategoryIndex(Number(e.target.value))}
                  className="w-full bg-[#11192e] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {AVAILABLE_COMPONENT_CATALOG.map((item, idx) => (
                    <option key={idx} value={idx}>
                      [Tier 0{item.tier}] {item.label} ({item.serviceName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Custom Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder={AVAILABLE_COMPONENT_CATALOG[newNodeCategoryIndex]?.label}
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  className="w-full bg-[#11192e] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                {AVAILABLE_COMPONENT_CATALOG[newNodeCategoryIndex]?.description}
              </p>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#162032] hover:bg-[#1f2d47] text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
                >
                  Add to Canvas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
