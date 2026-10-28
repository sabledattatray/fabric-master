/**
 * Fabric Master v4.0 - Telemetry & Observability Subsystem
 *
 * Dedicated to ingesting, normalizing, validating, and analyzing Microsoft Fabric
 * Capacity Metrics App exports (CSV/JSON), calculating interactive vs. background
 * 24-hour sliding window smoothing, identifying throttling risk points,
 * and comparing observed usage to planned capacity scenarios.
 *
 * Security & Privacy:
 * 100% Client-side in-browser analysis. Zero network exfiltration.
 */

import { z } from "zod";

export type ItemKind =
  | "Lakehouse"
  | "Warehouse"
  | "Notebook"
  | "SparkJob"
  | "SemanticModel"
  | "Dataflow"
  | "Pipeline"
  | "Eventhouse"
  | "KQLDatabase"
  | "Other";

export type OperationType = "Interactive" | "Background";

export type RecordStatus = "Success" | "Throttled" | "Failed";

export interface TelemetryRecord {
  id: string;
  timestamp: string; // ISO 8601
  itemName: string;
  itemKind: ItemKind;
  operationName: string;
  operationType: OperationType;
  cuSeconds: number;
  capacityUnits: number; // Derived or recorded CU demand
  status: RecordStatus;
  user?: string;
}

export interface EngineBreakdown {
  kind: ItemKind;
  cuHours: number;
  percentage: number;
  color: string;
}

export interface HourlyTimeSeriesPoint {
  hour: string; // e.g. "2026-10-26 09:00"
  interactiveCu: number;
  backgroundCu: number;
  totalCu: number;
  smoothedCu: number; // 24-hour background smoothing + 5-minute interactive smoothing
  capacityLimit: number;
  throttled: boolean;
  cumulativeBorrowPercent: number; // 0 to 100%+
}

export interface TopConsumerItem {
  itemName: string;
  itemKind: ItemKind;
  cuHours: number;
  percentage: number;
  operationCount: number;
  maxBurstCu: number;
}

export interface DataQualityIssue {
  row: number;
  reason: string;
  rawSnippet: string;
}

export interface ObservabilitySummary {
  id: string;
  datasetName: string;
  sourceType: "csv_upload" | "json_upload" | "sample_medallion" | "sample_throttled" | "sample_spark";
  parsedAt: string;
  totalRecords: number;
  validRecords: number;
  rejectedRecords: number;
  timeRange: {
    start: string;
    end: string;
    durationHours: number;
  };
  totalCuHours: number;
  avgCuDemand: number;
  peakCuDemand: number;
  peakTimestamp: string;
  recommendedSku: string;
  recommendedSkuCu: number;
  interactiveRatio: number; // e.g. 0.35 (35%)
  backgroundRatio: number;  // e.g. 0.65 (65%)
  throttlingEventsCount: number;
  throttlingRiskScore: number; // 0 - 100
  capacityLimitEvaluated: number; // e.g. 64 CUs for F64
  engineBreakdown: EngineBreakdown[];
  hourlyTimeSeries: HourlyTimeSeriesPoint[];
  topConsumers: TopConsumerItem[];
  qualityIssues: DataQualityIssue[];
}

export interface ScenarioTelemetryComparison {
  scenarioSku: string;
  scenarioSkuCu: number;
  observedPeakCu: number;
  observedAvgCu: number;
  observedSmoothedPeakCu: number;
  fitAssessment: "Optimal" | "Under-Provisioned" | "Over-Provisioned" | "Critical Throttling Risk";
  headroomPercent: number;
  utilizationPercent: number;
  riskSummary: string;
  recommendation: string;
}

// Zod Schema for validation of JSON and parsed CSV records
export const RawTelemetryRecordSchema = z.object({
  timestamp: z.string().min(1, "Timestamp is required"),
  itemName: z.string().default("Unknown Artifact"),
  itemKind: z.string().default("Other"),
  operationName: z.string().default("General Operation"),
  operationType: z.enum(["Interactive", "Background"]).default("Background"),
  cuSeconds: z.number().nonnegative().default(0),
  status: z.enum(["Success", "Throttled", "Failed"]).default("Success"),
  user: z.string().optional()
});

const ENGINE_COLORS: Record<ItemKind, string> = {
  Lakehouse: "#3b82f6",     // Blue
  Warehouse: "#6366f1",     // Indigo
  Notebook: "#f59e0b",      // Amber
  SparkJob: "#ec4899",      // Pink
  SemanticModel: "#10b981", // Emerald
  Dataflow: "#8b5cf6",      // Purple
  Pipeline: "#06b6d4",      // Cyan
  Eventhouse: "#14b8a6",    // Teal
  KQLDatabase: "#0ea5e9",   // Sky
  Other: "#64748b"          // Slate
};

