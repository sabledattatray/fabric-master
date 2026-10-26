import { Scenario, ScenarioSchema, WorkloadCalculationInput } from "../types";
import { calculateCapacity } from "./calculator";

const SCENARIOS_STORAGE_KEY = "fabric_master_scenarios";
const ACTIVE_SCENARIO_KEY = "fabric_master_active_scenario_id";

export const DEFAULT_WORKLOAD_INPUT: WorkloadCalculationInput = {
  regionId: "eastus",
  currencyCode: "USD",
  dataFactoryInput: {
    monthlyPipelines: 10000,
    avgActivities: 10,
    dataVolumeGb: 500,
  },
  sparkComputeInput: {
    totalNodes: 4,
    vCoresPerNode: 8,
    dailyRuntimeHours: 4,
  },
  powerBiInput: {
    peakConcurrentUsers: 50,
    queryComplexityScale: 3,
  },
};


export const INITIAL_REFERENCE_SCENARIOS: Scenario[] = [
  {
    id: "scenario-enterprise-f64",
    schemaVersion: "4.0",
    name: "Enterprise Production Baseline (F64 Target)",
    description: "Standard production Fabric deployment supporting 120 concurrent Power BI viewers, daily medallion Spark ETL, and Data Factory pipelines.",
    createdAt: "2026-10-01T08:00:00.000Z",
    updatedAt: "2026-10-26T10:00:00.000Z",
    region: "eastus",
    currency: "USD",
    inputs: {
      regionId: "eastus",
      currencyCode: "USD",
      dataFactoryInput: {
        monthlyPipelines: 12000,
        avgActivities: 15,
        dataVolumeGb: 1500,
      },
      sparkComputeInput: {
        totalNodes: 4,
        vCoresPerNode: 8,
        dailyRuntimeHours: 6,
      },
      powerBiInput: {
        peakConcurrentUsers: 120,
        queryComplexityScale: 3,
      },
    },
    notes: "Requires minimum F64 to unlock organizational free Power BI viewing.",
    tags: ["Production", "F64", "Enterprise"],
    evidenceLevel: "model_based",
  },
  {
    id: "scenario-team-analytics-f16",
    schemaVersion: "4.0",
    name: "Team Analytics & Prototyping (F16 Target)",
    description: "Cost-optimized departmental analytics workload for internal data science prototyping and scheduled ETL.",
    createdAt: "2026-10-05T09:00:00.000Z",
    updatedAt: "2026-10-26T10:00:00.000Z",
    region: "eastus",
    currency: "USD",
    inputs: {
      regionId: "eastus",
      currencyCode: "USD",
      dataFactoryInput: {
        monthlyPipelines: 3000,
        avgActivities: 8,
        dataVolumeGb: 200,
      },
      sparkComputeInput: {
        totalNodes: 2,
        vCoresPerNode: 4,
        dailyRuntimeHours: 3,
      },
      powerBiInput: {
        peakConcurrentUsers: 25,
        queryComplexityScale: 2,
      },
    },
    notes: "Users require individual Power BI Pro or PPU licenses for report distribution.",
    tags: ["Dev/Test", "F16", "Team"],
    evidenceLevel: "model_based",
  },
  {
    id: "scenario-high-scale-f128",
    schemaVersion: "4.0",
    name: "High-Concurrency Direct Lake Estate (F128 Target)",
    description: "Enterprise data estate with large OneLake ingestion volumes and 350+ peak concurrent executive dashboard users.",
    createdAt: "2026-10-10T11:00:00.000Z",
    updatedAt: "2026-10-26T10:00:00.000Z",
    region: "eastus",
    currency: "USD",
    inputs: {
      regionId: "eastus",
      currencyCode: "USD",
      dataFactoryInput: {
        monthlyPipelines: 30000,
        avgActivities: 20,
        dataVolumeGb: 6000,
      },
      sparkComputeInput: {
        totalNodes: 8,
        vCoresPerNode: 16,
        dailyRuntimeHours: 8,
      },
      powerBiInput: {
        peakConcurrentUsers: 350,
        queryComplexityScale: 4,
      },
    },
    notes: "Direct Lake caching and 24-hour background smoothing buffer critical.",
    tags: ["High-Scale", "F128", "Direct Lake"],
    evidenceLevel: "model_based",
  },
];

export function getScenarios(): Scenario[] {
  if (typeof window === "undefined") {
    return INITIAL_REFERENCE_SCENARIOS.map(enrichScenario);
  }

  try {
    const raw = localStorage.getItem(SCENARIOS_STORAGE_KEY);
    if (!raw) {
      const initialized = INITIAL_REFERENCE_SCENARIOS.map(enrichScenario);
      saveAllScenarios(initialized);
      return initialized;
    }
    const parsed: Scenario[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initialized = INITIAL_REFERENCE_SCENARIOS.map(enrichScenario);
      saveAllScenarios(initialized);
      return initialized;
    }
    return parsed.map(enrichScenario);
  } catch (err) {
    console.error("Error loading scenarios from storage:", err);
    return INITIAL_REFERENCE_SCENARIOS.map(enrichScenario);
  }
}

export function enrichScenario(scenario: Scenario): Scenario {
  if (!scenario.evaluation || !scenario.evaluation.success) {
    const evalResult = calculateCapacity(scenario.inputs);
    return {
      ...scenario,
      evaluation: evalResult,
    };
  }
  return scenario;
}

export function saveAllScenarios(scenarios: Scenario[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SCENARIOS_STORAGE_KEY, JSON.stringify(scenarios));
  } catch (err) {
    console.error("Failed to save scenarios to localStorage:", err);
  }
}

export function getScenario(id: string): Scenario | null {
  const scenarios = getScenarios();
  return scenarios.find((s) => s.id === id) || null;
}

