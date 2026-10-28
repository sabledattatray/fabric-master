import React from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";

export function PlanningAssumptions() {
  return (
    <aside
      className="planning-provenance"
      aria-label="Planning assumptions and pricing provenance"
    >
      <details>
        <summary>
          <ShieldCheck size={15} />
          <span>Transparent estimates. Documented assumptions.</span>
          <span className="provenance-baseline">
            US East baseline · October 2026
          </span>
          <ChevronDown size={14} />
        </summary>
        <div className="provenance-details">
          <strong>
            US East baseline: $0.18/CU/hour PAYG · ~41% 1-year reservation
            discount
          </strong>
          <p>
            Independent planning estimates based on published architectural
            models—not an official Microsoft commercial quote or measured
            capacity guarantee. Actual utilization depends on concurrency,
            semantic model complexity, and active smoothing windows (24h
            background, 5m interactive). Paid F2 or higher may qualify for
            Copilot subject to tenant and regional availability; organizational
            free-viewer Power BI licensing requires a separate minimum threshold
            of F64.
          </p>
          <div>
            <a
              href="https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official Azure Fabric Pricing ↗
            </a>
            <a
              href="https://learn.microsoft.com/en-us/fabric/fundamentals/copilot-fabric-overview"
              target="_blank"
              rel="noopener noreferrer"
            >
              Copilot Requirements ↗
            </a>
            <a
              href="https://learn.microsoft.com/en-us/fabric/enterprise/licenses"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fabric Licensing Guide ↗
            </a>
            <a
              href="https://learn.microsoft.com/en-us/fabric/enterprise/throttling"
              target="_blank"
              rel="noopener noreferrer"
            >
              Throttling & Smoothing Rules ↗
            </a>
          </div>
        </div>
      </details>
    </aside>
  );
}
