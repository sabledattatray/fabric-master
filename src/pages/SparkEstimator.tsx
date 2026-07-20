import React, { useState } from "react";
import { SEO } from "../components/SEO";
import { Zap, ArrowRight, Server, Calculator, CheckCircle2, HelpCircle, ShieldCheck, Clock, Layers, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { KnowledgeGraphLinks } from "../components/KnowledgeGraphLinks";

export function SparkEstimator() {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState(4);
  const [vCores, setVCores] = useState(8);
  const [hours, setHours] = useState(4);

  // Spark CU Calculation: 2 Spark vCores = 1 CU
  const totalVCores = nodes * vCores;
  const sparkCuBaseline = totalVCores * (hours / 24) * 0.5;

  const sparkFaqs = [
    {
      q: "How are Spark vCores mapped to Microsoft Fabric Capacity Units (CUs)?",
      a: "In Microsoft Fabric, 2 Spark vCores consume 1 Capacity Unit (CU). For example, a Spark job running on 8 nodes with 8 vCores each (64 vCores total) consumes 32 CUs during active execution."
    },
    {
      q: "How does 24-hour background smoothing affect Spark jobs?",
      a: "Fabric automatically background-smooths non-interactive Spark batch jobs over a 24-hour window. This means a heavy 1-hour Spark burst is distributed over 24 hours to prevent capacity throttling."
    },
    {
      q: "What is Spark Auto-Scaling in Fabric?",
      a: "Auto-scaling dynamically adds worker nodes to your Spark pool during peak shuffle/transformation stages and terminates idle nodes when job execution completes, preventing unnecessary CU drain."
    },
    {
      q: "How can I prevent Spark jobs from exceeding our capacity budget?",
      a: "Set strict maximum node boundaries in your workspace custom pool settings, enable automatic allocation termination after 2-5 minutes of inactivity, and optimize Delta Parquet table compaction."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": sparkFaqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col bg-[#0d1117] custom-scrollbar text-[#c9d1d9]">
      <SEO
        title="Microsoft Fabric Spark CU Sizing Estimator & Node Pool Planner"
        description="Estimate Capacity Units required for Apache Spark notebook & batch ETL jobs in Microsoft Fabric. Formula guidance mapping 2 Spark vCores to 1 CU."
        keywords="Microsoft Fabric Spark Estimator, Fabric Spark CU Calculator, Spark vCore to CU, Fabric Data Engineering Sizing, Spark Auto-Scaling"
        url="https://fabric.dattasable.com/spark-estimator"
        schema={[faqSchema]}
      />

      <div className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-12 space-y-12">
        {/* Header & Metadata */}
        <div className="border-b border-[#30363d] pb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d29922]/10 border border-[#d29922]/30 text-[#d29922] text-xs font-semibold">
              <Zap className="w-4 h-4" />
              Data Engineering Sizing Engine
            </div>
            <div className="flex items-center gap-3 text-xs text-[#8b949e]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#d29922]" />
                Updated July 2026
              </span>
              <span>•</span>
              <span className="font-mono text-[#e6edf3]">v3.0 Engine</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#f0f6fc]">
            Spark CU Sizing Estimator
          </h1>

          <p className="text-base md:text-lg text-[#8b949e] max-w-3xl leading-relaxed">
            Apache Spark is often the largest consumer of compute capacity in Microsoft Fabric. Calculate exact CU requirements based on nodes, vCores, and daily execution hours.
          </p>
        </div>

        {/* Interactive Spark Calculator Widget */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-8 shadow-xl">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] border-b border-[#30363d] pb-4">
            Interactive Spark Pool Calculator
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8b949e] uppercase">Total Spark Nodes</label>
              <input
                type="number"
                min="1"
                max="256"
                value={nodes}
                onChange={(e) => setNodes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-[#e6edf3] focus:outline-none focus:border-[#d29922]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8b949e] uppercase">vCores per Node</label>
              <select
                value={vCores}
                onChange={(e) => setVCores(parseInt(e.target.value))}
                className="w-full bg-[#0d1117] border border-[#30363d] text-[#d29922] font-bold text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#d29922]"
              >
                <option value={4}>Small (4 vCores)</option>
                <option value={8}>Medium (8 vCores)</option>
                <option value={16}>Large (16 vCores)</option>
                <option value={32}>X-Large (32 vCores)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8b949e] uppercase">Daily Runtime (Hours)</label>
              <input
                type="number"
                min="1"
                max="24"
                value={hours}
                onChange={(e) => setHours(Math.min(24, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-[#e6edf3] focus:outline-none focus:border-[#d29922]"
              />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#0d1117] border border-[#30363d] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-xs text-[#8b949e]">Total Spark vCores</div>
              <div className="text-3xl font-display font-bold text-[#e6edf3]">{totalVCores} vCores</div>
            </div>
            <div>
              <div className="text-xs text-[#8b949e]">Active CU Footprint</div>
              <div className="text-3xl font-display font-bold text-[#d29922]">{(totalVCores / 2).toFixed(1)} CUs</div>
            </div>
            <div>
              <div className="text-xs text-[#8b949e]">24-Hr Smoothed Baseline</div>
              <div className="text-3xl font-display font-bold text-[#3fb950]">{sparkCuBaseline.toFixed(2)} CUs</div>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/wizard"
              className="px-6 py-3 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Combine with Data Factory & Power BI →
            </Link>
          </div>
        </div>

        {/* Spark Node Sizes Reference */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#d29922]" />
            Microsoft Fabric Spark Node Configurations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-2">
              <div className="text-xs text-[#d29922] font-semibold">Small Node</div>
              <div className="text-lg font-bold text-[#e6edf3]">4 vCores / 32GB</div>
              <p className="text-xs text-[#8b949e]">Ideal for lightweight ETL and small staging transformations.</p>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-2">
              <div className="text-xs text-[#d29922] font-semibold">Medium Node</div>
              <div className="text-lg font-bold text-[#e6edf3]">8 vCores / 64GB</div>
              <p className="text-xs text-[#8b949e]">Standard choice for medallion Bronze to Silver pipelines.</p>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-2">
              <div className="text-xs text-[#d29922] font-semibold">Large Node</div>
              <div className="text-lg font-bold text-[#e6edf3]">16 vCores / 128GB</div>
              <p className="text-xs text-[#8b949e]">Heavy data shuffling, complex joins, and machine learning.</p>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-2">
              <div className="text-xs text-[#d29922] font-semibold">X-Large Node</div>
              <div className="text-lg font-bold text-[#e6edf3]">32 vCores / 256GB</div>
              <p className="text-xs text-[#8b949e]">Hyperscale multi-terabyte batch processing and real-time streaming.</p>
            </div>
          </div>
        </div>

        {/* E-E-A-T Author Spotlight */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/images/author.webp"
              alt="Datta Sable"
              className="w-16 h-16 rounded-full border-2 border-[#30363d] object-cover bg-[#0d1117] shadow-md"
            />
            <div>
              <div className="font-bold text-[#e6edf3]">Formulated by Datta Sable</div>
              <div className="text-xs text-[#58a6ff]">Microsoft Fabric Engineer & Data Platform Architect</div>
              <div className="text-xs text-[#8b949e] mt-1">Based on official Fabric Apache Spark pool capacity equations.</div>
            </div>
          </div>

          <a
            href="https://dattasable.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs text-[#e6edf3] hover:border-[#d29922] transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>Read Spark Tuning Guide on dattasable.com</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#d29922]" />
          </a>
        </div>

        {/* FAQs */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-display font-bold text-[#f0f6fc] flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#d29922]" />
            Frequently Asked Questions about Fabric Spark
          </h2>

          <div className="space-y-4">
            {sparkFaqs.map((f, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
                <div className="font-semibold text-sm text-[#e6edf3]">{f.q}</div>
                <div className="text-xs text-[#8b949e] mt-2 leading-relaxed">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <KnowledgeGraphLinks />

      <Footer />
    </div>
  );
}
