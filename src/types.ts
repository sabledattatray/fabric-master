import { z } from 'zod';

export const WorkloadCalculationSchema = z.object({
  regionId: z.string().min(2).max(32).regex(/^[a-z0-9-]+$/),
  currencyCode: z.string().length(3).toUpperCase(),
  currentSkuCu: z.number().optional().nullable(),
  dataFactoryInput: z.object({
    monthlyPipelines: z.number().nonnegative().max(10000000),
    avgActivities: z.number().int().nonnegative().max(500),
    dataVolumeGb: z.number().nonnegative().max(50000000)
  }),
  sparkComputeInput: z.object({
    totalNodes: z.number().int().positive().max(2048),
    vCoresPerNode: z.number().int().positive().refine(val => [2, 4, 8, 16, 32, 64].includes(val), {
      message: "Must align to standard cloud vCore configurations."
    }),
    dailyRuntimeHours: z.number().nonnegative().max(24)
  }),
  powerBiInput: z.object({
    peakConcurrentUsers: z.number().int().nonnegative().max(500000),
    queryComplexityScale: z.number().int().min(1).max(5)
  })
});

export type WorkloadCalculationInput = z.infer<typeof WorkloadCalculationSchema>;

export interface SkuRecommendation {
  safeSkuName: string;
  safeSkuCu: number;
  costOptimizedSkuName: string;
  costOptimizedSkuCu: number;
}

export interface FinancialSummary {
  payAsYouGoHourlyCost: number;
  payAsYouGoMonthlyEstimate: number;
  reservedInstanceHourlyCost: number;
  reservedInstanceMonthlyEstimate: number;
  potentialSavingsMonthly: number;
}

export interface ThrottlingAnalysis {
  optimizedTierRiskPercentage: number;
  mitigationSmoothingHours: number;
}

export interface EvaluationResponse {
  success: boolean;
  calculatedCuBaseline: number;
  confidenceScore: number;
  reasons: string[];
  upgradeTimeline: string;
  alternatives: {
    lowerCostSku: string;
    lowerCostCu: number;
    futureReadySku: string;
    futureReadyCu: number;
  };
  assumptions: string[];
  targetSkuRecommendation: SkuRecommendation;
  financialSummary: FinancialSummary;
  throttlingAnalysis: ThrottlingAnalysis;
  error?: string;
}