function normalizeItemKind(raw: string): ItemKind {
  const lower = (raw || "").toLowerCase().trim();
  if (lower.includes("lakehouse")) return "Lakehouse";
  if (lower.includes("warehouse") || lower.includes("sql endpoint")) return "Warehouse";
  if (lower.includes("notebook")) return "Notebook";
  if (lower.includes("spark")) return "SparkJob";
  if (lower.includes("semantic") || lower.includes("dataset") || lower.includes("power bi") || lower.includes("pbi")) return "SemanticModel";
  if (lower.includes("dataflow")) return "Dataflow";
  if (lower.includes("pipeline") || lower.includes("data factory")) return "Pipeline";
  if (lower.includes("eventhouse")) return "Eventhouse";
  if (lower.includes("kql")) return "KQLDatabase";
  return "Other";
}

function normalizeOperationType(raw: string, itemKind: ItemKind): OperationType {
  const lower = (raw || "").toLowerCase().trim();
  if (lower.includes("interactive") || lower.includes("query") || lower.includes("report render") || lower.includes("dax")) {
    return "Interactive";
  }
  if (lower.includes("background") || lower.includes("batch") || lower.includes("refresh") || lower.includes("pipeline") || lower.includes("job")) {
    return "Background";
  }
  // Default heuristic by item kind
  if (itemKind === "SemanticModel") return "Interactive";
  return "Background";
}

function normalizeStatus(raw: string): RecordStatus {
  const lower = (raw || "").toLowerCase().trim();
  if (lower.includes("throttle") || lower.includes("reject") || lower.includes("delay")) return "Throttled";
  if (lower.includes("fail") || lower.includes("error")) return "Failed";
  return "Success";
}

const FABRIC_SKU_CAPACITIES = [
  { sku: "F2", cu: 2 },
  { sku: "F4", cu: 4 },
  { sku: "F8", cu: 8 },
  { sku: "F16", cu: 16 },
  { sku: "F32", cu: 32 },
  { sku: "F64", cu: 64 },
  { sku: "F128", cu: 128 },
  { sku: "F256", cu: 256 },
  { sku: "F512", cu: 512 },
  { sku: "F1024", cu: 1024 },
  { sku: "F2048", cu: 2048 }
];

export function recommendSkuForCu(peakSmoothedCu: number): { sku: string; cu: number } {
  // Add a 20% safe operating buffer above smoothed peak
  const targetCu = peakSmoothedCu * 1.2;
  const match = FABRIC_SKU_CAPACITIES.find(s => s.cu >= targetCu);
  return match || FABRIC_SKU_CAPACITIES[FABRIC_SKU_CAPACITIES.length - 1];
}

/**
 * Analyzes normalized records into an ObservabilitySummary.
 */