export function saveScenario(scenario: Scenario): void {
  const scenarios = getScenarios();
  const updatedScenario = {
    ...scenario,
    updatedAt: new Date().toISOString(),
    evaluation: calculateCapacity(scenario.inputs),
  };

  const index = scenarios.findIndex((s) => s.id === scenario.id);
  if (index >= 0) {
    scenarios[index] = updatedScenario;
  } else {
    scenarios.push(updatedScenario);
  }
  saveAllScenarios(scenarios);
}

export function createScenario(name: string, inputs?: Partial<WorkloadCalculationInput>): Scenario {
  const id = `scenario-${Date.now()}`;
  const mergedInputs: WorkloadCalculationInput = {
    ...DEFAULT_WORKLOAD_INPUT,
    ...(inputs || {}),
  };

  const newScenario: Scenario = {
    id,
    schemaVersion: "4.0",
    name: name.trim() || `New Scenario ${new Date().toLocaleDateString()}`,
    description: "Custom Microsoft Fabric capacity and FinOps scenario.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    region: mergedInputs.regionId || "eastus",
    currency: mergedInputs.currencyCode || "USD",
    inputs: mergedInputs,
    evaluation: calculateCapacity(mergedInputs),
    tags: ["Custom"],
    evidenceLevel: "model_based",
  };

  const scenarios = getScenarios();
  scenarios.unshift(newScenario);
  saveAllScenarios(scenarios);
  setActiveScenarioId(id);
  return newScenario;
}

export function duplicateScenario(id: string): Scenario | null {
  const existing = getScenario(id);
  if (!existing) return null;

  const duplicated: Scenario = {
    ...existing,
    id: `scenario-${Date.now()}`,
    name: `${existing.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    evaluation: calculateCapacity(existing.inputs),
  };

  const scenarios = getScenarios();
  scenarios.unshift(duplicated);
  saveAllScenarios(scenarios);
  setActiveScenarioId(duplicated.id);
  return duplicated;
}

export function deleteScenario(id: string): boolean {
  const scenarios = getScenarios();
  if (scenarios.length <= 1) {
    return false; // Prevent deleting last scenario
  }
  const filtered = scenarios.filter((s) => s.id !== id);
  saveAllScenarios(filtered);
  const activeId = getActiveScenarioId();
  if (activeId === id) {
    setActiveScenarioId(filtered[0].id);
  }
  return true;
}

export function getActiveScenarioId(): string {
  if (typeof window === "undefined") return INITIAL_REFERENCE_SCENARIOS[0].id;
  const saved = localStorage.getItem(ACTIVE_SCENARIO_KEY);
  if (saved && getScenario(saved)) {
    return saved;
  }
  const all = getScenarios();
  return all.length > 0 ? all[0].id : INITIAL_REFERENCE_SCENARIOS[0].id;
}

export function setActiveScenarioId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_SCENARIO_KEY, id);
}

export function exportScenarioAsJSON(scenario: Scenario): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scenario, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${scenario.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-v4.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportAllScenariosAsJSON(): void {
  const scenarios = getScenarios();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scenarios, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `fabric-master-all-scenarios-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function resetScenarioToDefault(id: string): Scenario | null {
  const ref = INITIAL_REFERENCE_SCENARIOS.find((s) => s.id === id);
  if (ref) {
    saveScenario(ref);
    return enrichScenario(ref);
  }
  const existing = getScenario(id);
  if (!existing) return null;
  const resetScenario: Scenario = {
    ...existing,
    inputs: { ...DEFAULT_WORKLOAD_INPUT },
    updatedAt: new Date().toISOString(),
    evaluation: calculateCapacity(DEFAULT_WORKLOAD_INPUT),
  };
  saveScenario(resetScenario);
  return resetScenario;
}

export function importScenarioFromJSON(jsonString: string): { success: boolean; scenario?: Scenario; error?: string } {
  try {
    const rawParsed = JSON.parse(jsonString);
    if (!rawParsed || typeof rawParsed !== "object") {
      return { success: false, error: "Invalid JSON format: payload must be a JSON object." };
    }

    // Build candidate scenario object with safe defaults and sanitized strings
    const rawName = typeof rawParsed.name === "string" ? rawParsed.name.trim() : "Imported Scenario";
    const candidate = {
      id: `scenario-imported-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      schemaVersion: "4.0",
      name: rawName.endsWith("(Imported)") ? rawName : `${rawName} (Imported)`,
      description: typeof rawParsed.description === "string" ? rawParsed.description : "Imported scenario.",
      createdAt: typeof rawParsed.createdAt === "string" ? rawParsed.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      region: typeof rawParsed.region === "string" ? rawParsed.region : "eastus",
      currency: typeof rawParsed.currency === "string" ? rawParsed.currency : "USD",
      inputs: rawParsed.inputs,
      notes: typeof rawParsed.notes === "string" ? rawParsed.notes : undefined,
      tags: Array.isArray(rawParsed.tags) ? rawParsed.tags.map((t: any) => String(t)) : ["Imported"],
      evidenceLevel: rawParsed.evidenceLevel || "model_based",
    };

    const parseResult = ScenarioSchema.safeParse(candidate);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
      return { success: false, error: `Scenario validation failed: ${errorMsg}` };
    }

    const validated = parseResult.data;
    const evaluated: Scenario = {
      ...validated,
      evaluation: calculateCapacity(validated.inputs),
    };

    const scenarios = getScenarios();
    scenarios.unshift(evaluated);
    saveAllScenarios(scenarios);
    setActiveScenarioId(evaluated.id);
    return { success: true, scenario: evaluated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to parse scenario file." };
  }
}

