export type UpstreamProject = {
  name: string;
  repository: string;
  source: string;
  purpose: string;
  license: string;
  fabricMasterRelationship: string;
};

export const upstreamProjects: UpstreamProject[] = [
  {
    name: "Microsoft Skills for Fabric",
    repository: "https://github.com/microsoft/skills-for-fabric",
    source: "Microsoft",
    purpose: "Fabric engineering skills and AI workflows",
    license: "MIT",
    fabricMasterRelationship: "Inspiration for AI Advisor workloads, engineering recommendations, and deterministic rules."
  },
  {
    name: "Microsoft Fabric Toolbox",
    repository: "https://github.com/microsoft/fabric-toolbox",
    source: "Microsoft / Community",
    purpose: "Microsoft/community Fabric operational and monitoring solutions",
    license: "MIT",
    fabricMasterRelationship: "Reference for operational metrics, monitoring patterns, and capacity diagnostics."
  },
  {
    name: "Microsoft FinOps Toolkit",
    repository: "https://github.com/microsoft/finops-toolkit",
    source: "Microsoft",
    purpose: "Open-source Microsoft Cloud FinOps tools and resources",
    license: "MIT",
    fabricMasterRelationship: "Inspiration for Fabric cost calculation methodologies and optimization strategies."
  },
  {
    name: "Power BI Developer Samples",
    repository: "https://github.com/microsoft/PowerBI-Developer-Samples",
    source: "Microsoft",
    purpose: "Samples for embedding and developing with Power BI",
    license: "MIT",
    fabricMasterRelationship: "Reference for semantic model architecture and Direct Lake integration patterns."
  }
];