export function analyzeTelemetryRecords(
  records: TelemetryRecord[],
  datasetName: string,
  sourceType: ObservabilitySummary["sourceType"],
  qualityIssues: DataQualityIssue[],
  evaluatedCapacityLimit: number = 64
): ObservabilitySummary {
  if (records.length === 0) {
    return {
      id: "summary-" + Date.now(),
      datasetName,
      sourceType,
      parsedAt: new Date().toISOString(),
      totalRecords: 0,
      validRecords: 0,
      rejectedRecords: qualityIssues.length,
      timeRange: { start: "", end: "", durationHours: 0 },
      totalCuHours: 0,
      avgCuDemand: 0,
      peakCuDemand: 0,
      peakTimestamp: "",
      recommendedSku: "F2",
      recommendedSkuCu: 2,
      interactiveRatio: 0,
      backgroundRatio: 0,
      throttlingEventsCount: 0,
      throttlingRiskScore: 0,
      capacityLimitEvaluated: evaluatedCapacityLimit,
      engineBreakdown: [],
      hourlyTimeSeries: [],
      topConsumers: [],
      qualityIssues
    };
  }

  // Sort records by timestamp
  const sorted = [...records].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const startTime = sorted[0].timestamp;
  const endTime = sorted[sorted.length - 1].timestamp;
  const startMs = new Date(startTime).getTime();
  const endMs = new Date(endTime).getTime();
  const durationHours = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60)));

  // Aggregate into hourly buckets
  const hourlyMap: Record<string, { interactiveCuSec: number; backgroundCuSec: number; throttled: boolean }> = {};

  let totalCuSeconds = 0;
  let totalInteractiveSec = 0;
  let totalBackgroundSec = 0;
  let throttlingEvents = 0;

  const itemMap: Record<string, { itemKind: ItemKind; cuSeconds: number; ops: number; maxBurstCu: number }> = {};
  const engineMap: Record<ItemKind, number> = {
    Lakehouse: 0,
    Warehouse: 0,
    Notebook: 0,
    SparkJob: 0,
    SemanticModel: 0,
    Dataflow: 0,
    Pipeline: 0,
    Eventhouse: 0,
    KQLDatabase: 0,
    Other: 0
  };

  sorted.forEach(rec => {
    totalCuSeconds += rec.cuSeconds;
    if (rec.operationType === "Interactive") {
      totalInteractiveSec += rec.cuSeconds;
    } else {
      totalBackgroundSec += rec.cuSeconds;
    }

    if (rec.status === "Throttled") {
      throttlingEvents++;
    }

    engineMap[rec.itemKind] = (engineMap[rec.itemKind] || 0) + rec.cuSeconds;

    // Track top consumers
    if (!itemMap[rec.itemName]) {
      itemMap[rec.itemName] = {
        itemKind: rec.itemKind,
        cuSeconds: 0,
        ops: 0,
        maxBurstCu: 0
      };
    }
    itemMap[rec.itemName].cuSeconds += rec.cuSeconds;
    itemMap[rec.itemName].ops += 1;
    if (rec.capacityUnits > itemMap[rec.itemName].maxBurstCu) {
      itemMap[rec.itemName].maxBurstCu = rec.capacityUnits;
    }

    // Hourly key (e.g. "2026-10-26 09:00")
    const d = new Date(rec.timestamp);
    const hourKey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")} ${String(d.getUTCHours()).padStart(2, "0")}:00 UTC`;

    if (!hourlyMap[hourKey]) {
      hourlyMap[hourKey] = { interactiveCuSec: 0, backgroundCuSec: 0, throttled: false };
    }
    if (rec.operationType === "Interactive") {
      hourlyMap[hourKey].interactiveCuSec += rec.cuSeconds;
    } else {
      hourlyMap[hourKey].backgroundCuSec += rec.cuSeconds;
    }
    if (rec.status === "Throttled") {
      hourlyMap[hourKey].throttled = true;
    }
  });

  const totalCuHours = Math.round((totalCuSeconds / 3600) * 100) / 100;
  const interactiveRatio = totalCuSeconds > 0 ? Math.round((totalInteractiveSec / totalCuSeconds) * 100) / 100 : 0;
  const backgroundRatio = totalCuSeconds > 0 ? Math.round((totalBackgroundSec / totalCuSeconds) * 100) / 100 : 0;

  // Build Time Series with Fabric 24-hr Smoothing algorithm
  // In Fabric, 1 Capacity Unit for 1 hour = 3600 CU(s).
  // Background operations are smoothed over a 24-hour sliding window.
  // Interactive operations are smoothed over a 5-minute window (within the hour, peak demand governs).
  const hourKeys = Object.keys(hourlyMap).sort();
  const hourlyTimeSeries: HourlyTimeSeriesPoint[] = [];

  let peakCuDemand = 0;
  let peakTimestamp = "";
  let peakSmoothedCu = 0;

  // Sliding 24-hour window queue for background smoothing
  const backgroundWindow: number[] = [];
  let cumulativeDebtCu = 0;

  hourKeys.forEach(hKey => {
    const bucket = hourlyMap[hKey];
    // Convert CU-seconds in the hour to average hourly CU demand
    const rawHourlyInteractiveCu = Math.round((bucket.interactiveCuSec / 3600) * 10) / 10;
    const rawHourlyBackgroundCu = Math.round((bucket.backgroundCuSec / 3600) * 10) / 10;
    const rawHourlyTotalCu = rawHourlyInteractiveCu + rawHourlyBackgroundCu;

    // Track raw peak
    if (rawHourlyTotalCu > peakCuDemand) {
      peakCuDemand = rawHourlyTotalCu;
      peakTimestamp = hKey;
    }

    // 24-hour Background Smoothing:
    backgroundWindow.push(rawHourlyBackgroundCu);
    if (backgroundWindow.length > 24) {
      backgroundWindow.shift();
    }
    const smoothedBackgroundCu = Math.round(
      (backgroundWindow.reduce((acc, val) => acc + val, 0) / backgroundWindow.length) * 10
    ) / 10;

    // Smoothed CU = raw interactive peak + smoothed background demand
    const smoothedCu = Math.round((rawHourlyInteractiveCu + smoothedBackgroundCu) * 10) / 10;
    if (smoothedCu > peakSmoothedCu) {
      peakSmoothedCu = smoothedCu;
    }

    // Cumulative Borrowing Tracking
    const capacityLimit = evaluatedCapacityLimit;
    const netHourBalance = smoothedCu - capacityLimit;
    cumulativeDebtCu = Math.max(0, cumulativeDebtCu + netHourBalance);
    const borrowLimit = capacityLimit * 24; // 24 hours of borrowing capacity
    const cumulativeBorrowPercent = Math.min(150, Math.round((cumulativeDebtCu / borrowLimit) * 100));

    const isThrottled = bucket.throttled || smoothedCu > capacityLimit || cumulativeBorrowPercent > 100;

    hourlyTimeSeries.push({
      hour: hKey,
      interactiveCu: rawHourlyInteractiveCu,
      backgroundCu: rawHourlyBackgroundCu,
      totalCu: rawHourlyTotalCu,
      smoothedCu,
      capacityLimit,
      throttled: isThrottled,
      cumulativeBorrowPercent
    });
  });

  const avgCuDemand = hourKeys.length > 0 ? Math.round((totalCuHours / hourKeys.length) * 10) / 10 : 0;
  const recommended = recommendSkuForCu(peakSmoothedCu);

  // Engine Breakdown
  const engineBreakdown: EngineBreakdown[] = (Object.keys(engineMap) as ItemKind[])
    .filter(kind => engineMap[kind] > 0)
    .map(kind => ({
      kind,
      cuHours: Math.round((engineMap[kind] / 3600) * 100) / 100,
      percentage: totalCuSeconds > 0 ? Math.round((engineMap[kind] / totalCuSeconds) * 1000) / 10 : 0,
      color: ENGINE_COLORS[kind]
    }))
    .sort((a, b) => b.cuHours - a.cuHours);

  // Top Consumers
  const topConsumers: TopConsumerItem[] = Object.entries(itemMap)
    .map(([itemName, data]) => ({
      itemName,
      itemKind: data.itemKind,
      cuHours: Math.round((data.cuSeconds / 3600) * 100) / 100,
      percentage: totalCuSeconds > 0 ? Math.round((data.cuSeconds / totalCuSeconds) * 1000) / 10 : 0,
      operationCount: data.ops,
      maxBurstCu: Math.round(data.maxBurstCu * 10) / 10
    }))
    .sort((a, b) => b.cuHours - a.cuHours)
    .slice(0, 10);

  // Throttling Risk Score calculation (0 to 100)
  let throttlingRiskScore = 0;
  if (throttlingEvents > 0) throttlingRiskScore += 40;
  if (peakSmoothedCu > evaluatedCapacityLimit) throttlingRiskScore += 35;
  if (hourlyTimeSeries.some(p => p.cumulativeBorrowPercent > 80)) throttlingRiskScore += 25;
  throttlingRiskScore = Math.min(100, throttlingRiskScore);

  return {
    id: "telemetry-" + Date.now(),
    datasetName,
    sourceType,
    parsedAt: new Date().toISOString(),
    totalRecords: records.length + qualityIssues.length,
    validRecords: records.length,
    rejectedRecords: qualityIssues.length,
    timeRange: {
      start: startTime,
      end: endTime,
      durationHours
    },
    totalCuHours,
    avgCuDemand,
    peakCuDemand,
    peakTimestamp,
    recommendedSku: recommended.sku,
    recommendedSkuCu: recommended.cu,
    interactiveRatio,
    backgroundRatio,
    throttlingEventsCount: throttlingEvents,
    throttlingRiskScore,
    capacityLimitEvaluated: evaluatedCapacityLimit,
    engineBreakdown,
    hourlyTimeSeries,
    topConsumers,
    qualityIssues
  };
}

