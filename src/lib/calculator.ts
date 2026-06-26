import { WorkloadCalculationSchema } from "../types";

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

export function calculateCapacity(data: any) {
  try {
    // 1. Validate payload via Zod
    const payload = WorkloadCalculationSchema.parse(data);
    
    // 2. Perform Mathematical Workload Formulation
    // Note: This is an emulation of the actual proprietary CU equations
    
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
    let optimizedSku = FABRIC_SKUS[0];
    let safeSku = FABRIC_SKUS[0];

    for (const sku of FABRIC_SKUS) {
      if (sku.cu >= calculatedCuBaseline && optimizedSku.cu < calculatedCuBaseline) {
        optimizedSku = sku;
      }
      if (sku.cu >= requiredSafeCu && safeSku.cu < requiredSafeCu) {
        safeSku = sku;
      }
    }

    // If requirements exceed max SKU, cap to F2048
    if (calculatedCuBaseline > 2048) {
      optimizedSku = FABRIC_SKUS[FABRIC_SKUS.length - 1];
      safeSku = FABRIC_SKUS[FABRIC_SKUS.length - 1];
    }

    // 4. Financial calculations (estimating Reserved Instance is ~40% cheaper)
    const payAsYouGoHourlyCost = optimizedSku.pricePerHourUSD;
    const payAsYouGoMonthlyEstimate = payAsYouGoHourlyCost * 730;
    const reservedInstanceHourlyCost = payAsYouGoHourlyCost * 0.59; // 41% savings
    const reservedInstanceMonthlyEstimate = reservedInstanceHourlyCost * 730;
    const potentialSavingsMonthly = payAsYouGoMonthlyEstimate - reservedInstanceMonthlyEstimate;

    // 5. Throttling Analysis (heuristic based on buffer)
    const bufferPercent = ((optimizedSku.cu - calculatedCuBaseline) / calculatedCuBaseline) * 100;
    const optimizedTierRiskPercentage = Math.max(0, Math.min(100, Math.round(50 - (bufferPercent * 2))));

    return {
      success: true,
      calculatedCuBaseline: Number(calculatedCuBaseline.toFixed(2)),
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
    return { success: false, error: error.message };
  }
}
