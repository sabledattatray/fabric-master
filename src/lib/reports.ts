/**
 * Fabric Master v4.0 - Enterprise Decision Report Generator
 *
 * Implements PRD Section 22 & Section 45:
 * Generates multi-format, professional engineering decision reports:
 * - Print-ready HTML & PDF template (A4 & Letter support, professional typography,
 *   page break controls, header/footer pagination, selectable text).
 * - Exact mathematical parity with calculateCapacity() and calculateReservationEconomics().
 * - 5 Structured Report Sections:
 *   Page 1: Cover & Project Metadata
 *   Page 2: Executive Summary & Capacity Decision
 *   Page 3: Workload Demand & Sizing Analysis
 *   Page 4: FinOps Economics & Reservation Analysis
 *   Page 5: Architecture Flow, Governance & Methodology Appendix
 * - Mandatory disclaimer and data provenance.
 * - Tabular CSV export.
 */

import { Scenario } from "../types";
import { calculateCapacity } from "./calculator";
import {
  calculateReservationEconomics,
  SUPPORTED_CURRENCIES,
  REGIONAL_PRICING_CATALOG,
  PRICING_PROVENANCE_METADATA
} from "./pricing";
import { ADVISOR_ENGINE_VERSION } from "./fabric/advisor/recommendations";

export interface ReportOptions {
  projectName?: string;
  preparedBy?: string;
  organization?: string;
  includeArchitectureDiagram?: boolean;
}

export const REPORT_METHODOLOGY_VERSION = "4.0.0";
export const REPORT_DISCLAIMER_TEXT =
  "Fabric Master is an independent engineering planning workbench. Estimates are based on documented mathematical formulas, regional cloud pricing, and documented architectural assumptions. Sizing must be validated against official Microsoft pricing, licensing agreements, and measured production telemetry in Microsoft Fabric.";

/**
 * Generates a self-contained, beautifully styled HTML report suitable for
 * printing directly to PDF (A4 / Letter) or saving as standalone documentation.
 */