/**
 * Robust CSV parser that handles quoted commas, various column headers from
 * Microsoft Fabric Capacity Metrics app exports, and reports malformed rows.
 */
export function parseTelemetryCSV(
  csvContent: string,
  datasetName: string = "Custom CSV Telemetry",
  evaluatedCapacity: number = 64
): { summary: ObservabilitySummary; records: TelemetryRecord[] } {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  const qualityIssues: DataQualityIssue[] = [];
  const records: TelemetryRecord[] = [];

  if (lines.length <= 1) {
    qualityIssues.push({
      row: 1,
      reason: "CSV file is empty or contains only a header row.",
      rawSnippet: csvContent.slice(0, 100)
    });
    return {
      summary: analyzeTelemetryRecords([], datasetName, "csv_upload", qualityIssues, evaluatedCapacity),
      records: []
    };
  }

  // Parse header
  const headerTokens = parseCsvRow(lines[0]).map(h => h.trim().toLowerCase());

  // Find column indices
  const timestampIdx = headerTokens.findIndex(h =>
    h.includes("time") || h.includes("date") || h === "timestamp"
  );
  const itemIdx = headerTokens.findIndex(h =>
    h.includes("item name") || h.includes("itemname") || h.includes("artifact") || h === "item"
  );
  const kindIdx = headerTokens.findIndex(h =>
    h.includes("kind") || h.includes("type") || h.includes("workload") || h === "itemkind"
  );
  const opIdx = headerTokens.findIndex(h =>
    h.includes("operation name") || h.includes("operation") || h.includes("action")
  );
  const opTypeIdx = headerTokens.findIndex(h =>
    h.includes("operation type") || h.includes("op type") || h.includes("execution type")
  );
  const cuIdx = headerTokens.findIndex(h =>
    h.includes("cu") || h.includes("cuseconds") || h.includes("capacity unit")
  );
  const statusIdx = headerTokens.findIndex(h =>
    h.includes("status") || h.includes("state") || h.includes("result")
  );
  const userIdx = headerTokens.findIndex(h =>
    h.includes("user") || h.includes("principal") || h.includes("caller")
  );

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const tokens = parseCsvRow(rawLine);

    if (tokens.length < 2) {
      qualityIssues.push({
        row: i + 1,
        reason: "Row has insufficient columns.",
        rawSnippet: rawLine.slice(0, 80)
      });
      continue;
    }

    const rawTimestamp = timestampIdx >= 0 && tokens[timestampIdx] ? tokens[timestampIdx].trim() : "";
    if (!rawTimestamp) {
      qualityIssues.push({
        row: i + 1,
        reason: "Missing mandatory timestamp field.",
        rawSnippet: rawLine.slice(0, 80)
      });
      continue;
    }

    // Try parsing date
    const parsedDate = new Date(rawTimestamp);
    if (isNaN(parsedDate.getTime())) {
      qualityIssues.push({
        row: i + 1,
        reason: `Invalid timestamp format: "${rawTimestamp}".`,
        rawSnippet: rawLine.slice(0, 80)
      });
      continue;
    }

    const rawItemName = itemIdx >= 0 && tokens[itemIdx] ? tokens[itemIdx].trim() : `Artifact-${i}`;
    const rawKind = kindIdx >= 0 && tokens[kindIdx] ? tokens[kindIdx].trim() : "Other";
    const itemKind = normalizeItemKind(rawKind);

    const rawOpName = opIdx >= 0 && tokens[opIdx] ? tokens[opIdx].trim() : "Execution";
    const rawOpType = opTypeIdx >= 0 && tokens[opTypeIdx] ? tokens[opTypeIdx].trim() : "";
    const operationType = normalizeOperationType(rawOpType, itemKind);

    const rawCu = cuIdx >= 0 && tokens[cuIdx] ? tokens[cuIdx].replace(/,/g, "").trim() : "0";
    const cuVal = parseFloat(rawCu);
    const cuSeconds = isNaN(cuVal) || cuVal < 0 ? 0 : cuVal;

    const rawStatus = statusIdx >= 0 && tokens[statusIdx] ? tokens[statusIdx].trim() : "Success";
    const status = normalizeStatus(rawStatus);

    const user = userIdx >= 0 && tokens[userIdx] ? tokens[userIdx].trim() : undefined;

    records.push({
      id: `rec-${i}`,
      timestamp: parsedDate.toISOString(),
      itemName: rawItemName,
      itemKind,
      operationName: rawOpName,
      operationType,
      cuSeconds,
      capacityUnits: Math.round((cuSeconds / 30) * 10) / 10,
      status,
      user
    });
  }

  const summary = analyzeTelemetryRecords(records, datasetName, "csv_upload", qualityIssues, evaluatedCapacity);
  return { summary, records };
}

