import React from 'react';

export function PlanningAssumptions() {
  return (
    <aside
      className="mx-auto max-w-5xl px-6 py-5 text-xs sm:text-sm leading-relaxed border-b border-[#30363d] dark:border-[#30363d] light:border-[#E2E8F0] text-[#8b949e] dark:text-[#8b949e] light:text-[#475569] bg-[#161b22]/40 dark:bg-[#161b22]/40 light:bg-white"
      aria-label="Planning assumptions and pricing provenance"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-[#30363d]/60 dark:border-[#30363d]/60 light:border-[#E2E8F0] text-xs">
        <span className="font-semibold text-[#c9d1d9] dark:text-[#c9d1d9] light:text-[#0F172A] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
          Pricing Provenance & Methodology: US East Baseline ($0.18/CU/hr PAYG, ~41% 1-Year RI)
        </span>
        <span className="text-[#8b949e] dark:text-[#8b949e] light:text-[#64748B] font-mono text-[11px]">
          Last Verified: October 2026
        </span>
      </div>
      <p className="text-xs text-[#8b949e] dark:text-[#8b949e] light:text-[#475569] leading-relaxed">
        Independent planning estimates based on published architectural models—not an official Microsoft commercial quote or measured capacity guarantee. Actual utilization depends on concurrency, semantic model complexity, and active smoothing windows (24h background, 5m interactive). Paid F2 or higher may qualify for Copilot subject to tenant and regional availability; organizational free-viewer Power BI licensing requires a separate minimum threshold of F64.
      </p>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <a
          className="text-[#3B82F6] dark:text-[#58a6ff] light:text-[#2563EB] hover:underline font-medium"
          href="https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official Azure Fabric Pricing
        </a>
        <span className="text-[#30363d] dark:text-[#30363d] light:text-[#CBD5E1]">•</span>
        <a
          className="text-[#3B82F6] dark:text-[#58a6ff] light:text-[#2563EB] hover:underline font-medium"
          href="https://learn.microsoft.com/en-us/fabric/fundamentals/copilot-fabric-overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          Copilot Requirements
        </a>
        <span className="text-[#30363d] dark:text-[#30363d] light:text-[#CBD5E1]">•</span>
        <a
          className="text-[#3B82F6] dark:text-[#58a6ff] light:text-[#2563EB] hover:underline font-medium"
          href="https://learn.microsoft.com/en-us/fabric/enterprise/licenses"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fabric Licensing Guide
        </a>
        <span className="text-[#30363d] dark:text-[#30363d] light:text-[#CBD5E1]">•</span>
        <a
          className="text-[#3B82F6] dark:text-[#58a6ff] light:text-[#2563EB] hover:underline font-medium"
          href="https://learn.microsoft.com/en-us/fabric/enterprise/throttling"
          target="_blank"
          rel="noopener noreferrer"
        >
          Throttling & Smoothing Rules
        </a>
      </div>
    </aside>
  );
}
