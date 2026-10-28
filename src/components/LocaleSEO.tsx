import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { languageInfo } from "../lib/localization";

export const ROUTE_META: Record<
  string,
  { title: string; description?: string }
> = {
  "/": {
    title: "Fabric Master — Microsoft Fabric Engineering Intelligence",
    description:
      "Plan capacity, understand costs, and design your Microsoft Fabric architecture in one independent engineering workspace.",
  },
  "/architecture/planner": {
    title: "Architecture Planner",
    description:
      "Design your Microsoft Fabric architecture with reference templates, connected components, and structural rule checks.",
  },
  "/architecture/onelake": {
    title: "OneLake Visualizer",
    description:
      "Explore OneLake layers, inspect Fabric items, and follow logical data relationships.",
  },
  "/workspace": { title: "Engineering Workspace" },
  "/observability": { title: "Capacity Observability" },
  "/ai-advisor": { title: "AI Advisor" },
  "/docs": { title: "Documentation & Articles" },
  "/wizard": { title: "Microsoft Fabric Capacity Calculator" },
  "/cost-calculator": {
    title: "Microsoft Fabric Cost Calculator & FinOps Pricing Estimator",
  },
  "/reserved-savings": { title: "Reserved Savings Calculator" },
  "/spark-estimator": { title: "Spark CU Sizing Estimator" },
  "/power-bi-capacity": { title: "Power BI Capacity Sizing" },
  "/fsku-comparisons": { title: "F-SKU Comparison" },
  "/pricing": { title: "Pricing Matrices" },
  "/report": { title: "Decision Report" },
  "/about": { title: "About Datta Sable" },
  "/labs": { title: "Labs & Experiments" },
  "/resources/open-source": { title: "Open Source" },
};

/** Document language follows the explicit URL, independently of browser storage. */
export function LocaleSEO() {
  const { i18n } = useTranslation();
  return (
    <Helmet
      htmlAttributes={{
        lang: languageInfo(i18n.resolvedLanguage || i18n.language).tag,
        dir: "ltr",
      }}
    />
  );
}