/**
 * Parse standard CSV line respecting quoted commas.
 */
function parseCsvRow(row: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let current = "";

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Parser for JSON telemetry exports.
 */
export function parseTelemetryJSON(
  jsonContent: string,
  datasetName: string = "Custom JSON Telemetry",
  evaluatedCapacity: number = 64
): { summary: ObservabilitySummary; records: TelemetryRecord[] } {
  const qualityIssues: DataQualityIssue[] = [];
  const records: TelemetryRecord[] = [];

  let rawData: unknown;
  try {
    rawData = JSON.parse(jsonContent);
  } catch (err: any) {
    qualityIssues.push({
      row: 0,
      reason: `Malformed JSON: ${err?.message || "Invalid syntax"}`,
      rawSnippet: jsonContent.slice(0, 100)
    });
    return {
      summary: analyzeTelemetryRecords([], datasetName, "json_upload", qualityIssues, evaluatedCapacity),
      records: []
    };
  }

  const arrayData = Array.isArray(rawData) ? rawData : (rawData as any)?.records || (rawData as any)?.items || [];

  if (!Array.isArray(arrayData) || arrayData.length === 0) {
    qualityIssues.push({
      row: 0,
      reason: "JSON payload does not contain an array of telemetry items.",
      rawSnippet: jsonContent.slice(0, 100)
    });
    return {
      summary: analyzeTelemetryRecords([], datasetName, "json_upload", qualityIssues, evaluatedCapacity),
      records: []
    };
  }

  arrayData.forEach((item: any, idx: number) => {
    const validated = RawTelemetryRecordSchema.safeParse(item);
    if (!validated.success) {
      qualityIssues.push({
        row: idx + 1,
        reason: validated.error.issues.map(iss => iss.message).join("; "),
        rawSnippet: JSON.stringify(item).slice(0, 80)
      });
      return;
    }

    const d = validated.data;
    const parsedDate = new Date(d.timestamp);
    if (isNaN(parsedDate.getTime())) {
      qualityIssues.push({
        row: idx + 1,
        reason: `Invalid timestamp value: "${d.timestamp}"`,
        rawSnippet: JSON.stringify(item).slice(0, 80)
      });
      return;
    }

    const itemKind = normalizeItemKind(d.itemKind);
    const operationType = normalizeOperationType(d.operationType, itemKind);
    const status = normalizeStatus(d.status);

    records.push({
      id: `rec-json-${idx}`,
      timestamp: parsedDate.toISOString(),
      itemName: d.itemName,
      itemKind,
      operationName: d.operationName,
      operationType,
      cuSeconds: d.cuSeconds,
      capacityUnits: Math.round((d.cuSeconds / 30) * 10) / 10,
      status,
      user: d.user
    });
  });

  const summary = analyzeTelemetryRecords(records, datasetName, "json_upload", qualityIssues, evaluatedCapacity);
  return { summary, records };
}

/**
 * Compares actual observed telemetry against a planned scenario F-SKU.
 */
export function compareTelemetryWithScenario(
  telemetry: ObservabilitySummary,
  scenarioSku: string = "F64"
): ScenarioTelemetryComparison {
  const match = FABRIC_SKU_CAPACITIES.find(s => s.sku.toUpperCase() === scenarioSku.toUpperCase()) || {
    sku: "F64",
    cu: 64
  };
  const scenarioSkuCu = match.cu;

  const observedPeakCu = telemetry.peakCuDemand;
  const observedAvgCu = telemetry.avgCuDemand;
  const observedSmoothedPeakCu = telemetry.hourlyTimeSeries.reduce(
    (max, pt) => Math.max(max, pt.smoothedCu),
    0
  );

  const utilizationPercent = Math.round((observedSmoothedPeakCu / scenarioSkuCu) * 100);
  const headroomPercent = Math.round(((scenarioSkuCu - observedSmoothedPeakCu) / scenarioSkuCu) * 100);

  let fitAssessment: ScenarioTelemetryComparison["fitAssessment"] = "Optimal";
  let riskSummary = "";
  let recommendation = "";

  if (telemetry.throttlingEventsCount > 0 || observedSmoothedPeakCu > scenarioSkuCu * 1.05) {
    fitAssessment = "Critical Throttling Risk";
    riskSummary = `Observed smoothed demand (${observedSmoothedPeakCu} CU) exceeds planned ${scenarioSku} (${scenarioSkuCu} CU) limit with active throttling.`;
    recommendation = `Upgrade scenario capacity to ${telemetry.recommendedSku} (${telemetry.recommendedSkuCu} CU) or reschedule heavy background jobs out of peak interactive windows.`;
  } else if (observedSmoothedPeakCu > scenarioSkuCu * 0.85) {
    fitAssessment = "Under-Provisioned";
    riskSummary = `Capacity utilization is ${utilizationPercent}%, leaving less than 15% headroom for unexpected concurrency bursts.`;
    recommendation = `Consider upsizing to the next tier or enabling automated burst smoothing to avoid interactive query delays.`;
  } else if (utilizationPercent < 35 && scenarioSkuCu > 8) {
    fitAssessment = "Over-Provisioned";
    riskSummary = `Capacity utilization is only ${utilizationPercent}%. You are paying for ${scenarioSkuCu} CUs but peak smoothed demand is only ${observedSmoothedPeakCu} CUs.`;
    recommendation = `Downsize to ${telemetry.recommendedSku} (${telemetry.recommendedSkuCu} CU) to save significant monthly cloud expenditure without risking performance.`;
  } else {
    fitAssessment = "Optimal";
    riskSummary = `Smoothed peak demand is well-matched to ${scenarioSku} (${scenarioSkuCu} CU) with ${headroomPercent}% safety headroom.`;
    recommendation = `Maintain current ${scenarioSku} sizing. Monitor monthly growth to adjust before utilization exceeds 80%.`;
  }

  return {
    scenarioSku: match.sku,
    scenarioSkuCu,
    observedPeakCu,
    observedAvgCu,
    observedSmoothedPeakCu,
    fitAssessment,
    headroomPercent,
    utilizationPercent,
    riskSummary,
    recommendation
  };
}

// ============================================================================
// BUILT-IN REALISTIC ENTERPRISE SAMPLE DATASETS
// ============================================================================

export function getSampleMedallionLakehouse(): ObservabilitySummary {
  const records: TelemetryRecord[] = [];
  const baseDate = "2026-10-26";

  // 24 hours of enterprise medallion lakehouse operations on F64
  for (let hour = 0; hour < 24; hour++) {
    const hourStr = String(hour).padStart(2, "0");
    const ts = `${baseDate}T${hourStr}:15:00.000Z`;

    // 01:00 - 05:00: Nightly Medallion Ingestion & Transformation
    if (hour >= 1 && hour <= 5) {
      records.push({
        id: `rec-batch-bronze-${hour}`,
        timestamp: ts,
        itemName: "Raw Ingestion Pipeline",
        itemKind: "Pipeline",
        operationName: "Copy Activity ADF",
        operationType: "Background",
        cuSeconds: 36000, // 10 CU-hours
        capacityUnits: 32,
        status: "Success"
      });
      records.push({
        id: `rec-batch-silver-${hour}`,
        timestamp: `${baseDate}T${hourStr}:30:00.000Z`,
        itemName: "Silver Delta Cleansing",
        itemKind: "Notebook",
        operationName: "Spark Job PySpark",
        operationType: "Background",
        cuSeconds: 43200, // 12 CU-hours
        capacityUnits: 38,
        status: "Success"
      });
    }

    // 06:00 - 08:00: Gold layer aggregation
    if (hour >= 6 && hour <= 8) {
      records.push({
        id: `rec-gold-${hour}`,
        timestamp: ts,
        itemName: "Gold Enterprise Warehouse",
        itemKind: "Warehouse",
        operationName: "SQL Stored Procedure Merge",
        operationType: "Background",
        cuSeconds: 28800, // 8 CU-hours
        capacityUnits: 25,
        status: "Success"
      });
    }

    // 08:00 - 18:00: Business Hours Power BI & Interactive Reporting
    if (hour >= 8 && hour <= 18) {
      const concurrencyFactor = hour === 9 || hour === 14 ? 1.4 : 1.0;
      records.push({
        id: `rec-pbi-exec-${hour}`,
        timestamp: ts,
        itemName: "Executive Financial Model",
        itemKind: "SemanticModel",
        operationName: "Direct Lake Query Engine",
        operationType: "Interactive",
        cuSeconds: Math.round(54000 * concurrencyFactor), // ~15 - 27 CU-hours
        capacityUnits: Math.round(42 * concurrencyFactor),
        status: "Success"
      });
      records.push({
        id: `rec-pbi-sales-${hour}`,
        timestamp: `${baseDate}T${hourStr}:45:00.000Z`,
        itemName: "Global Sales Dashboard",
        itemKind: "SemanticModel",
        operationName: "DAX Evaluation",
        operationType: "Interactive",
        cuSeconds: Math.round(25200 * concurrencyFactor),
        capacityUnits: Math.round(20 * concurrencyFactor),
        status: "Success"
      });
    }

    // Steady background stream: Real-time telemetry
    records.push({
      id: `rec-rt-${hour}`,
      timestamp: `${baseDate}T${hourStr}:50:00.000Z`,
      itemName: "IoT Fleet Telemetry Eventhouse",
      itemKind: "Eventhouse",
      operationName: "Continuous Ingest & Index",
      operationType: "Background",
      cuSeconds: 7200, // 2 CU-hours
      capacityUnits: 4,
      status: "Success"
    });
  }

  return analyzeTelemetryRecords(
    records,
    "Enterprise Medallion Lakehouse (F64 Healthy)",
    "sample_medallion",
    [],
    64
  );
}

export function getSampleThrottledWorkload(): ObservabilitySummary {
  const records: TelemetryRecord[] = [];
  const baseDate = "2026-10-26";

  // F32 workload where morning reporting surge spikes past 32 CUs and triggers throttling
  for (let hour = 0; hour < 24; hour++) {
    const hourStr = String(hour).padStart(2, "0");
    const ts = `${baseDate}T${hourStr}:10:00.000Z`;

    // Background continuous pipeline
    records.push({
      id: `rec-thr-bg-${hour}`,
      timestamp: ts,
      itemName: "Unoptimized ETL Pipeline",
      itemKind: "Pipeline",
      operationName: "Full Table Reload",
      operationType: "Background",
      cuSeconds: 39600, // 11 CU-hours
      capacityUnits: 20,
      status: "Success"
    });

    // Morning spike 09:00 - 11:00 UTC exceeds F32 capacity
    if (hour >= 9 && hour <= 11) {
      records.push({
        id: `rec-thr-spike-${hour}`,
        timestamp: `${baseDate}T${hourStr}:25:00.000Z`,
        itemName: "Quarterly Revenue Dashboard",
        itemKind: "SemanticModel",
        operationName: "Complex Direct Lake Matrix",
        operationType: "Interactive",
        cuSeconds: 158400, // 44 CU-hours burst!
        capacityUnits: 58,
        status: hour === 9 ? "Success" : "Throttled"
      });
      records.push({
        id: `rec-thr-nb-${hour}`,
        timestamp: `${baseDate}T${hourStr}:40:00.000Z`,
        itemName: "Unscheduled Ad-Hoc Data Science",
        itemKind: "Notebook",
        operationName: "Pandas Model Training",
        operationType: "Interactive",
        cuSeconds: 72000, // 20 CU-hours burst
        capacityUnits: 35,
        status: "Throttled"
      });
    } else {
      // Normal interactive usage
      records.push({
        id: `rec-thr-norm-${hour}`,
        timestamp: `${baseDate}T${hourStr}:30:00.000Z`,
        itemName: "Operations Semantic Model",
        itemKind: "SemanticModel",
        operationName: "DAX Query",
        operationType: "Interactive",
        cuSeconds: 18000, // 5 CU-hours
        capacityUnits: 12,
        status: "Success"
      });
    }
  }

  return analyzeTelemetryRecords(
    records,
    "High-Concurrency Morning Peak & Throttling (F32)",
    "sample_throttled",
    [],
    32
  );
}

export function getSampleSparkBatchBurn(): ObservabilitySummary {
  const records: TelemetryRecord[] = [];
  const baseDate = "2026-10-26";

  // Heavy Spark batch workload on F16
  for (let hour = 0; hour < 24; hour++) {
    const hourStr = String(hour).padStart(2, "0");
    const ts = `${baseDate}T${hourStr}:05:00.000Z`;

    // Continuous 24-hour Spark job that slowly consumes borrow smoothing budget
    records.push({
      id: `rec-spark-stream-${hour}`,
      timestamp: ts,
      itemName: "Clickstream Kafka Structured Streaming",
      itemKind: "SparkJob",
      operationName: "Microbatch Delta Sink",
      operationType: "Background",
      cuSeconds: 32400, // 9 CU-hours
      capacityUnits: 14,
      status: "Success"
    });

    records.push({
      id: `rec-spark-clean-${hour}`,
      timestamp: `${baseDate}T${hourStr}:35:00.000Z`,
      itemName: "Historical Partition Compaction",
      itemKind: "SparkJob",
      operationName: "OPTIMIZE Delta Table Z-Order",
      operationType: "Background",
      cuSeconds: 28800, // 8 CU-hours
      capacityUnits: 12,
      status: hour > 16 ? "Throttled" : "Success"
    });
  }

  return analyzeTelemetryRecords(
    records,
    "Unoptimized 24-hr Spark Batch Burn (F16)",
    "sample_spark",
    [],
    16
  );
}
