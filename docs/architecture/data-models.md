# Fabric Master v4.0 — Core Data Models Specification

**Status:** Implementation Complete & Production Ready  
**Version:** 4.0.0  
**Last Updated:** October 2026  
**Document Classification:** Data Architecture & Schema Specification  

---

## 1. Overview & Schema Versioning Strategy

All data models within Fabric Master v4.0 adhere to strict TypeScript interfaces, runtime validation guards, and backward-compatible versioning. The platform implements version `4.0` as its current schema standard for scenarios, pricing records, telemetry points, architecture topologies, and advisor explanations.

---

## 2. Core Entities

### 2.1 Scenario Model (`src/lib/workspace/scenarioStorage.ts`)

Represents a complete enterprise Fabric capacity and cost estimation scenario.

```typescript
export interface Scenario {
  id: string;                          // UUID v4
  schemaVersion: "4.0";                // Explicit schema version string
  name: string;                        // Human-readable scenario title
  description?: string;                // Context and deployment notes
  createdAt: string;                   // ISO 8601 UTC timestamp
  updatedAt: string;                   // ISO 8601 UTC timestamp
  region: string;                      // Azure region identifier (e.g. "eastus")
  currency: string;                    // ISO currency code (e.g. "USD", "EUR")
  selectedSku?: string;                // User-selected or recommended SKU (e.g. "F64")
  workloads: WorkloadInput[];          // Array of discrete Fabric engine demands
  assumptions: Assumption[];           // Governance parameters & calculation assumptions
  calculationVersion: string;          // Calculation engine version string (e.g. "4.0.0")
  pricingVersion: string;              // Pricing catalog version (e.g. "2026-10-PRICING-V4")
  architectureRef?: string;            // Associated reference architecture ID
  evaluation?: CapacityEvaluation;     // Cached calculation output for fast UI rendering
}
```

### 2.2 Workload Input Model (`src/types/index.ts`)

Captures the granular demand specifications for individual Fabric engines.

```typescript
export interface WorkloadInput {
  id: string;                          // Unique workload identifier
  engine: 
    | "DataFactory" 
    | "SynapseDataEngineering" 
    | "SynapseDataWarehouse" 
    | "SynapseDataScience" 
    | "SynapseRealTimeAnalytics" 
    | "PowerBI" 
    | "DataActivator";
  name: string;                        // Descriptive workload label
  dailyRuns?: number;                  // Batch frequency per 24 hours
  avgDurationMinutes?: number;         // Average runtime duration
  baselineCUs: number;                 // Measured or modeled steady-state Capacity Units
  peakMultiplier?: number;             // Concurrency or burst factor (e.g., 1.4x)
  dataProcessedGB?: number;            // Daily processed volume in GB
  activeUsers?: number;                // Interactive concurrent users (for PBI / Direct Lake)
  evidenceLevel: 
    | "measured" 
    | "model_based" 
    | "heuristic" 
    | "insufficient";
}
```

### 2.3 Capacity Calculation Output (`src/lib/fabric/capacity.ts`)

Represents the computed sizing, tier snapping, and headroom evaluation.

```typescript
export interface CapacityEvaluation {
  scenarioId: string;
  totalBaselineCUs: number;            // Raw unbuffered capacity demand
  bufferedPeakCUs: number;             // Demand with concurrency and headroom applied
  recommendedSku: string;              // Snapped F-SKU (e.g., "F64")
  recommendedSkuCUs: number;           // Capacity units of the recommended SKU (e.g., 64)
  utilizationPercentage: number;       // (bufferedPeakCUs / recommendedSkuCUs) * 100
  headroomPercentage: number;          // Headroom remaining at peak
  candidateSkus: string[];             // Viable alternative tiers
  warnings: string[];                  // Throttling or sizing boundary warnings
  licensingNotes: {
    powerBiProRequiredForViewers: boolean;  // True if SKU < F64
    copilotAvailable: boolean;              // True if SKU >= F64
  };
}
```

### 2.4 Multi-Region Pricing Record (`src/lib/fabric/pricing.ts`)

Represents official multi-region pricing rates, reservation discounts, and provenance metadata.

