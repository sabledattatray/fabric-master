import { Scenario, EvaluationResponse } from "../../../types";
import { ReservationEconomics } from "../../pricing";

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
  mitigation?: string;
};

export type Optimization = {
  id: string;
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  category?: "cost" | "performance" | "architecture" | "governance";
};

export type ReasoningStep = {
  factor: string;
  metricValue?: string | number;
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

// ============================================================================
// Phase 8: AI Advisor v2 Types (PRD Section 21 & 44)
// ============================================================================

export type AdvisorTaskType =
  | "capacity_explanation"
  | "finops_breakdown"
  | "architecture_review"
  | "throttling_risk"
  | "executive_summary";

export interface AdvisorReference {
  title: string;
  url: string;
  domain: string;
  isOfficial: boolean;
}

export interface ScenarioAdvisorReport {
  scenarioId: string;
  scenarioName: string;
  taskType: AdvisorTaskType;
  generatedAt: string;
  summary: string;
  supportingEvidence: ReasoningStep[];
  assumptions: string[];
  limitations: string[];
  suggestedValidation: string[];
  recommendations: Optimization[];
  risks: Risk[];
  references: AdvisorReference[];
  evaluation: EvaluationResponse;
  reservationEconomics: ReservationEconomics;
  confidence: "high" | "medium";
  provenance: {
    engineVersion: string;
    pricingCatalogDate: string;
    regionId: string;
    currencyCode: string;
    safeSku: string;
    safeSkuCu: number;
    baselineCu: number;
  };
  aiTrustDisclosure: {
    mode: "deterministic_rules" | "llm_enhanced";
    isGrounded: boolean;
    disclaimer: string;
  };
}
