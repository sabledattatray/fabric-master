import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ARTICLES } from '../src/data/articles';
import { FABRIC_SKU_DATA } from '../src/data/fskus';
import { calculateCapacity } from '../src/lib/calculator';

test('all original documentation URLs remain available, with explicit reference disposition', () => {
 assert.equal(ARTICLES.length,25); assert.equal(new Set(ARTICLES.map(a=>a.id)).size,25);
 assert.equal(ARTICLES.filter(a=>a.referenceOnly).length,13);
 assert.equal(ARTICLES.filter(a=>!a.referenceOnly).length,12);
 for(const a of ARTICLES) assert.ok(a.content.includes(a.referenceOnly?'full worked guide':'Official references'));
});
test('Copilot eligibility and free-viewer licensing are separate',()=>{
 assert.equal(FABRIC_SKU_DATA.find(s=>s.slug==='f2')?.copilotSupport,true);
 assert.equal(FABRIC_SKU_DATA.find(s=>s.slug==='f2')?.powerBiFreeUsers,false);
 assert.equal(FABRIC_SKU_DATA.find(s=>s.slug==='f64')?.powerBiFreeUsers,true);
});
const input={regionId:'eastus',currencyCode:'USD',dataFactoryInput:{monthlyPipelines:0,avgActivities:0,dataVolumeGb:0},sparkComputeInput:{totalNodes:1,vCoresPerNode:2,dailyRuntimeHours:0},powerBiInput:{peakConcurrentUsers:1800,queryComplexityScale:5}};
test('buffered demand above the largest tier never wraps back to F2',()=>{
 const r=calculateCapacity(input);assert.equal(r.success,true);assert.equal(r.calculatedCuBaseline,1800);assert.equal(r.targetSkuRecommendation.safeSkuCu,2048);assert.ok(r.targetSkuRecommendation.safeSkuCu>=r.targetSkuRecommendation.costOptimizedSkuCu);assert.match(r.assumptions[0],/not measured probabilities/);
});
test('all public documentation has rendered text, canonical URLs, and correct indexing',()=>{
 const sitemap=fs.readFileSync('public/sitemap.xml','utf8');
 for(const a of ARTICLES){const html=fs.readFileSync('dist/docs/'+a.id+'/index.html','utf8');assert.match(html,/<h1/);assert.ok(html.includes(a.title.replace(/&/g,'&amp;')));assert.ok(html.includes('https://fabric.dattasable.com/docs/'+a.id));assert.doesNotMatch(html,/fabric-master\.vercel\.app|ratingCount|aggregateRating/);if(a.referenceOnly){assert.match(html,/noindex, follow/);assert.ok(!sitemap.includes('/docs/'+a.id+'</loc>'));}else assert.ok(sitemap.includes('/docs/'+a.id+'</loc>'));}
});

// Phase 4: Unified Engineering Workspace Regression Tests
import { ScenarioSchema } from '../src/types';
import { INITIAL_REFERENCE_SCENARIOS, enrichScenario, importScenarioFromJSON } from '../src/lib/scenarios';

test('scenario schema validates version 4.0 and sanitizes malicious script tags', () => {
  const maliciousInput = {
    id: "scenario-test-xss",
    schemaVersion: "4.0",
    name: "Production <script>alert('xss')</script>Lakehouse",
    description: "Description with <img src=x onerror=alert(1)> tags",
    createdAt: "2026-10-26T10:00:00.000Z",
    updatedAt: "2026-10-26T10:00:00.000Z",
    region: "eastus",
    currency: "USD",
    inputs: {
      regionId: "eastus",
      currencyCode: "USD",
      dataFactoryInput: { monthlyPipelines: 1000, avgActivities: 5, dataVolumeGb: 100 },
      sparkComputeInput: { totalNodes: 2, vCoresPerNode: 8, dailyRuntimeHours: 4 },
      powerBiInput: { peakConcurrentUsers: 50, queryComplexityScale: 3 }
    },
    notes: "Notes with <script>evil()</script>",
    tags: ["<script>tag</script>", "Production"],
    evidenceLevel: "model_based"
  };

  const parsed = ScenarioSchema.safeParse(maliciousInput);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.ok(!parsed.data.name.includes("<script>"));
    assert.ok(!parsed.data.description?.includes("<img"));
    assert.ok(!parsed.data.notes?.includes("<script>"));
    assert.ok(!parsed.data.tags?.some(t => t.includes("<script>")));
    assert.equal(parsed.data.name, "Production alert('xss')Lakehouse");
  }
});

