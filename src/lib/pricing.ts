/**
 * Advanced FinOps & Pricing Subsystem (Fabric Master v4.0 - Phase 5)
 * Source-backed, multi-regional pricing engine with sensitivity analysis and explainable math.
 */

import { WorkloadCalculationInput, EvaluationResponse } from "../types";
import { calculateCapacity } from "./calculator";

export interface RegionPricing {
  id: string;
  name: string;
  currency: string;
  ratePerCuHourUSD: number;
  multiplier: number; // Multiplier relative to US East ($0.1800/CU/hr)
  sourceUrl: string;
  verifiedDate: string;
  status: "verified" | "preview" | "outdated";
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  exchangeRateToUSD: number; // USD per 1 unit of foreign currency (or vice versa)
  format: (amount: number) => string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: {
    code: "USD",
    symbol: "$",
    exchangeRateToUSD: 1.0,
    format: (amt) => `$${amt.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    exchangeRateToUSD: 1.08,
    format: (amt) => `€${(amt / 1.08).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    exchangeRateToUSD: 1.29,
    format: (amt) => `£${(amt / 1.29).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  AUD: {
    code: "AUD",
    symbol: "A$",
    exchangeRateToUSD: 0.65,
    format: (amt) => `A$${(amt / 0.65).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  INR: {
    code: "INR",
    symbol: "₹",
    exchangeRateToUSD: 0.012,
    format: (amt) => `₹${Math.round(amt / 0.012).toLocaleString("en-IN")}`,
  },
};

export const REGIONAL_PRICING_CATALOG: Record<string, RegionPricing> = {
  eastus: {
    id: "eastus",
    name: "US East (Virginia)",
    currency: "USD",
    ratePerCuHourUSD: 0.1800,
    multiplier: 1.0,
    sourceUrl: "https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/",
    verifiedDate: "October 2026",
    status: "verified",
  },
  westus2: {
    id: "westus2",
    name: "US West 2 (Washington)",
    currency: "USD",
    ratePerCuHourUSD: 0.1800,
    multiplier: 1.0,
    sourceUrl: "https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/",
    verifiedDate: "October 2026",
    status: "verified",
  },
  westeurope: {
    id: "westeurope",
    name: "West Europe (Netherlands)",
    currency: "USD",
    ratePerCuHourUSD: 0.1980,
    multiplier: 1.10,
    sourceUrl: "https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/",
    verifiedDate: "October 2026",
    status: "verified",
  },
  northeurope: {
    id: "northeurope",
    name: "North Europe (Ireland)",
    currency: "USD",
    ratePerCuHourUSD: 0.1980,
    multiplier: 1.10,
    sourceUrl: "https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/",
    verifiedDate: "October 2026",
    status: "verified",
  },
  uksouth: {
    id: "uksouth",
    name: "UK South (London)",
    currency: "USD",
    ratePerCuHourUSD: 0.2016,
    multiplier: 1.12,
    sourceUrl: "https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/",
    verifiedDate: "October 2026",
    status: "verified",
  },
  southeastasia: {
    id: "southeastasia",
    name: "Southeast Asia (Singapore)",
    currency: "USD",
    ratePerCuHourUSD: 0.2160,
    multiplier: 1.20,
    sourceUrl: "https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/",
    verifiedDate: "October 2026",
    status: "verified",
  },
  australiaeast: {
    id: "australiaeast",
    name: "Australia East (Sydney)",
    currency: "USD",
    ratePerCuHourUSD: 0.2160,
    multiplier: 1.20,
    sourceUrl: "https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/",
    verifiedDate: "October 2026",
    status: "verified",
  },
  centralindia: {
    id: "centralindia",
    name: "Central India (Pune)",
    currency: "USD",
    ratePerCuHourUSD: 0.2160,
    multiplier: 1.20,
    sourceUrl: "https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/",
    verifiedDate: "October 2026",
    status: "verified",
  },
};

export const PRICING_PROVENANCE_METADATA = {
  version: "4.0.2026.10",
  verifiedDate: "October 2026",
  source: "Microsoft Azure Pricing Calculator & Microsoft Fabric Official Pricing",
  sourceUrl: "https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/",
  baselineRegion: "eastus",
  baselineRateUSD: 0.1800,
  reservedDiscountPercent: 40.56, // ~41% official 1-year commitment discount
  operatingHoursPerMonth: 730,
};

// Operating Hours Profiles
export type OperatingProfileKey = "continuous" | "business" | "devtest" | "custom";

export interface OperatingHoursProfile {
  id: OperatingProfileKey;
  label: string;
  hoursPerMonth: number;
  description: string;
}

export const OPERATING_HOURS_PROFILES: Record<OperatingProfileKey, OperatingHoursProfile> = {
  continuous: {
    id: "continuous",
    label: "24/7 Continuous Production (730h)",
    hoursPerMonth: 730,
    description: "Always-on capacity serving continuous ETL pipelines and multi-regional interactive users."
  },
  business: {
    id: "business",
    label: "Business Hours (220h - 10h × 22d)",
    hoursPerMonth: 220,
    description: "Active work hours (8 AM – 6 PM weekdays) with automated nightly and weekend capacity pausing."
  },
  devtest: {
    id: "devtest",
    label: "Dev / Test Batches (100h)",
    hoursPerMonth: 100,
    description: "Scheduled non-production testing, batch evaluations, and development sandboxes."
  },
  custom: {
    id: "custom",
    label: "Custom Operational Schedule",
    hoursPerMonth: 350,
    description: "User-defined active runtime hours per monthly billing cycle."
  }
};

// Advanced Reservation Economics Model
export interface ReservationEconomics {
  skuCu: number;
  regionId: string;
  currencyCode: string;
  operatingHours: number;
  hourlyPaygUSD: number;
  monthlyPaygUSD: number;
  annualPaygUSD: number;
  hourlyReservedUSD: number;
  monthlyReservedCommitmentUSD: number; // Fixed 730h commitment
  annualReservedCommitmentUSD: number;
  unusedCommitmentUSD: number; // Cost of idle reserved hours when operatingHours < 730
  netMonthlyCostUSD: number;
  netAnnualCostUSD: number;
  breakEvenOperatingHoursPerMonth: number; // ~434 hours/month
  effectiveSavingsUSD: number;
  effectiveSavingsPercent: number;
  isReservationRecommended: boolean;
  recommendationReason: string;
  formattedMonthlyPayg: string;
  formattedMonthlyReserved: string;
  formattedNetCost: string;
  formattedSavings: string;
}

export function calculateReservationEconomics(
  skuCu: number,
  regionId: string = "eastus",
  currencyCode: string = "USD",
  operatingHours: number = 730
): ReservationEconomics {
  const region = REGIONAL_PRICING_CATALOG[regionId] || REGIONAL_PRICING_CATALOG.eastus;
  const currency = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const hours = Math.max(0, Math.min(730, operatingHours));

  const hourlyPaygUSD = skuCu * region.ratePerCuHourUSD;
  const monthlyPaygUSD = hourlyPaygUSD * hours;
  const annualPaygUSD = monthlyPaygUSD * 12;

  // 1-Year reservation commitment discount in Azure is 40.56% (multiplier 0.5944)
  // An Azure Reservation charges for 730 hours every month regardless of whether the capacity is paused or active!
  const hourlyReservedUSD = hourlyPaygUSD * 0.5944;
  const monthlyReservedCommitmentUSD = hourlyReservedUSD * 730;
  const annualReservedCommitmentUSD = monthlyReservedCommitmentUSD * 12;

  // Break-even operating hours: hourlyReserved * 730 = hourlyPayg * hours
  // hours = (0.5944 * 730) = 433.912 hours/month (~434 hours)
  const breakEvenHours = 434;

  const unusedHours = Math.max(0, 730 - hours);
  const unusedCommitmentUSD = hourlyReservedUSD * unusedHours;

  const effectiveSavingsUSD = monthlyPaygUSD - monthlyReservedCommitmentUSD;
  const effectiveSavingsPercent = monthlyPaygUSD > 0
    ? Number(((effectiveSavingsUSD / monthlyPaygUSD) * 100).toFixed(1))
    : 0;

  const isReservationRecommended = hours >= breakEvenHours;
  const recommendationReason = isReservationRecommended
    ? `At ${hours} operating hrs/mo (above the 434h break-even threshold), a 1-year reservation delivers genuine cost savings of ${currency.format(effectiveSavingsUSD)}/mo.`
    : `At ${hours} operating hrs/mo (below the 434h break-even threshold), Pay-As-You-Go with automated capacity pause saves ${currency.format(Math.abs(effectiveSavingsUSD))}/mo over a fixed 1-year reservation commitment.`;

  return {
    skuCu,
    regionId: region.id,
    currencyCode: currency.code,
    operatingHours: hours,
    hourlyPaygUSD,
    monthlyPaygUSD,
    annualPaygUSD,
    hourlyReservedUSD,
    monthlyReservedCommitmentUSD,
    annualReservedCommitmentUSD,
    unusedCommitmentUSD,
    netMonthlyCostUSD: isReservationRecommended ? monthlyReservedCommitmentUSD : monthlyPaygUSD,
    netAnnualCostUSD: (isReservationRecommended ? monthlyReservedCommitmentUSD : monthlyPaygUSD) * 12,
    breakEvenOperatingHoursPerMonth: breakEvenHours,
    effectiveSavingsUSD,
    effectiveSavingsPercent,
    isReservationRecommended,
    recommendationReason,
    formattedMonthlyPayg: currency.format(monthlyPaygUSD),
    formattedMonthlyReserved: currency.format(monthlyReservedCommitmentUSD),
    formattedNetCost: currency.format(isReservationRecommended ? monthlyReservedCommitmentUSD : monthlyPaygUSD),
    formattedSavings: currency.format(Math.abs(effectiveSavingsUSD))
  };
}

// Unsupported Regions & Disclaimers Catalog
export interface UnsupportedRegion {
  id: string;
  name: string;
  category: "sovereign" | "government" | "preview" | "unsupported";
  statusReason: string;
  recommendation: string;
}

export const UNSUPPORTED_REGIONS_CATALOG: UnsupportedRegion[] = [
  {
    id: "chinaeast2",
    name: "China East 2 (Shanghai - 21Vianet)",
    category: "sovereign",
    statusReason: "Operated by 21Vianet under independent sovereign cloud licensing; Azure Global Fabric SKUs and global pricing do not apply.",
    recommendation: "Consult 21Vianet Microsoft Enterprise Agreement representatives for isolated China region SKU pricing."
  },
  {
    id: "usgovvirginia",
    name: "Azure Government (US Gov Virginia)",
    category: "government",
    statusReason: "FedRAMP High / DoD IL5 compliance boundary. Microsoft Fabric availability and reservations are subject to Azure Government GCC High roadmaps.",
    recommendation: "Contact Azure Government account team for specialized DISA/FedRAMP capacity schedules."
  },
  {
    id: "qatarcentral",
    name: "Qatar Central (Doha)",
    category: "preview",
    statusReason: "Regional capacity constraints. Fabric reservation entitlements and F-SKU allocations are subject to regional quota approvals.",
    recommendation: "Use UAE North or West Europe as nearby production baselines until broad availability is certified."
  }
];

export function validateRegionPricingSupport(regionId: string): {
  isSupported: boolean;
  region?: RegionPricing;
  unsupportedInfo?: UnsupportedRegion;
} {
  if (REGIONAL_PRICING_CATALOG[regionId]) {
    return { isSupported: true, region: REGIONAL_PRICING_CATALOG[regionId] };
  }
  const unsupp = UNSUPPORTED_REGIONS_CATALOG.find(u => u.id === regionId);
  return {
    isSupported: false,
    unsupportedInfo: unsupp || {
      id: regionId,
      name: `Region ${regionId}`,
      category: "unsupported",
      statusReason: "Region is not published in Microsoft Fabric Azure Commercial pricing table.",
      recommendation: "Select an official commercial Azure region (e.g. US East or West Europe)."
    }
  };
}

// Configurable Headroom Sizing Options
export interface HeadroomOption {
  percent: number;
  label: string;
  description: string;
}

export const HEADROOM_OPTIONS: HeadroomOption[] = [
  { percent: 25, label: "25% Lean Headroom", description: "Tight budget constraint; higher risk of interactive queuing during concurrency spikes." },
  { percent: 50, label: "50% Standard Recommended", description: "Default enterprise buffer balancing cost efficiency with peak smoothing runway." },
  { percent: 75, label: "75% High Growth", description: "Accommodates rapid monthly data asset growth and large ad-hoc Spark jobs." },
  { percent: 100, label: "100% Redundant (2x)", description: "Mission-critical estate with zero tolerance for throttling or direct query degradation." }
];

export function calculateConfiguredHeadroom(
  baselineCu: number,
  headroomPercent: number = 50
): {
  targetBufferedCu: number;
  recommendedSku: string;
  recommendedSkuCu: number;
} {
  const bufferFactor = 1 + Math.max(0, headroomPercent) / 100;
  const targetBufferedCu = Number((baselineCu * bufferFactor).toFixed(2));
  
  const skus = [
    { name: "F2", cu: 2 },
    { name: "F4", cu: 4 },
    { name: "F8", cu: 8 },
    { name: "F16", cu: 16 },
    { name: "F32", cu: 32 },
    { name: "F64", cu: 64 },
    { name: "F128", cu: 128 },
    { name: "F256", cu: 256 },
    { name: "F512", cu: 512 },
    { name: "F1024", cu: 1024 },
    { name: "F2048", cu: 2048 },
  ];

  const matched = skus.find(s => s.cu >= targetBufferedCu) || skus[skus.length - 1];
  return {
    targetBufferedCu,
    recommendedSku: matched.name,
    recommendedSkuCu: matched.cu
  };
}

export interface FinOpsProvenanceMetadata {
  calculationEngineVersion: string;
  pricingDatasetVersion: string;
  regionId: string;
  regionName: string;
  currencyCode: string;
  selectedSku: string;
  selectedSkuCu: number;
  operatingHoursPerMonth: number;
  assumptions: string[];
  sourceReference: string;
  sourceUrl: string;
  retrievalDate: string;
  calculationTimestamp: string;
  warningsAndExclusions: string[];
}

export function getFinOpsResultMetadata(
  regionId: string,
  currencyCode: string,
  skuName: string,
  skuCu: number,
  operatingHours: number
): FinOpsProvenanceMetadata {
  const region = REGIONAL_PRICING_CATALOG[regionId] || REGIONAL_PRICING_CATALOG.eastus;
  return {
    calculationEngineVersion: "4.0.2026.10",
    pricingDatasetVersion: "4.0.2026.10",
    regionId: region.id,
    regionName: region.name,
    currencyCode,
    selectedSku: skuName,
    selectedSkuCu: skuCu,
    operatingHoursPerMonth: operatingHours,
    assumptions: [
      "Pricing based on official Microsoft Azure Fabric pricing (October 2026)",
      "Standard monthly baseline models 730 hours/month",
      "1-Year Reservation discount is 40.56% (multiplier 0.5944)",
      "Storage (OneLake ADLS Gen2 Delta Parquet) billed separately at ~$0.023/GB/mo",
      "Network egress across Azure regions billed per standard Azure networking schedules"
    ],
    sourceReference: "Microsoft Fabric Pricing Overview & Azure Pricing Calculator",
    sourceUrl: "https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/",
    retrievalDate: "October 2026",
    calculationTimestamp: new Date().toISOString(),
    warningsAndExclusions: [
      "Reservations require a 1-year continuous commitment and charge for 730h/month regardless of usage.",
      "Workloads running under 434 operating hours/month achieve lower cost via Pay-As-You-Go with auto-pause.",
      "Sovereign clouds (China 21Vianet, Azure Government) have separate licensing agreements."
    ]
  };
}

export interface RegionalCostComparison {
  regionId: string;
  regionName: string;
  ratePerCuHourUSD: number;
  monthlyPayg: number;
  monthlyReserved: number;
  annualSavings: number;
  formattedPayg: string;
  formattedReserved: string;
}

export function getRegionalComparison(
  skuCu: number,
  currencyCode: string = "USD",
  hoursPerMonth: number = 730
): RegionalCostComparison[] {
  const currency = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;

  return Object.values(REGIONAL_PRICING_CATALOG).map((reg) => {
    const hourlyRate = skuCu * reg.ratePerCuHourUSD;
    const monthlyPayg = hourlyRate * hoursPerMonth;
    const monthlyReserved = hourlyRate * 0.5944 * 730; // 1-Year Reserved fixed 730h commitment
    const annualSavings = (monthlyPayg - monthlyReserved) * 12;

    return {
      regionId: reg.id,
      regionName: reg.name,
      ratePerCuHourUSD: reg.ratePerCuHourUSD,
      monthlyPayg,
      monthlyReserved,
      annualSavings,
      formattedPayg: currency.format(monthlyPayg),
      formattedReserved: currency.format(monthlyReserved),
    };
  });
}

export interface SensitivityVariant {
  label: string;
  type: "conservative" | "baseline" | "peak";
  description: string;
  inputs: WorkloadCalculationInput;
  evaluation: EvaluationResponse;
  deltaCuPercent: number;
  deltaCostPercent: number;
}

export function calculateSensitivityAnalysis(inputs: WorkloadCalculationInput): {
  conservative: SensitivityVariant;
  baseline: SensitivityVariant;
  peak: SensitivityVariant;
} {
  // Baseline Evaluation
  const baselineEval = calculateCapacity(inputs);

  // Conservative Variant: -20% workload volume & runtime
  const conservativeInputs: WorkloadCalculationInput = {
    ...inputs,
    dataFactoryInput: {
      ...inputs.dataFactoryInput,
      monthlyPipelines: Math.round(inputs.dataFactoryInput.monthlyPipelines * 0.8),
      dataVolumeGb: Math.round(inputs.dataFactoryInput.dataVolumeGb * 0.8),
    },
    sparkComputeInput: {
      ...inputs.sparkComputeInput,
      dailyRuntimeHours: Number((inputs.sparkComputeInput.dailyRuntimeHours * 0.8).toFixed(1)),
    },
    powerBiInput: {
      ...inputs.powerBiInput,
      peakConcurrentUsers: Math.max(1, Math.round(inputs.powerBiInput.peakConcurrentUsers * 0.8)),
    },
  };
  const conservativeEval = calculateCapacity(conservativeInputs);

  // Peak Variant: +50% concurrency, +25% pipeline & data volume
  const peakInputs: WorkloadCalculationInput = {
    ...inputs,
    dataFactoryInput: {
      ...inputs.dataFactoryInput,
      monthlyPipelines: Math.round(inputs.dataFactoryInput.monthlyPipelines * 1.25),
      dataVolumeGb: Math.round(inputs.dataFactoryInput.dataVolumeGb * 1.25),
    },
    sparkComputeInput: {
      ...inputs.sparkComputeInput,
      dailyRuntimeHours: Math.min(24, Number((inputs.sparkComputeInput.dailyRuntimeHours * 1.25).toFixed(1))),
    },
    powerBiInput: {
      ...inputs.powerBiInput,
      peakConcurrentUsers: Math.round(inputs.powerBiInput.peakConcurrentUsers * 1.5),
    },
  };
  const peakEval = calculateCapacity(peakInputs);

  const baselineCu = baselineEval.calculatedCuBaseline || 1;
  const baselineCost = baselineEval.financialSummary.payAsYouGoMonthlyEstimate || 1;

  return {
    conservative: {
      label: "Conservative (-20%)",
      type: "conservative",
      description: "Low-demand assumption modeling non-peak periods or initial phased rollout.",
      inputs: conservativeInputs,
      evaluation: conservativeEval,
      deltaCuPercent: Math.round(((conservativeEval.calculatedCuBaseline - baselineCu) / baselineCu) * 100),
      deltaCostPercent: Math.round(
        ((conservativeEval.financialSummary.payAsYouGoMonthlyEstimate - baselineCost) / baselineCost) * 100
      ),
    },
    baseline: {
      label: "Baseline Demand",
      type: "baseline",
      description: "Current expected production workload configuration.",
      inputs,
      evaluation: baselineEval,
      deltaCuPercent: 0,
      deltaCostPercent: 0,
    },
    peak: {
      label: "Peak Burst (+50% / +25%)",
      type: "peak",
      description: "Stress test simulating month-end processing and high executive dashboard concurrency.",
      inputs: peakInputs,
      evaluation: peakEval,
      deltaCuPercent: Math.round(((peakEval.calculatedCuBaseline - baselineCu) / baselineCu) * 100),
      deltaCostPercent: Math.round(
        ((peakEval.financialSummary.payAsYouGoMonthlyEstimate - baselineCost) / baselineCost) * 100
      ),
    },
  };
}

export interface MathematicalExplanation {
  dfCu: number;
  dfFormula: string;
  sparkCu: number;
  sparkFormula: string;
  pbiCu: number;
  pbiFormula: string;
  compositeBaselineCu: number;
  bufferedSafeCu: number;
  safeHeadroomBuffer: number;
  recommendedSku: string;
  recommendedSkuCu: number;
  reasons: string[];
}

export function getStepByStepExplanation(inputs: WorkloadCalculationInput): MathematicalExplanation {
  // 1. Data Factory component
  const dfPipelines = inputs.dataFactoryInput.monthlyPipelines;
  const dfActivities = inputs.dataFactoryInput.avgActivities;
  const dfVolume = inputs.dataFactoryInput.dataVolumeGb;
  const dfCu = Number(
    ((dfPipelines / 730) * dfActivities * 0.005 + dfVolume * 0.002).toFixed(2)
  );
  const dfFormula = `(${dfPipelines.toLocaleString()} pipelines / 730h) × ${dfActivities} act × 0.005 CU + (${dfVolume.toLocaleString()} GB × 0.002 CU) = ${dfCu} CU`;

  // 2. Spark component
  const sparkNodes = inputs.sparkComputeInput.totalNodes;
  const sparkCores = inputs.sparkComputeInput.vCoresPerNode;
  const sparkHours = inputs.sparkComputeInput.dailyRuntimeHours;
  const sparkCu = Number((sparkNodes * sparkCores * (sparkHours / 24) * 0.5).toFixed(2));
  const sparkFormula = `${sparkNodes} nodes × ${sparkCores} vCores × (${sparkHours}h / 24h) × 0.5 (2:1 ratio) = ${sparkCu} CU`;

  // 3. Power BI component
  const pbiUsers = inputs.powerBiInput.peakConcurrentUsers;
  const pbiScale = inputs.powerBiInput.queryComplexityScale;
  const pbiCu = Number((pbiUsers * (pbiScale * 0.2)).toFixed(2));
  const pbiFormula = `${pbiUsers} concurrent viewers × (${pbiScale} scale × 0.2 CU) = ${pbiCu} CU`;

  const compositeBaselineCu = Number((dfCu + sparkCu + pbiCu).toFixed(2));
  const bufferedSafeCu = Number((compositeBaselineCu * 1.5).toFixed(2));

  const evaluation = calculateCapacity(inputs);

  return {
    dfCu,
    dfFormula,
    sparkCu,
    sparkFormula,
    pbiCu,
    pbiFormula,
    compositeBaselineCu,
    bufferedSafeCu,
    safeHeadroomBuffer: 50,
    recommendedSku: evaluation.targetSkuRecommendation.safeSkuName,
    recommendedSkuCu: evaluation.targetSkuRecommendation.safeSkuCu,
    reasons: evaluation.reasons,
  };
}
