import { WorkloadCalculationSchema, EvaluationResponse } from "../types";

// F-SKU Reference mapping for calculations
const FABRIC_SKUS = [
  { name: "F2", cu: 2, pricePerHourUSD: 0.36 },
  { name: "F4", cu: 4, pricePerHourUSD: 0.72 },
  { name: "F8", cu: 8, pricePerHourUSD: 1.44 },
  { name: "F16", cu: 16, pricePerHourUSD: 2.88 },
  { name: "F32", cu: 32, pricePerHourUSD: 5.76 },
  { name: "F64", cu: 64, pricePerHourUSD: 11.52 },
  { name: "F128", cu: 128, pricePerHourUSD: 23.04 },
  { name: "F256", cu: 256, pricePerHourUSD: 46.08 },
  { name: "F512", cu: 512, pricePerHourUSD: 92.16 },
  { name: "F1024", cu: 1024, pricePerHourUSD: 184.32 },
  { name: "F2048", cu: 2048, pricePerHourUSD: 368.64 },
];

export function calculateCapacity(data: any): EvaluationResponse {
  try {
    // 1. Validate payload via Zod
    const payload = WorkloadCalculationSchema.parse(data);
    
    // 2. Perform Mathematical Workload Formulation
    // Data Factory component
    const dfCu = (payload.dataFactoryInput.monthlyPipelines / 730) 
      * payload.dataFactoryInput.avgActivities * 0.005 
      + (payload.dataFactoryInput.dataVolumeGb * 0.002);

    // Spark component
    const sparkCu = payload.sparkComputeInput.totalNodes 
      * payload.sparkComputeInput.vCoresPerNode 
      * (payload.sparkComputeInput.dailyRuntimeHours / 24) * 0.5;

    // Power BI component
    const pbiCu = payload.powerBiInput.peakConcurrentUsers 
      * (payload.powerBiInput.queryComplexityScale * 0.2);

    const calculatedCuBaseline = dfCu + sparkCu + pbiCu;

    // 3. Determine SKUs
    const requiredSafeCu = calculatedCuBaseline * 1.5; // 50% buffer
    let optimizedIndex = 0;
    let safeIndex = 0;

    for (let i = 0; i < FABRIC_SKUS.length; i++) {
      if (FABRIC_SKUS[i].cu >= calculatedCuBaseline && FABRIC_SKUS[optimizedIndex].cu < calculatedCuBaseline) {
        optimizedIndex = i;
      }
      if (FABRIC_SKUS[i].cu >= requiredSafeCu && FABRIC_SKUS[safeIndex].cu < requiredSafeCu) {
        safeIndex = i;
      }
    }

    // Cap at max SKU if required
    if (calculatedCuBaseline > 2048) {
      optimizedIndex = FABRIC_SKUS.length - 1;
      safeIndex = FABRIC_SKUS.length - 1;
    }

    const optimizedSku = FABRIC_SKUS[optimizedIndex];
    const safeSku = FABRIC_SKUS[safeIndex];

    // Alternatives: Lower cost (1 tier below) and Future Ready (1 tier above)
    const lowerIndex = Math.max(0, optimizedIndex - 1);
    const futureIndex = Math.min(FABRIC_SKUS.length - 1, optimizedIndex + 1);
    const lowerCostSku = FABRIC_SKUS[lowerIndex];
    const futureReadySku = FABRIC_SKUS[futureIndex];

    // 4. Financial calculations (1-Year Reserved Instance is ~41% cheaper)
    const payAsYouGoHourlyCost = optimizedSku.pricePerHourUSD;
    const payAsYouGoMonthlyEstimate = payAsYouGoHourlyCost * 730;
    const reservedInstanceHourlyCost = payAsYouGoHourlyCost * 0.59; // 41% savings
    const reservedInstanceMonthlyEstimate = reservedInstanceHourlyCost * 730;
    const potentialSavingsMonthly = payAsYouGoMonthlyEstimate - reservedInstanceMonthlyEstimate;

    // 5. Throttling Analysis (heuristic based on buffer)
    const bufferPercent = ((optimizedSku.cu - calculatedCuBaseline) / calculatedCuBaseline) * 100;
    const optimizedTierRiskPercentage = Math.max(0, Math.min(100, Math.round(50 - (bufferPercent * 2))));

    // 6. Enterprise Recommendation Details
    const confidenceScore = Math.min(96, Math.max(85, Math.round(92 + (bufferPercent > 20 ? 4 : -2))));
    
    const reasons = [
      `Provides ${optimizedSku.cu} Capacity Units (CUs) to comfortably process ${calculatedCuBaseline.toFixed(1)} baseline CU workload demand.`,
      payload.powerBiInput.peakConcurrentUsers > 50 
        ? `Handles peak concurrency of ${payload.powerBiInput.peakConcurrentUsers} Power BI users.` 
        : `Sufficient compute headroom for background Data Factory and Spark ETL jobs.`,
      optimizedSku.cu >= 64 
        ? `Unlocks organizational Power BI Free user report viewing and Microsoft Fabric Copilot features.` 
        : `Cost-effective entry tier for small-to-medium team operations.`
    ];

    // Forecast upgrade timeline (assuming 25% annual data growth)
    const growthCuYear1 = calculatedCuBaseline * 1.25;
    const upgradeTimeline = growthCuYear1 > optimizedSku.cu 
      ? "Estimated Upgrade Milestone: Q1 2027 (Within 12 Months)" 
      : "Estimated Upgrade Milestone: Q2 2028 (2+ Years Capacity Headroom)";

    const assumptions = [
      "Microsoft Fabric PAYG baseline pricing at $0.18/CU/hour (US East / West region standard).",
      "1-Year Reserved Capacity pricing calculated with standard ~41% commitment discount.",
      "Background job (Spark / Data Factory) smoothing window of 24 hours.",
      "Interactive Power BI DAX query smoothing window of 5 minutes.",
      "Monthly operating estimate calculated at 730 hours/month."
    ];

    return {
      success: true,
      calculatedCuBaseline: Number(calculatedCuBaseline.toFixed(2)),
      confidenceScore,
      reasons,
      upgradeTimeline,
      alternatives: {
        lowerCostSku: lowerCostSku.name,
        lowerCostCu: lowerCostSku.cu,
        futureReadySku: futureReadySku.name,
        futureReadyCu: futureReadySku.cu,
      },
      assumptions,
      targetSkuRecommendation: {
        safeSkuName: safeSku.name,
        safeSkuCu: safeSku.cu,
        costOptimizedSkuName: optimizedSku.name,
        costOptimizedSkuCu: optimizedSku.cu,
      },
      financialSummary: {
        payAsYouGoHourlyCost: Number(payAsYouGoHourlyCost.toFixed(3)),
        payAsYouGoMonthlyEstimate: Number(payAsYouGoMonthlyEstimate.toFixed(2)),
        reservedInstanceHourlyCost: Number(reservedInstanceHourlyCost.toFixed(3)),
        reservedInstanceMonthlyEstimate: Number(reservedInstanceMonthlyEstimate.toFixed(2)),
        potentialSavingsMonthly: Number(potentialSavingsMonthly.toFixed(2)),
      },
      throttlingAnalysis: {
        optimizedTierRiskPercentage,
        mitigationSmoothingHours: 24,
      },
    };
  } catch (error: any) {
    return { 
      success: false, 
      calculatedCuBaseline: 0,
      confidenceScore: 0,
      reasons: [],
      upgradeTimeline: '',
      alternatives: { lowerCostSku: '', lowerCostCu: 0, futureReadySku: '', futureReadyCu: 0 },
      assumptions: [],
      targetSkuRecommendation: { safeSkuName: '', safeSkuCu: 0, costOptimizedSkuName: '', costOptimizedSkuCu: 0 },
      financialSummary: { payAsYouGoHourlyCost: 0, payAsYouGoMonthlyEstimate: 0, reservedInstanceHourlyCost: 0, reservedInstanceMonthlyEstimate: 0, potentialSavingsMonthly: 0 },
      throttlingAnalysis: { optimizedTierRiskPercentage: 0, mitigationSmoothingHours: 24 },
      error: error.message 
    };
  }
}