test('scenario import rejects malformed or corrupted payloads', () => {
  // Non-JSON string
  const res1 = importScenarioFromJSON("not-a-json");
  assert.equal(res1.success, false);

  // Invalid vCore count (7 is not in cloud standard [2,4,8,16,32,64])
  const invalidVcores = JSON.stringify({
    name: "Invalid vCores",
    inputs: {
      regionId: "eastus",
      currencyCode: "USD",
      dataFactoryInput: { monthlyPipelines: 10, avgActivities: 2, dataVolumeGb: 5 },
      sparkComputeInput: { totalNodes: 1, vCoresPerNode: 7, dailyRuntimeHours: 2 },
      powerBiInput: { peakConcurrentUsers: 10, queryComplexityScale: 2 }
    }
  });
  const res2 = importScenarioFromJSON(invalidVcores);
  assert.equal(res2.success, false);
  assert.match(res2.error || "", /vCore/);
});

test('scenario numerical parity and calculation engine consistency', () => {
  for (const ref of INITIAL_REFERENCE_SCENARIOS) {
    const directEval = calculateCapacity(ref.inputs);
    const enriched = enrichScenario(ref);
    assert.equal(enriched.evaluation?.success, true);
    assert.equal(enriched.evaluation?.calculatedCuBaseline, directEval.calculatedCuBaseline);
    assert.equal(enriched.evaluation?.targetSkuRecommendation.safeSkuName, directEval.targetSkuRecommendation.safeSkuName);
    assert.equal(enriched.evaluation?.financialSummary.payAsYouGoMonthlyEstimate, directEval.financialSummary.payAsYouGoMonthlyEstimate);
    assert.equal(enriched.evaluation?.financialSummary.reservedInstanceMonthlyEstimate, directEval.financialSummary.reservedInstanceMonthlyEstimate);
  }
});

// Phase 5: Advanced FinOps & Pricing Subsystem Tests
import {
  REGIONAL_PRICING_CATALOG,
  SUPPORTED_CURRENCIES,
  PRICING_PROVENANCE_METADATA,
  OPERATING_HOURS_PROFILES,
  calculateReservationEconomics,
  UNSUPPORTED_REGIONS_CATALOG,
  validateRegionPricingSupport,
  HEADROOM_OPTIONS,
  calculateConfiguredHeadroom,
  getFinOpsResultMetadata,
  getRegionalComparison,
  calculateSensitivityAnalysis,
  getStepByStepExplanation,
} from '../src/lib/pricing';

test('regional pricing catalog enforces official multi-region rates and multipliers', () => {
  assert.equal(REGIONAL_PRICING_CATALOG.eastus.ratePerCuHourUSD, 0.1800);
  assert.equal(REGIONAL_PRICING_CATALOG.westeurope.ratePerCuHourUSD, 0.1980);
  assert.equal(REGIONAL_PRICING_CATALOG.westeurope.multiplier, 1.10);
  assert.equal(REGIONAL_PRICING_CATALOG.uksouth.ratePerCuHourUSD, 0.2016);
  assert.equal(REGIONAL_PRICING_CATALOG.uksouth.multiplier, 1.12);
  assert.equal(REGIONAL_PRICING_CATALOG.australiaeast.ratePerCuHourUSD, 0.2160);
  assert.equal(REGIONAL_PRICING_CATALOG.centralindia.ratePerCuHourUSD, 0.2160);

  const comparison = getRegionalComparison(64, 'USD');
  assert.equal(comparison.length, 8);
  const usEast = comparison.find(c => c.regionId === 'eastus');
  assert.ok(usEast);
  assert.equal(usEast.monthlyPayg, 64 * 0.18 * 730);
  assert.equal(usEast.monthlyReserved, usEast.monthlyPayg * 0.5944);
});

