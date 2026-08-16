import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Waves, Database, LayoutDashboard, DatabaseZap, Workflow, Activity } from "lucide-react";
import { ArchitectureNode } from "../lib/fabric/architecture/types";

// Mock data for the visualizer
const MOCK_NODES: ArchitectureNode[] = [
  { id: "bronze", label: "Bronze Lakehouse", type: "lakehouse", layer: "bronze", description: "Raw data ingestion layer." },
  { id: "silver", label: "Silver Lakehouse", type: "lakehouse", layer: "silver", description: "Cleaned and conformed data." },
  { id: "gold", label: "Gold Warehouse", type: "warehouse", layer: "gold", description: "Business-level aggregates and dimensions." },
  { id: "semantic", label: "Core Semantic Model", type: "semantic-model", layer: "serving", description: "Direct Lake semantic model for BI." },
  { id: "realtime", label: "Eventhouse", type: "kql-database", layer: "bronze", description: "Streaming telemetry data." }
];

export function OneLakeVisualizer() {
  const { t } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);

  const getIconForType = (type: string) => {
    switch (type) {
      case "lakehouse": return <Database className="w-8 h-8 text-[#3fb950]" />;
      case "warehouse": return <DatabaseZap className="w-8 h-8 text-[#58a6ff]" />;
      case "semantic-model": return <LayoutDashboard className="w-8 h-8 text-[#a371f7]" />;
      case "kql-database": return <Activity className="w-8 h-8 text-[#d29922]" />;
      default: return <Workflow className="w-8 h-8 text-[#8b949e]" />;
    }
  };

  const getColorForLayer = (layer: string) => {
    switch (layer) {
      case "bronze": return "border-[#d29922]/40 bg-[#d29922]/10";
      case "silver": return "border-[#8b949e]/40 bg-[#8b949e]/10";
      case "gold": return "border-[#e3b341]/40 bg-[#e3b341]/10";
      case "serving": return "border-[#a371f7]/40 bg-[#a371f7]/10";
      default: return "border-[#30363d] bg-[#161b22]";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>{t("OneLake Visualizer")} | {t("Fabric Master")}</title>
        <meta name="description" content={t("Interactive logical architecture visualizer for Microsoft Fabric OneLake.")} />
        <link rel="canonical" href="https://fabric.dattasable.com/architecture/onelake" />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Waves className="w-8 h-8 text-[#1f6feb]" />
          {t("OneLake Visualizer")}
        </h1>
        <p className="text-[#8b949e]">
          {t("Explore logical relationships, shortcuts, and data flows across your Fabric workspaces.")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-2 bg-[#0d1117] border border-[#30363d] rounded-xl p-8 relative overflow-hidden min-h-[500px] shadow-2xl flex flex-col justify-center">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#58a6ff 1px, transparent 1px), linear-gradient(90deg, #58a6ff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center h-full gap-8">
            
            {/* Bronze Layer */}
            <div className="flex flex-col gap-6">
              <div className="text-xs text-center font-bold text-[#8b949e] uppercase tracking-wider mb-2">Ingestion / Bronze</div>
              {MOCK_NODES.filter(n => n.layer === "bronze").map(node => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all w-40 ${
                    selectedNode?.id === node.id ? "border-[#58a6ff] bg-[#1f6feb]/20 shadow-[0_0_15px_rgba(88,166,255,0.3)] transform scale-105" : `${getColorForLayer(node.layer)} hover:border-[#8b949e]`
                  }`}
                >
                  {getIconForType(node.type)}
                  <span className="mt-3 font-semibold text-white text-sm text-center">{node.label}</span>
                </button>
              ))}
            </div>

            {/* Silver Layer */}
            <div className="flex flex-col gap-6">
              <div className="text-xs text-center font-bold text-[#8b949e] uppercase tracking-wider mb-2">Conformed / Silver</div>
              {MOCK_NODES.filter(n => n.layer === "silver").map(node => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all w-40 ${
                    selectedNode?.id === node.id ? "border-[#58a6ff] bg-[#1f6feb]/20 shadow-[0_0_15px_rgba(88,166,255,0.3)] transform scale-105" : `${getColorForLayer(node.layer)} hover:border-[#8b949e]`
                  }`}
                >
                  {getIconForType(node.type)}
                  <span className="mt-3 font-semibold text-white text-sm text-center">{node.label}</span>
                </button>
              ))}
            </div>

            {/* Gold / Serving Layer */}
            <div className="flex flex-col gap-6">
              <div className="text-xs text-center font-bold text-[#8b949e] uppercase tracking-wider mb-2">Serving / Gold</div>
              {MOCK_NODES.filter(n => n.layer === "gold" || n.layer === "serving").map(node => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all w-40 ${
                    selectedNode?.id === node.id ? "border-[#58a6ff] bg-[#1f6feb]/20 shadow-[0_0_15px_rgba(88,166,255,0.3)] transform scale-105" : `${getColorForLayer(node.layer)} hover:border-[#8b949e]`
                  }`}
                >
                  {getIconForType(node.type)}
                  <span className="mt-3 font-semibold text-white text-sm text-center">{node.label}</span>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Details Panel */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 border-b border-[#30363d] pb-4">
            {t("Node Details")}
          </h2>
          
          {selectedNode ? (
            <div className="animate-in fade-in space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg border ${getColorForLayer(selectedNode.layer)}`}>
                  {getIconForType(selectedNode.type)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedNode.label}</h3>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#21262d] text-[#c9d1d9] border border-[#30363d] capitalize">
                    {selectedNode.type.replace("-", " ")}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-2">Description</div>
                <p className="text-[#c9d1d9] text-sm leading-relaxed">{selectedNode.description}</p>
              </div>

              <div>
                <div className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-2">Medallion Layer</div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold capitalize bg-[#1f6feb]/10 text-[#58a6ff] border border-[#1f6feb]/30">
                  {selectedNode.layer}
                </div>
              </div>

              {selectedNode.type === "lakehouse" && (
                <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] mt-4">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#3fb950]" /> OneLake Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-xs text-[#8b949e]">Delta Tables</div>
                      <div className="text-lg font-semibold text-[#c9d1d9]">142</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#8b949e]">Shortcuts</div>
                      <div className="text-lg font-semibold text-[#c9d1d9]">12</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center opacity-60">
              <Activity className="w-12 h-12 text-[#8b949e] mb-4" />
              <p className="text-[#8b949e]">{t("Select a node on the canvas to view its properties, schema, and telemetry.")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
