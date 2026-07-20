import React, { useState } from "react";
import { Sparkles, MessageSquare, Send, Bot, User, CheckCircle2, ArrowRight, Zap, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; path: string }[];
}

export function FabricAIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hello! I am your Microsoft Fabric AI Advisor. Ask me anything about capacity planning, SKU selection (F2 to F2048), Reserved Instance savings, Spark sizing, Power BI throttling mitigation, or Synapse migration.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: "Run Capacity Calculator", path: "/wizard" },
        { label: "Compare F32 vs F64", path: "/compare/f32-vs-f64" },
        { label: "Explore F64 Pricing", path: "/fsku/f64" }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const predefinedPrompts = [
    "Which SKU should I choose for 150 users?",
    "How much does F64 cost with Reserved Capacity?",
    "Should I buy Reserved Instances or Pay-As-You-Go?",
    "How much Spark compute do I need for 500GB ETL?",
    "How do I prevent Power BI report throttling?",
    "How do I migrate from Azure Synapse to Fabric?"
  ];

  const handleSend = (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || isGenerating) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsGenerating(true);

    // Simulate intelligent domain response based on query
    setTimeout(() => {
      let aiText = "";
      let actions: { label: string; path: string }[] = [];
      const lower = queryText.toLowerCase();

      if (lower.includes("150 users") || lower.includes("sku should i choose")) {
        aiText = "For 150 concurrent Power BI users, **F64** (64 Capacity Units) is highly recommended. F64 is the minimum SKU that enables free Power BI report viewing for your 150 users without requiring individual Power BI Pro licenses for everyone, saving significant licensing costs.";
        actions = [
          { label: "Launch Capacity Calculator", path: "/wizard" },
          { label: "View F64 Specification Page", path: "/fsku/f64" }
        ];
      } else if (lower.includes("reserved") || lower.includes("cost") || lower.includes("pay-as-you-go")) {
        aiText = "1-Year Reserved Instances offer approximately **41% savings** compared to Pay-As-You-Go. For example, F64 drops from $8,409.60/mo (PAYG) to $4,961.66/mo (Reserved), saving $41,375 annually per capacity.";
        actions = [
          { label: "Calculate Reserved Savings", path: "/reserved-savings" },
          { label: "View Pricing Matrices", path: "/pricing" }
        ];
      } else if (lower.includes("spark") || lower.includes("etl")) {
        aiText = "For 500GB daily ETL using Apache Spark, allocate at least **F16 or F32**. Make sure to enable Spark Auto-Scaling with Small (4 vCore) or Medium (8 vCore) nodes and configure automatic cluster termination to minimize idle CU usage.";
        actions = [
          { label: "Spark CU Estimator", path: "/spark-estimator" },
          { label: "Spark Optimization Guide", path: "/docs/optimizing-spark-workloads" }
        ];
      } else if (lower.includes("throttling") || lower.includes("power bi")) {
        aiText = "Throttling occurs when peak query demand exceeds your capacity limits. To mitigate throttling: 1) Convert DirectQuery datasets to Direct Lake mode, 2) Optimize DAX measures, and 3) Utilize 24-hour background smoothing window for non-interactive ETL.";
        actions = [
          { label: "Power BI Capacity Estimator", path: "/power-bi-capacity" },
          { label: "Throttling Guide", path: "/docs/fabric-throttling-mechanisms" }
        ];
      } else if (lower.includes("synapse") || lower.includes("migrate")) {
        aiText = "When migrating from Azure Synapse: Dedicated SQL Pools map smoothly to Fabric Data Warehouses (T-SQL compatible), while Synapse Spark notebooks map to Fabric Lakehouse Spark items. Storage moves to OneLake Delta Parquet.";
        actions = [
          { label: "Synapse vs Fabric Comparison", path: "/compare/synapse-vs-fabric" },
          { label: "Migration Guide", path: "/docs/migrating-to-fabric" }
        ];
      } else {
        aiText = `Based on your request regarding "${queryText}", Microsoft Fabric capacities scale smoothly from F2 (2 CUs) up to F2048 (2048 CUs). I recommend using our Capacity Calculator to model your exact Data Factory, Spark, and Power BI workloads.`;
        actions = [
          { label: "Run Full Capacity Calculator", path: "/wizard" },
          { label: "F-SKU Matrix", path: "/fsku/f64" }
        ];
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: actions
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="w-full bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#58a6ff]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-[#e6edf3] flex items-center gap-2">
              Fabric AI Advisor
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/30 font-medium">v3.0 Advisor</span>
            </h3>
            <p className="text-xs text-[#8b949e]">Real-time Microsoft Fabric SKU, FinOps, and Architecture Guidance</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "ai" && (
              <div className="w-8 h-8 rounded-full bg-[#0d1117] border border-[#30363d] text-[#58a6ff] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[82%] space-y-2`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.sender === "user" 
                  ? "bg-[#1f6feb] text-white rounded-tr-none" 
                  : "bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-tl-none"
              }`}>
                <div>{msg.text}</div>
                <div className={`text-[10px] mt-1.5 ${msg.sender === "user" ? "text-blue-100 text-right" : "text-[#8b949e]"}`}>
                  {msg.timestamp}
                </div>
              </div>

              {/* Action Buttons */}
              {msg.suggestedActions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.suggestedActions.map(act => (
                    <a
                      key={act.label}
                      href={act.path}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-[#58a6ff] hover:bg-[#30363d] transition-colors flex items-center gap-1.5"
                    >
                      {act.label}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-[#1f6feb] text-white flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex gap-3 items-center text-xs text-[#8b949e] animate-pulse py-2">
            <Bot className="w-4 h-4 text-[#58a6ff]" />
            Fabric AI Advisor is analyzing workload equations...
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="pt-3 border-t border-[#30363d] mt-3">
        <div className="text-[11px] font-semibold uppercase text-[#8b949e] mb-2">Popular Questions:</div>
        <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto custom-scrollbar mb-3">
          {predefinedPrompts.map(p => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              className="text-xs px-2.5 py-1 rounded-md bg-[#0d1117] border border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#58a6ff] transition-all text-left truncate max-w-xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about SKU selection, pricing, Spark, throttling, or Synapse..."
            className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isGenerating}
            className="p-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-medium transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