test('reservation economics calculates break-even threshold and unused commitment across operating hours', () => {
  const skuCu = 64; // F64
  const hourlyRateEastUS = 64 * 0.18; // $11.52/hr
  const fixedMonthlyReserved = hourlyRateEastUS * 0.5944 * 730; // ~$4,998.80

  // 1. Full 24/7 Continuous (730 hours): 1-Year reservation is optimal
  const continuous = calculateReservationEconomics(skuCu, 'eastus', 'USD', 730);
  assert.equal(continuous.isReservationRecommended, true);
  assert.equal(continuous.operatingHours, 730);
  assert.equal(continuous.unusedCommitmentUSD, 0);
  assert.ok(continuous.effectiveSavingsUSD > 0);
  assert.equal(continuous.breakEvenOperatingHoursPerMonth, 434);

  // 2. Business Hours (220 hours): PAYG with auto-pause is cheaper than reservation
  const business = calculateReservationEconomics(skuCu, 'eastus', 'USD', 220);
  assert.equal(business.isReservationRecommended, false);
  assert.ok(business.effectiveSavingsUSD < 0); // Negative savings = reservation costs more than PAYG
  assert.ok(business.unusedCommitmentUSD > 0); // 510 idle hours wasted
  assert.match(business.recommendationReason, /Pay-As-You-Go with automated capacity pause saves/);

  // 3. Boundary Condition (0 hours): $0 PAYG, but 100% unused reservation commitment
  const zeroHours = calculateReservationEconomics(skuCu, 'eastus', 'USD', 0);
  assert.equal(zeroHours.monthlyPaygUSD, 0);
  assert.equal(zeroHours.unusedCommitmentUSD, fixedMonthlyReserved);
  assert.equal(zeroHours.isReservationRecommended, false);
});

test('unsupported regions catalog identifies sovereign clouds and non-standard boundaries', () => {
  // Supported region
  const supported = validateRegionPricingSupport('eastus');
  assert.equal(supported.isSupported, true);
  assert.ok(supported.region);

  // Sovereign cloud: China 21Vianet
  const china = validateRegionPricingSupport('chinaeast2');
  assert.equal(china.isSupported, false);
  assert.equal(china.unsupportedInfo?.category, 'sovereign');
  assert.match(china.unsupportedInfo?.statusReason || '', /21Vianet/);

  // Government cloud: US Gov Virginia
  const usgov = validateRegionPricingSupport('usgovvirginia');
  assert.equal(usgov.isSupported, false);
  assert.equal(usgov.unsupportedInfo?.category, 'government');

  // Constrained preview: Qatar Central
  const qatar = validateRegionPricingSupport('qatarcentral');
  assert.equal(qatar.isSupported, false);
  assert.equal(qatar.unsupportedInfo?.category, 'preview');
});

test('configurable headroom sizing evaluates safety buffers across SKU tiers', () => {
  const baselineCu = 100;

  // 25% buffer -> 125 target -> F128
  const h25 = calculateConfiguredHeadroom(baselineCu, 25);
  assert.equal(h25.targetBufferedCu, 125);
  assert.equal(h25.recommendedSku, 'F128');
  assert.equal(h25.recommendedSkuCu, 128);

  // 50% buffer -> 150 target -> F256
  const h50 = calculateConfiguredHeadroom(baselineCu, 50);
  assert.equal(h50.targetBufferedCu, 150);
  assert.equal(h50.recommendedSku, 'F256');
  assert.equal(h50.recommendedSkuCu, 256);

  // 100% buffer (2x) -> 200 target -> F256
  const h100 = calculateConfiguredHeadroom(baselineCu, 100);
  assert.equal(h100.targetBufferedCu, 200);
  assert.equal(h100.recommendedSku, 'F256');
});

