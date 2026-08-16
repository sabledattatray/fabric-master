import { FabricRecommendation, WorkloadContext, ReasoningStep, Risk, Optimization } from "./types";
import { RULES_VERSION } from "./rules";

export function generateRecommendation(context: WorkloadContext): FabricRecommendation {
  const reasoning: ReasoningStep[] = [];
  const risks: Risk[] = [];
  const optimizations: Optimization[] = [];
  
  // Basic Deterministic Engine
  let sku = "F2";
  let minCores = 2;
  let maxCores = 2;
  
  // 1. Evaluate Data Volume
  if (context.dataVolumeGB > 1000) {
    sku = "F16";
    minCores = 16;
    maxCores = 16;
    reasoning.push({ factor: `Data volume (${context.dataVolumeGB} GB)`, deduction: "Requires at least F16 capacity for memory overhead" });
  } else if (context.dataVolumeGB > 100) {
    sku = "F8";
    minCores = 8;
    maxCores = 8;
    reasoning.push({ factor: `Data volume (${context.dataVolumeGB} GB)`, deduction: "Requires F8 capacity for optimal processing" });
  } else {
    reasoning.push({ factor: `Data volume (${context.dataVolumeGB} GB)`, deduction: "Small volume fits in F2/F4 capacity" });
  }

  // 2. Evaluate Concurrency
  if (context.concurrentUsers > 100) {
    sku = "F64";
    minCores = 64;
    maxCores = 64;
    reasoning.push({ factor: `Concurrency (${context.concurrentUsers} users)`, deduction: "High concurrency requires F64 to prevent throttling" });
    risks.push({ id: "r1", description: "High concurrency during business hours could lead to capacity throttling", severity: "high" });
    optimizations.push({ id: "o1", description: "Enable autoscaling and consider query caching", impact: "high", title: "Concurrency Optimization" });
  } else if (context.concurrentUsers > 20) {
    if (minCores < 16) {
      sku = "F16";
      minCores = 16;
      maxCores = 16;
    }
    reasoning.push({ factor: `Concurrency (${context.concurrentUsers} users)`, deduction: "Moderate concurrency requires at least F16" });
  }
  
  // 3. Evaluate Latency & Architecture
  let archName = "Lakehouse Architecture";
  let archDesc = "Standard Medallion Lakehouse";
  let flow = "Bronze -> Silver -> Gold -> Semantic Model -> Power BI";
  let components = ["OneLake", "Spark", "Lakehouse", "Power BI"];

  if (context.latencyRequirement === "real-time" || context.latencyRequirement === "near-real-time") {
    archName = "Real-Time Analytics Architecture";
    archDesc = "Event-driven architecture with KQL Database";
    flow = "Eventstream -> Eventhouse (KQL) -> Semantic Model (Direct Lake) -> Power BI";
    components = ["Eventstream", "Eventhouse", "OneLake", "Power BI"];
    reasoning.push({ factor: "Latency requirement (Real-time)", deduction: "Requires Eventhouse and KQL for low-latency ingestion and querying" });
    optimizations.push({ id: "o2", description: "Use Direct Lake mode for Power BI reporting on KQL", impact: "high", title: "Direct Lake Mode" });
    risks.push({ id: "r2", description: "Real-time ingestion can cause continuous capacity burn", severity: "medium" });
    
    if (minCores < 32) {
      sku = "F32"; // Eventhouse usually needs more capacity to be smooth
      minCores = 32;
      maxCores = 32;
    }
  } else if (context.primaryWorkload === "data-engineering") {
    archName = "Data Warehouse Architecture";
    archDesc = "Enterprise Data Warehouse on Fabric";
    flow = "Pipelines -> Lakehouse (Staging) -> Warehouse -> Power BI";
    components = ["Data Factory", "Lakehouse", "Warehouse", "Power BI"];
    reasoning.push({ factor: "Primary Workload (Data Engineering)", deduction: "T-SQL centric workload best suited for Fabric Warehouse" });
  } else {
    reasoning.push({ factor: "Primary Workload (BI/Mixed)", deduction: "Defaulting to Lakehouse medallion architecture" });
  }

  reasoning.push({ factor: "Rules Engine", deduction: `Based on Fabric Master engineering rules v${RULES_VERSION}` });

  return {
    architecture: {
      id: archName.toLowerCase().replace(/\s+/g, '-'),
      name: archName,
      description: archDesc,
      components: components,
      flow: flow
    },
    capacity: {
      sku: sku,
      minCores: minCores,
      maxCores: maxCores,
      estimatedMonthlyCost: minCores * 150 // Dummy multiplier for estimation
    },
    risks,
    optimizations,
    reasoning,
    confidence: "medium"
  };
}
