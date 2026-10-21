import React from 'react';
export function PlanningAssumptions() {
  return <aside className="mx-auto max-w-5xl px-6 py-5 text-sm leading-relaxed border-b border-[#30363d] text-[#8b949e]" aria-label="Planning assumptions">
    Independent planning estimates, not a Microsoft quote or measured capacity guarantee. Verify region, currency, active hours, storage, licenses, and offer terms. Paid F2 or higher may qualify for Copilot with current tenant and region requirements; organizational free-license Power BI viewing has a separate F64 threshold and access conditions.
    {' '}<a className="underline" href="https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/">Official prices</a>{' · '}<a className="underline" href="https://learn.microsoft.com/en-us/fabric/fundamentals/copilot-fabric-overview">Copilot requirements</a>{' · '}<a className="underline" href="https://learn.microsoft.com/en-us/fabric/enterprise/licenses">Licensing</a>
  </aside>;
}