```typescript
export interface PricingRecord {
  sku: string;                         // "F2" through "F2048"
  region: string;                      // "eastus", "westeurope", etc.
  currency: string;                    // "USD", "EUR", "GBP", "AUD", "INR"
  hourlyRate: number;                  // PAYG hourly rate in regional currency
  monthlyRatePAYG: number;             // hourlyRate * 730 hours
  monthlyRateReserved1Yr: number;      // monthlyRatePAYG * (1 - 0.4056)
  reservedSavingsPercent: 40.56;       // 1-Year reservation discount percentage
  breakevenHoursPerMonth: 434;         // 730 * (1 - 0.4056) = 433.91 hours
  sourceUrl: string;                   // Canonical Microsoft Azure pricing URL
  retrievedAt: string;                 // ISO date of verification
  verifiedDate: string;                // Provenance verification date
  version: string;                     // Version identifier
}
```

### 2.5 Observability Telemetry Point & Assessment (`src/lib/observability.ts`)

Represents normalized telemetry points ingested from Microsoft Fabric Capacity Metrics app exports.

```typescript
export interface TelemetryPoint {
  timestamp: string;                   // ISO 8601 timestamp (UTC)
  rawCuSeconds: number;                // Instantaneous CU consumption in CU-seconds
  operationType: "Interactive" | "Background";
  engineKind: string;                  // "SemanticModel", "Notebook", "Lakehouse", etc.
  itemName?: string;                   // Artifact / workspace name
  userOrAppId?: string;                // Triggering identity
  smoothedCu: number;                  // 24h smoothed (Background) or 5m smoothed (Interactive)
  capacityLimitCu: number;             // Active capacity SKU boundary in CUs
  throttlingState: "None" | "InteractiveDelayed" | "BackgroundRejected";
}

export interface CapacityFitAssessment {
  scenarioSku: string;
  scenarioCapacityCUs: number;
  measuredPeakCu: number;
  measuredAvgCu: number;
  headroomAtPeakPercent: number;
  isThrottlingObserved: boolean;
  fitAssessment: "Under-Provisioned" | "Optimal" | "Over-Provisioned";
  recommendedAdjustment?: string;
}
```

### 2.6 AI Advisor Reasoning Artifact (`src/lib/fabric/advisor/types.ts`)

Structured explainability artifact generated by the grounded AI advisor engine.

```typescript
export interface ScenarioAdvisorReport {
  scenarioId: string;
  scenarioName: string;
  taskType: 
    | "capacity_explanation" 
    | "cost_optimization" 
    | "workload_tuning" 
    | "migration_feasibility" 
    | "executive_brief";
  executiveSummary: string;
  recommendedSku: string;
  groundedBaseline: {
    totalBaselineCUs: number;
    recommendedSkuCUs: number;
    headroomPercentage: number;
    monthlyPaygCost: number;
    monthlyReservedCost: number;
    breakevenHours: number;
  };
  reasoningSteps: Array<{
    stepNumber: number;
    title: string;
    description: string;
    mathematicalFormula?: string;
  }>;
  identifiedRisks: Array<{
    severity: "Low" | "Medium" | "High" | "Critical";
    category: string;
    description: string;
    mitigation: string;
  }>;
  optimizationActions: Array<{
    priority: "Immediate" | "Planned" | "Optional";
    estimatedSavingsPercent: number;
    description: string;
    tradeoffs: string;
  }>;
  officialReferences: Array<{
    title: string;
    url: string;
    relevance: string;
  }>;
  auditTrail: {
    generatedAt: string;
    pricingCatalogVersion: string;
    sanitizationApplied: boolean;
  };
}
```

---

## 3. Data Migration & Validation Safeguards

1. **Malicious Script Tag Sanitization:** All string inputs in scenario names, descriptions, and user notes are sanitized via regex `/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi` to prevent XSS payloads upon persistence and rehydration.
2. **Missing Field Imputation:** Legacy scenario versions (<4.0) automatically receive updated schema properties (`schemaVersion: "4.0"`, `currency: "USD"`, default headroom `0.50`, and verified pricing version).
3. **Corrupted Payload Isolation:** When importing JSON or CSV payloads, invalid rows or unparseable objects are captured into an `isolationErrors` collection, preventing complete import crashes and allowing granular user inspection.