test('FinOps provenance metadata retains all 9 mandatory governance parameters', () => {
  const meta = getFinOpsResultMetadata('eastus', 'USD', 'F64', 64, 730);
  assert.equal(meta.calculationEngineVersion, '4.0.2026.10');
  assert.equal(meta.pricingDatasetVersion, '4.0.2026.10');
  assert.equal(meta.regionId, 'eastus');
  assert.equal(meta.currencyCode, 'USD');
  assert.equal(meta.selectedSku, 'F64');
  assert.equal(meta.selectedSkuCu, 64);
  assert.equal(meta.operatingHoursPerMonth, 730);
  assert.ok(meta.assumptions.length >= 3);
  assert.ok(meta.warningsAndExclusions.length >= 2);
  assert.equal(meta.retrievalDate, 'October 2026');
  assert.ok(meta.sourceUrl.includes('microsoft-fabric'));
});

test('sensitivity analysis derives conservative and peak stress variants', () => {
  const testInput = {
    regionId: "eastus",
    currencyCode: "USD",
    dataFactoryInput: { monthlyPipelines: 10000, avgActivities: 10, dataVolumeGb: 500 },
    sparkComputeInput: { totalNodes: 4, vCoresPerNode: 8, dailyRuntimeHours: 4 },
    powerBiInput: { peakConcurrentUsers: 50, queryComplexityScale: 3 }
  };

  const sensitivity = calculateSensitivityAnalysis(testInput);
  assert.ok(sensitivity.conservative.evaluation.calculatedCuBaseline < sensitivity.baseline.evaluation.calculatedCuBaseline);
  assert.ok(sensitivity.peak.evaluation.calculatedCuBaseline > sensitivity.baseline.evaluation.calculatedCuBaseline);
  assert.ok(sensitivity.conservative.deltaCuPercent < 0);
  assert.ok(sensitivity.peak.deltaCuPercent > 0);
  assert.equal(sensitivity.baseline.deltaCuPercent, 0);
});

test('mathematical explainability produces exact arithmetic equivalence', () => {
  const testInput = {
    regionId: "eastus",
    currencyCode: "USD",
    dataFactoryInput: { monthlyPipelines: 5000, avgActivities: 8, dataVolumeGb: 250 },
    sparkComputeInput: { totalNodes: 2, vCoresPerNode: 8, dailyRuntimeHours: 6 },
    powerBiInput: { peakConcurrentUsers: 75, queryComplexityScale: 2 }
  };

  const exp = getStepByStepExplanation(testInput);
  const expectedSum = Number((exp.dfCu + exp.sparkCu + exp.pbiCu).toFixed(2));
  assert.equal(exp.compositeBaselineCu, expectedSum);
  assert.equal(exp.bufferedSafeCu, Number((expectedSum * 1.5).toFixed(2)));
  assert.ok(exp.dfFormula.includes('pipelines'));
  assert.ok(exp.sparkFormula.includes('nodes'));
  assert.ok(exp.pbiFormula.includes('viewers'));
});

test('supported currencies format amounts with expected currency symbols', () => {
  assert.match(SUPPORTED_CURRENCIES.USD.format(1000), /\$1,000\.00/);
  assert.match(SUPPORTED_CURRENCIES.EUR.format(1080), /€/);
  assert.match(SUPPORTED_CURRENCIES.GBP.format(1290), /£/);
  assert.match(SUPPORTED_CURRENCIES.AUD.format(650), /A\$/);
  assert.match(SUPPORTED_CURRENCIES.INR.format(120), /₹/);
});

// Phase 6: Architecture Studio Validation & Reference Templates Tests
import {
  REFERENCE_ARCHITECTURE_TEMPLATES,
  validateArchitecture,
  ArchitectureDiagram,
} from '../src/lib/architecture';

