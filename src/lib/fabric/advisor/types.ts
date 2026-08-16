export type ArchitectureRecommendation = {
  id: string;
  name: string;
  description: string;
  components: string[];
  flow: string;
};

export type CapacityRecommendation = {
  sku: string;
  minCores: number;
  maxCores: number;
  estimatedMonthlyCost: number;
};

export type Risk = {
  id: string;
  description: string;
  severity: "low" | "medium" | "high";
};

export type Optimization = {
  id: string;
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
};

export type ReasoningStep = {
  factor: string;
  deduction: string;
};

export type FabricRecommendation = {
  architecture: ArchitectureRecommendation;
  capacity: CapacityRecommendation;
  risks: Risk[];
  optimizations: Optimization[];
  reasoning: ReasoningStep[];
  confidence: "low" | "medium" | "high";
};

export type WorkloadContext = {
  dataVolumeGB: number;
  concurrentUsers: number;
  latencyRequirement: "batch" | "near-real-time" | "real-time";
  primaryWorkload: "bi" | "data-engineering" | "data-science" | "real-time-analytics" | "mixed";
  sourceSystems: number;
};