export function generatePrintableHTMLReport(
  scenario: Scenario,
  options: ReportOptions = {}
): string {
  const projectName = options.projectName || "Enterprise Microsoft Fabric Initiative";
  const preparedBy = options.preparedBy || "Lead Cloud Data Architect";
  const organization = options.organization || "Enterprise Data Platform";

  const regionId = scenario.region || scenario.inputs.regionId || "eastus";
  const currencyCode = scenario.currency || scenario.inputs.currencyCode || "USD";
  const currDef = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const regionInfo = REGIONAL_PRICING_CATALOG[regionId] || REGIONAL_PRICING_CATALOG.eastus;

  // Exact deterministic calculations
  const evalResult = scenario.evaluation || calculateCapacity(scenario.inputs);
  const safeSku = evalResult.targetSkuRecommendation.safeSkuName;
  const safeSkuCu = evalResult.targetSkuRecommendation.safeSkuCu;
  const costSku = evalResult.targetSkuRecommendation.costOptimizedSkuName;
  const costSkuCu = evalResult.targetSkuRecommendation.costOptimizedSkuCu;
  const baselineCu = evalResult.calculatedCuBaseline;

  // FinOps Economics
  const economics = calculateReservationEconomics(safeSkuCu, regionId, currencyCode, 730);

  const creationDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${scenario.name} - Fabric Master Engineering Decision Report</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 20mm 15mm;
      @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 8pt;
        color: #64748b;
      }
      @bottom-left {
        content: "Fabric Master v4.0 · Confidential Engineering Report";
        font-size: 8pt;
        color: #64748b;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.5;
      font-size: 10pt;
    }

    .page {
      padding: 0;
      width: 100%;
      min-height: 250mm;
      position: relative;
    }

    .page-break {
      page-break-after: always;
      break-after: page;
      height: 0;
    }

    .print-only {
      display: none;
    }

    @media print {
      body {
        background: #ffffff;
        color: #000000;
      }
      .no-print {
        display: none !important;
      }
      .print-only {
        display: block;
      }
      .page {
        min-height: auto;
      }
    }

    /* Action bar when viewed in browser */
    .screen-action-bar {
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .screen-action-bar button {
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
    }

    .screen-action-bar button:hover {
      background: #1d4ed8;
    }

    .report-container {
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px 0;
    }

    /* Typography & Layout Tokens */
    h1, h2, h3, h4 {
      color: #0f172a;
      font-weight: 700;
      line-height: 1.25;
    }

    h1 { font-size: 24pt; margin-bottom: 8pt; }
    h2 { font-size: 14pt; margin-bottom: 6pt; border-bottom: 2px solid #e2e8f0; padding-bottom: 4pt; }
    h3 { font-size: 11pt; margin-bottom: 4pt; color: #1e293b; }

    p { margin-bottom: 6pt; color: #334155; }

    .badge {
      display: inline-block;
      padding: 2pt 6pt;
      border-radius: 4pt;
      font-size: 8pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5pt;
    }

    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-amber { background: #fef3c7; color: #92400e; }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8pt 0 14pt 0;
      font-size: 9pt;
    }

    th, td {
      padding: 6pt 8pt;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      background-color: #f8fafc;
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
      font-size: 8pt;
      letter-spacing: 0.5pt;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8pt;
      margin: 10pt 0 16pt 0;
    }

    .kpi-box {
      border: 1px solid #cbd5e1;
      border-radius: 6pt;
      padding: 8pt 10pt;
      background: #f8fafc;
    }

    .kpi-label {
      font-size: 8pt;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
    }

    .kpi-value {
      font-size: 16pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 2pt;
    }

    .kpi-sub {
      font-size: 7.5pt;
      color: #64748b;
      margin-top: 2pt;
    }

    .disclaimer-box {
      background: #f1f5f9;
      border-left: 3px solid #64748b;
      padding: 8pt 10pt;
      font-size: 8pt;
      color: #475569;
      margin-top: 14pt;
    }

    .footer-note {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #e2e8f0;
      padding-top: 6pt;
      font-size: 8pt;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Screen-Only Action Bar -->
  <div class="screen-action-bar no-print">
    <div>
      <strong>Fabric Master v4.0</strong> · Engineering Decision Report
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="window.print()">Print / Save as PDF</button>
    </div>
  </div>

  <div class="report-container">

    <!-- =====================================================================
         PAGE 1: COVER PAGE
         ===================================================================== -->
    <div class="page" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 255mm;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40pt; border-bottom: 3px solid #2563eb; padding-bottom: 12pt;">
          <div>
            <div style="font-size: 16pt; font-weight: 800; color: #0f172a; letter-spacing: -0.5pt;">FABRIC MASTER</div>
            <div style="font-size: 8pt; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1pt;">Enterprise Capacity & FinOps Workbench</div>
          </div>
          <div style="text-align: right;">
            <span class="badge badge-blue">ENGINEERING DECISION RECORD</span>
          </div>
        </div>

        <div style="margin-top: 60pt; margin-bottom: 40pt;">
          <div style="font-size: 11pt; color: #2563eb; font-weight: 700; text-transform: uppercase; letter-spacing: 1pt; margin-bottom: 6pt;">Capacity Sizing & Architecture Report</div>
          <h1 style="font-size: 26pt; line-height: 1.15; margin-bottom: 12pt; color: #0f172a;">${scenario.name}</h1>
          <p style="font-size: 11pt; color: #475569; max-width: 90%;">
            ${scenario.description || "Comprehensive workload capacity sizing, Azure regional pricing model, reservation breakeven analysis, and multi-tier Fabric architecture specification."}
          </p>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8pt; padding: 16pt; margin-top: 30pt;">
          <table style="margin: 0;">
            <tr>
              <td style="width: 30%; color: #64748b; font-weight: 600; border: none;">Project Initiative:</td>
              <td style="font-weight: 600; border: none; color: #0f172a;">${projectName}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600; border: none;">Target Azure Region:</td>
              <td style="border: none; color: #0f172a;">${regionInfo.name} (${regionId})</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600; border: none;">Evaluated Currency:</td>
              <td style="border: none; color: #0f172a;">${currencyCode} (${currDef.symbol})</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600; border: none;">Preparation Date:</td>
              <td style="border: none; color: #0f172a;">${creationDate}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600; border: none;">Prepared For / Org:</td>
              <td style="border: none; color: #0f172a;">${organization}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-weight: 600; border: none;">Methodology Version:</td>
              <td style="border: none; color: #0f172a; font-family: monospace;">v${REPORT_METHODOLOGY_VERSION} (Engine v${ADVISOR_ENGINE_VERSION})</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="footer-note">
        <span>Fabric Master v4.0 · Confidential Sizing Report</span>
        <span>Page 1 of 5</span>
      </div>
    </div>

    <div class="page-break"></div>

    <!-- =====================================================================
         PAGE 2: EXECUTIVE SUMMARY & CAPACITY SIZING
         ===================================================================== -->
    <div class="page" style="min-height: 255mm;">
      <h2>1. Executive Summary & Recommended Capacity</h2>
      <p style="margin-top: 6pt; font-size: 9.5pt;">
        Based on deterministic evaluation of specified data ingestion volumes, distributed Spark computing nodes, and concurrent business reporting users, the recommended Microsoft Fabric capacity tier is <strong>${safeSku}</strong>.
      </p>

      <div class="kpi-grid">
        <div class="kpi-box">
          <div class="kpi-label">Recommended Tier</div>
          <div class="kpi-value" style="color: #2563eb;">${safeSku}</div>
          <div class="kpi-sub">${safeSkuCu} Capacity Units</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Continuous PAYG</div>
          <div class="kpi-value">${economics.formattedMonthlyPayg}</div>
          <div class="kpi-sub">730 hours / month</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">1-Yr Reserved</div>
          <div class="kpi-value" style="color: #166534;">${economics.formattedMonthlyReserved}</div>
          <div class="kpi-sub">40.56% discount applied</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Break-Even Point</div>
          <div class="kpi-value" style="color: #b45309;">${economics.breakEvenOperatingHoursPerMonth}h</div>
          <div class="kpi-sub">Operating hours / month</div>
        </div>
      </div>

      <h3>Key Sizing & Financial Findings</h3>
      <table>
        <thead>
          <tr>
            <th>Decision Vector</th>
            <th>Specification</th>
            <th>Engineering Rationale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Recommended Safe SKU</strong></td>
            <td><strong>${safeSku} (${safeSkuCu} CUs)</strong></td>
            <td>Incorporates configured +50% safety buffer above ${baselineCu} CU composite baseline to prevent concurrency throttling.</td>
          </tr>
          <tr>
            <td><strong>Cost-Optimized Option</strong></td>
            <td>${costSku} (${costSkuCu} CUs)</td>
            <td>Lean alternative. Suitable only if heavy Spark batch jobs run strictly off-hours away from interactive users.</td>
          </tr>
          <tr>
            <td><strong>Power BI Free Distribution</strong></td>
            <td>${safeSkuCu >= 64 ? "Supported (≥F64)" : "Not Supported (<F64)"}</td>
            <td>${safeSkuCu >= 64 ? "Workspace reports can be consumed by free Power BI users without individual Pro licenses." : "Requires individual Power BI Pro or PPU licenses for all workspace consumers."}</td>
          </tr>
          <tr>
            <td><strong>Optimal FinOps Commitment</strong></td>
            <td>${economics.isReservationRecommended ? "1-Year Reserved Instance" : "Pay-As-You-Go"}</td>
            <td>${economics.recommendationReason}</td>
          </tr>
        </tbody>
      </table>

      <h3>Key Architectural Considerations</h3>
      <p style="font-size: 9pt;">
        • <strong>Smoothing Window Amortization:</strong> Data Factory and Spark workloads borrow compute capacity across a 24-hour sliding window.
      </p>
      <p style="font-size: 9pt;">
        • <strong>Direct Lake Caching:</strong> Gold medallion tables should be surfaced via Direct Lake to bypass scheduled import latency and memory duplication.
      </p>

      <div class="footer-note">
        <span>Fabric Master v4.0 · Confidential Sizing Report</span>
        <span>Page 2 of 5</span>
      </div>
    </div>

    <div class="page-break"></div>

    <!-- =====================================================================
         PAGE 3: WORKLOAD DEMAND & CAPACITY SIZING
         ===================================================================== -->
    <div class="page" style="min-height: 255mm;">
      <h2>2. Detailed Workload Demand & Engine Breakdown</h2>
      <p style="margin-top: 6pt; font-size: 9.5pt;">
        Microsoft Fabric pools compute across distinct analytical engines. The table below displays input parameters and derived CU baseline contributions:
      </p>

      <table>
        <thead>
          <tr>
            <th>Workload Engine</th>
            <th>Input Parameters</th>
            <th>Derived Demand (CU)</th>
            <th>Smoothing Behavior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Data Factory Pipelines</strong></td>
            <td>
              ${scenario.inputs.dataFactoryInput.monthlyPipelines.toLocaleString()} monthly runs<br>
              ${scenario.inputs.dataFactoryInput.dataVolumeGb} GB ingestion volume
            </td>
            <td>~${Math.round((scenario.inputs.dataFactoryInput.monthlyPipelines * 0.05 + scenario.inputs.dataFactoryInput.dataVolumeGb * 0.01) * 10) / 10} CUs</td>
            <td>24-Hour background sliding window</td>
          </tr>
          <tr>
            <td><strong>Apache Spark Compute</strong></td>
            <td>
              ${scenario.inputs.sparkComputeInput.totalNodes} nodes × ${scenario.inputs.sparkComputeInput.vCoresPerNode} vCores<br>
              ${scenario.inputs.sparkComputeInput.dailyRuntimeHours} runtime hours / day
            </td>
            <td>${scenario.inputs.sparkComputeInput.totalNodes * scenario.inputs.sparkComputeInput.vCoresPerNode * 2} CUs (raw peak)</td>
            <td>2:1 vCore-to-CU cloud equivalence; 24h smoothing</td>
          </tr>
          <tr>
            <td><strong>Power BI & Direct Lake</strong></td>
            <td>
              ${scenario.inputs.powerBiInput.peakConcurrentUsers} peak concurrent viewers<br>
              Complexity scale: ${scenario.inputs.powerBiInput.queryComplexityScale} of 5
            </td>
            <td>${Math.round(scenario.inputs.powerBiInput.peakConcurrentUsers * 1.0 * (1 + (scenario.inputs.powerBiInput.queryComplexityScale - 1) * 0.25))} CUs</td>
            <td>5-Minute interactive smoothing window</td>
          </tr>
          <tr style="background: #e2e8f0; font-weight: 700;">
            <td colspan="2">Composite Baseline Demand</td>
            <td>${baselineCu} CUs</td>
            <td>Composite concurrent requirement</td>
          </tr>
          <tr style="background: #dbeafe; font-weight: 700; color: #1e40af;">
            <td colspan="2">Target Sizing (+50% Safety Headroom Buffer)</td>
            <td>${safeSkuCu} CUs (${safeSku})</td>
            <td>Recommended enterprise production target</td>
          </tr>
        </tbody>
      </table>

      <h3>Candidate SKU Sizing Spectrum</h3>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>CUs</th>
            <th>vCore Equiv</th>
            <th>Monthly PAYG (${currencyCode})</th>
            <th>Operating Headroom</th>
            <th>Assessment</th>
          </tr>
        </thead>
        <tbody>
          ${[
            { sku: "F16", cu: 16 },
            { sku: "F32", cu: 32 },
            { sku: "F64", cu: 64 },
            { sku: "F128", cu: 128 },
            { sku: "F256", cu: 256 }
          ].map(s => {
            const econ = calculateReservationEconomics(s.cu, regionId, currencyCode, 730);
            const isTarget = s.sku === safeSku;
            const isCost = s.sku === costSku;
            const diff = s.cu - baselineCu;
            return `
              <tr style="${isTarget ? 'background: #eff6ff; font-weight: 600;' : ''}">
                <td>${s.sku} ${isTarget ? '<span class="badge badge-blue">Target</span>' : ''} ${isCost && !isTarget ? '<span class="badge badge-amber">Lean</span>' : ''}</td>
                <td>${s.cu} CUs</td>
                <td>${s.cu / 2} cores</td>
                <td>${econ.formattedMonthlyPayg}</td>
                <td>${diff >= 0 ? '+' : ''}${Math.round((diff / s.cu) * 100)}%</td>
                <td>${s.cu < baselineCu ? 'Under-sized (Throttling risk)' : isTarget ? 'Optimal enterprise fit' : s.cu > safeSkuCu ? 'Comfortable excess buffer' : 'Borderline lean'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="footer-note">
        <span>Fabric Master v4.0 · Confidential Sizing Report</span>
        <span>Page 3 of 5</span>
      </div>
    </div>

    <div class="page-break"></div>

    <!-- =====================================================================
         PAGE 4: FINOPS ANALYSIS & RESERVATIONS
         ===================================================================== -->
    <div class="page" style="min-height: 255mm;">
      <h2>3. FinOps Modeling & Commitment Economics</h2>
      <p style="margin-top: 6pt; font-size: 9.5pt;">
        Fabric pricing depends heavily on operating hours. One-Year Reserved Instances offer a <strong>40.56% discount</strong> but require an unbroken 730-hour monthly financial commitment.
      </p>

      <table>
        <thead>
          <tr>
            <th>Operating Schedule Profile</th>
            <th>Monthly Runtime</th>
            <th>PAYG Cost (${currencyCode})</th>
            <th>1-Yr Reserved Cost (${currencyCode})</th>
            <th>Unused Waste</th>
            <th>Recommended Model</th>
          </tr>
        </thead>
        <tbody>
          ${[
            { label: "Continuous 24/7 Production", hours: 730 },
            { label: "Extended Business Hours (14h × 22d)", hours: 308 },
            { label: "Standard Business Hours (10h × 22d)", hours: 220 },
            { label: "Batch Dev / Test Sandboxes", hours: 100 }
          ].map(p => {
            const econ = calculateReservationEconomics(safeSkuCu, regionId, currencyCode, p.hours);
            return `
              <tr>
                <td><strong>${p.label}</strong></td>
                <td>${p.hours} hrs/mo</td>
                <td>${econ.formattedMonthlyPayg}</td>
                <td>${econ.formattedMonthlyReserved}</td>
                <td>${currDef.format(econ.unusedCommitmentUSD)}</td>
                <td><strong>${econ.isReservationRecommended ? '1-Yr Reservation' : 'PAYG (Paused off-hours)'}</strong></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <h3>Mathematical Break-Even Principle</h3>
      <p style="font-size: 9pt; color: #334155;">
        Let $H$ be the active operating hours per month. A 1-Year Reservation charges a fixed 730 hours at a 40.56% discount ($0.5944 \times \text{Rate}$).
        Equating PAYG cost to Reserved cost:
      </p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6pt; padding: 10pt; font-family: monospace; font-size: 9pt; margin: 8pt 0;">
        H × Rate_PAYG = 730 × (1 - 0.4056) × Rate_PAYG<br>
        H = 730 × 0.5944 = 433.91 ≈ <strong>434 hours/month</strong>
      </div>
      <p style="font-size: 9pt;">
        <strong>Strategic Takeaway:</strong> If capacity can be paused during weekends and nights such that total monthly uptime is less than <strong>434 hours</strong> (~14.5 hours/day), Pay-As-You-Go with automated pausing delivers lower expenditure than 1-Year Reservations.
      </p>

      <div class="footer-note">
        <span>Fabric Master v4.0 · Confidential Sizing Report</span>
        <span>Page 4 of 5</span>
      </div>
    </div>

    <div class="page-break"></div>

    <!-- =====================================================================
         PAGE 5: ARCHITECTURE, VALIDATION & DISCLAIMER
         ===================================================================== -->
    <div class="page" style="min-height: 255mm;">
      <h2>4. Architecture Flow, Governance & Methodology Appendix</h2>
      <p style="margin-top: 6pt; font-size: 9.5pt;">
        Microsoft Fabric integrates compute with open OneLake storage. Recommended topology stages for ${scenario.name}:
      </p>

      <table>
        <thead>
          <tr>
            <th>Stage</th>
            <th>Layer</th>
            <th>Primary Component</th>
            <th>Flow & Governance Policy</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Stage 01</strong></td>
            <td>Ingestion</td>
            <td>Data Factory Pipelines & Shortcuts</td>
            <td>Incremental batch copy from transactional sources into OneLake Landing.</td>
          </tr>
          <tr>
            <td><strong>Stage 02</strong></td>
            <td>Storage</td>
            <td>OneLake Medallion Lakehouse</td>
            <td>Open Delta Parquet format across Bronze raw, Silver clean, and Gold marts.</td>
          </tr>
          <tr>
            <td><strong>Stage 03</strong></td>
            <td>Processing</td>
            <td>Apache Spark Compute Pool</td>
            <td>Distributed PySpark notebooks with Delta OPTIMIZE / Z-Order indexing.</td>
          </tr>
          <tr>
            <td><strong>Stage 04</strong></td>
            <td>Analytics</td>
            <td>Direct Lake Semantic Models</td>
            <td>Sub-second Power BI querying directly over OneLake without import refresh.</td>
          </tr>
          <tr>
            <td><strong>Stage 05</strong></td>
            <td>Governance</td>
            <td>Microsoft Purview & Cataloging</td>
            <td>Automated end-to-end data lineage, classification, and row-level security.</td>
          </tr>
        </tbody>
      </table>

      <h3>Pre-Purchase Validation Checklist</h3>
      <p style="font-size: 9pt;">
        1. <strong>Trial Capacity Workspace:</strong> Deploy a 60-day Microsoft Fabric trial in ${regionInfo.name}.<br>
        2. <strong>Metrics App Audit:</strong> Install the Microsoft Fabric Capacity Metrics App to baseline ETL burndown.<br>
        3. <strong>Direct Lake Validation:</strong> Test peak concurrent queries in DAX Studio to verify zero fallback to DirectQuery.
      </p>

      <div class="disclaimer-box">
        <strong>Mandatory Independent Tool Disclaimer:</strong><br>
        ${REPORT_DISCLAIMER_TEXT}
      </div>

      <div class="footer-note">
        <span>Fabric Master v4.0 · Confidential Sizing Report</span>
        <span>Page 5 of 5</span>
      </div>
    </div>

  </div>
</body>
</html>`;
}

/**
 * Generates structured tabular CSV content for financial modeling and spreadsheets.
 */
export function generateScenarioReportCSV(scenario: Scenario): string {
  const regionId = scenario.region || scenario.inputs.regionId || "eastus";
  const currencyCode = scenario.currency || scenario.inputs.currencyCode || "USD";
  const evalResult = scenario.evaluation || calculateCapacity(scenario.inputs);
  const safeSku = evalResult.targetSkuRecommendation.safeSkuName;
  const safeSkuCu = evalResult.targetSkuRecommendation.safeSkuCu;
  const baselineCu = evalResult.calculatedCuBaseline;

  const economics = calculateReservationEconomics(safeSkuCu, regionId, currencyCode, 730);

  const rows = [
    ["Metric", "Value", "Notes"],
    ["Scenario Name", scenario.name, "Scenario identifier"],
    ["Azure Region", regionId, "Deployment target"],
    ["Currency", currencyCode, "Billing currency"],
    ["Calculated Baseline CU", String(baselineCu), "Raw composite demand"],
    ["Recommended Safe SKU", safeSku, "Includes configured headroom buffer"],
    ["Safe SKU Capacity Units", String(safeSkuCu), "Allocated CU quota"],
    ["Monthly Operating Hours", String(730), "Standard monthly basis"],
    ["Hourly PAYG (USD)", String(economics.hourlyPaygUSD), "Base regional rate"],
    ["Monthly PAYG (USD)", String(economics.monthlyPaygUSD), "Continuous 730h PAYG cost"],
    ["Monthly 1-Yr Reserved (USD)", String(economics.monthlyReservedCommitmentUSD), "40.56% discount commitment"],
    ["Break-Even Hours / Month", String(economics.breakEvenOperatingHoursPerMonth), "Threshold for RI commitment"],
    ["Annual Savings via RI (USD)", String(economics.effectiveSavingsUSD * 12), "Savings at continuous 730h"],
    ["Methodology Version", REPORT_METHODOLOGY_VERSION, "Fabric Master v4.0"],
    ["Report Timestamp", new Date().toISOString(), "ISO 8601"]
  ];

  return rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
}

/**
 * Triggers client-side download of self-contained HTML report.
 */
export function downloadHTMLReport(scenario: Scenario, options?: ReportOptions): void {
  const html = generatePrintableHTMLReport(scenario, options);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fabric-master-report-${scenario.name.replace(/\s+/g, "-").toLowerCase()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Triggers client-side download of CSV decision record.
 */
export function downloadCSVReport(scenario: Scenario): void {
  const csv = generateScenarioReportCSV(scenario);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fabric-master-report-${scenario.name.replace(/\s+/g, "-").toLowerCase()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Opens report in a new printable browser tab and invokes window.print().
 */
export function openPrintableReportWindow(scenario: Scenario, options?: ReportOptions): void {
  const html = generatePrintableHTMLReport(scenario, options);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