test('all reference architecture templates exist with required nodes, connections, and governance notes', () => {
  const templates = Object.values(REFERENCE_ARCHITECTURE_TEMPLATES);
  assert.ok(templates.length >= 8);

  const expectedIds = [
    'medallion-lakehouse',
    'sql-mirroring',
    'realtime-kql',
    'warehouse-enterprise',
    'lakehouse-powerbi',
    'data-factory-etl',
    'direct-lake-model',
    'enterprise-reporting',
    'hybrid-integration'
  ];

  for (const id of expectedIds) {
    const t = REFERENCE_ARCHITECTURE_TEMPLATES[id];
    assert.ok(t, `Template ${id} must exist`);
    assert.ok(t.nodes.length >= 4, `Template ${id} must have at least 4 nodes`);
    assert.ok(t.connections.length >= 3, `Template ${id} must have at least 3 connections`);
    assert.ok(t.prerequisites.length >= 2, `Template ${id} must list prerequisites`);
    assert.ok(t.governanceNotes.length > 20, `Template ${id} must have governance notes`);

    // Verify architecture validation on reference templates
    const validation = validateArchitecture(t.nodes, t.connections);
    assert.equal(validation.valid, true, `Reference template ${id} should be valid`);
    assert.ok(validation.score >= 90, `Reference template ${id} should score >= 90 (got ${validation.score})`);
    assert.equal(validation.flowContinuity, 'complete');
  }
});

test('architecture validation rule engine flags disconnected nodes, missing source, and missing storage', () => {
  // Test 1: Empty nodes
  const emptyValidation = validateArchitecture([], []);
  assert.equal(emptyValidation.valid, false);
  assert.equal(emptyValidation.score, 0);

  // Test 2: Missing source
  const noSourceDiagram: ArchitectureDiagram = {
    id: 'test-no-source',
    name: 'No Source Test',
    description: 'Test',
    updatedAt: '2026-10-26T10:00:00.000Z',
    prerequisites: [],
    governanceNotes: 'None',
    nodes: [
      { id: 'sto-1', label: 'OneLake', category: 'storage', serviceName: 'OneLake', description: 'Store', tier: 3 },
      { id: 'ana-1', label: 'Power BI', category: 'analytics', serviceName: 'PBI', description: 'Report', tier: 5 }
    ],
    connections: [
      { from: 'sto-1', to: 'ana-1' }
    ]
  };
  const noSourceRes = validateArchitecture(noSourceDiagram.nodes, noSourceDiagram.connections);
  assert.equal(noSourceRes.valid, false);
  assert.ok(noSourceRes.issues.some(i => i.id === 'no-source'));
  assert.equal(noSourceRes.flowContinuity, 'broken');

  // Test 3: Disconnected node
  const disconnectedDiagram: ArchitectureDiagram = {
    id: 'test-disconnected',
    name: 'Disconnected Test',
    description: 'Test',
    updatedAt: '2026-10-26T10:00:00.000Z',
    prerequisites: [],
    governanceNotes: 'None',
    nodes: [
      { id: 'src-1', label: 'SQL', category: 'source', serviceName: 'SQL', description: 'Source', tier: 1 },
      { id: 'sto-1', label: 'OneLake', category: 'storage', serviceName: 'OneLake', description: 'Store', tier: 3 },
      { id: 'ana-1', label: 'Power BI', category: 'analytics', serviceName: 'PBI', description: 'Report', tier: 5 },
      { id: 'isolated-node', label: 'Orphan Node', category: 'processing', serviceName: 'Spark', description: 'Orphan', tier: 4 }
    ],
    connections: [
      { from: 'src-1', to: 'sto-1' },
      { from: 'sto-1', to: 'ana-1' }
    ]
  };
  const discRes = validateArchitecture(disconnectedDiagram.nodes, disconnectedDiagram.connections);
  assert.ok(discRes.issues.some(i => i.id === 'disconnected-isolated-node'));
  assert.ok(discRes.score < 100);
});



