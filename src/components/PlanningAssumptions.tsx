import { useTranslation } from "react-i18next";
import React from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";
export function PlanningAssumptions() {
  const tx = useTranslation().t;
  return (
    <aside
      className="planning-provenance"
      aria-label={tx("Planning assumptions and pricing provenance")}
    >
      <details>
        <summary>
          <ShieldCheck size={15} />
          <span>{tx("Transparent estimates. Documented assumptions.")}</span>
          <span className="provenance-baseline">
            {tx("US East baseline \u00B7 October 2026")}
          </span>
          <ChevronDown size={14} />
        </summary>
        <div className="provenance-details">
          <strong>
            {tx(
              "US East baseline: $0.18/CU/hour PAYG \u00B7 ~41% 1-year reservation discount",
            )}
          </strong>
          <p>
            {tx(
              "Independent planning estimates based on published architectural models\u2014not an official Microsoft commercial quote or measured capacity guarantee. Actual utilization depends on concurrency, semantic model complexity, and active smoothing windows (24h background, 5m interactive). Paid F2 or higher may qualify for Copilot subject to tenant and regional availability; organizational free-viewer Power BI licensing requires a separate minimum threshold of F64.",
            )}
          </p>
          <div>
            <a
              href="https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {tx("Official Azure Fabric Pricing \u2197")}
            </a>
            <a
              href="https://learn.microsoft.com/en-us/fabric/fundamentals/copilot-fabric-overview"
              target="_blank"
              rel="noopener noreferrer"
            >
              {tx("Copilot Requirements \u2197")}
            </a>
            <a
              href="https://learn.microsoft.com/en-us/fabric/enterprise/licenses"
              target="_blank"
              rel="noopener noreferrer"
            >
              {tx("Fabric Licensing Guide \u2197")}
            </a>
            <a
              href="https://learn.microsoft.com/en-us/fabric/enterprise/throttling"
              target="_blank"
              rel="noopener noreferrer"
            >
              {tx("Throttling & Smoothing Rules \u2197")}
            </a>
          </div>
        </div>
      </details>
    </aside>
  );
}
