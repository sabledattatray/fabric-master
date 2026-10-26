# Enterprise Competitor Analysis & Benchmarking Report
**Product:** Fabric Master v4.0  
**Date:** October 2026  
**Status:** Validated Technical Benchmark  
**Author:** Fabric Master Architecture & FinOps Team  

---

## 1. Executive Summary

To establish Fabric Master v4.0 as a premier, technically defensible, independent Microsoft Fabric engineering and FinOps platform, this benchmark evaluates four leading enterprise cloud benchmarks:
1. **Microsoft Azure Pricing Calculator** (Reference Standard for Cloud Cost Modeling)
2. **Microsoft Fabric Capacity Metrics App** (Reference Standard for Compute & Telemetry Analysis)
3. **Databricks Pricing Calculator** (Reference Standard for Multi-Scenario Compute Sizing)
4. **Azure Architecture Center** (Reference Standard for Technical Architecture Documentation & Patterns)

This analysis details observed capabilities, Fabric Master’s current equivalent, identified gaps, proposed improvements, implementation priorities, and evidence dates without duplicating proprietary designs or trademarks.

---

## 2. Competitive Matrix

| Dimension | Azure Pricing Calculator | Fabric Capacity Metrics App | Databricks Pricing Calculator | Azure Architecture Center | Fabric Master v3.0 (Baseline) | Fabric Master v4.0 (Target) |
|---|---|---|---|---|---|---|
| **Workload Sizing** | Manual SKU entry | Historical telemetry only | Parameterized clusters | Qualitative text | Heuristic multi-workload | Formal multi-workload + telemetry import |
| **Pricing Models** | PAYG, 1Y/3Y RI, Spot | N/A (operational tool) | DBU + VM pass-through | N/A | PAYG & 1Y RI ($0.18/CU/hr) | PAYG & 1Y RI with documented provenance |
| **Currency & Region** | Multi-region, multi-currency | Single capacity context | Multi-cloud, multi-region | N/A | Fixed East US / USD default | Regional matrix + explicit currency |
| **Architecture Linking** | Standalone pricing | Standalone operations | Standalone calculator | Visual diagrams + text | Basic sequential planner | Interactive canvas + verified reference patterns |
| **Explainability** | Minimal (line items) | High (operation drilldown) | Moderate (DBU formulas) | High (tradeoff matrices) | Medium (assumptions list) | High (formal formula references & confidence tags) |
| **Export & Reporting** | Excel, PDF summary | Power BI export | CSV estimate | Visio / PDF / docs | Basic print view | Professional PDF / JSON decision reports |
| **Account Requirement** | None for basic use | Microsoft 365 / Fabric Admin | None | None | None | None (Local-first, privacy preserved) |

---

## 3. Detailed Benchmark Analysis

### 3.1 Benchmark A: Microsoft Azure Pricing Calculator
- **Reference URL:** `https://azure.microsoft.com/en-us/pricing/calculator/`
- **Observed Capabilities:**
  - Granular SKU and resource quantity configuration.
  - Selection across global Azure regions with differential pricing tiers.
  - Multi-currency conversion based on official exchange rates.
  - Comparison between Pay-As-You-Go (PAYG) and 1-Year / 3-Year Reserved Instances.
  - Export to spreadsheet and shareable public links.
- **Fabric Master Current Equivalent:**
  - `CostCalculator.tsx` and `PricingMatrices.tsx` provide F2–F2048 pricing based on the $0.18/CU/hour standard rate with ~41% 1-Year Reserved Instance discount.
- **Identified Gaps:**
  - Regional variations are not yet surfaced dynamically in the wizard input.
  - Pricing records lacked explicit provenance timestamps and source documentation links in earlier versions.
- **Proposed Improvements (v4.0):**
  - Implement a source-backed pricing metadata schema with retrieval date, source URL, region, and effective date.
  - Provide documented assumptions panel on every pricing display.
- **Priority:** P0 (Phase 1 & Phase 5)
- **Evidence Date:** October 2026

---

### 3.2 Benchmark B: Microsoft Fabric Capacity Metrics App
- **Reference URL:** `https://learn.microsoft.com/en-us/fabric/enterprise/metrics-app`
- **Observed Capabilities:**
  - Visual breakdown of Capacity Unit (CU) consumption across background (24-hour smoothing) and interactive (5-minute smoothing) operations.
  - Identification of throttling states: Carryforward, Rejection, and Interactive Delay.
  - Drill-down into individual workspace operations, Spark notebooks, and Power BI semantic models.
- **Fabric Master Current Equivalent:**
  - `calculateCapacity` in `src/lib/calculator.ts` computes baseline CU demand with separate weights for Data Factory, Spark, and Power BI workloads, applying a 50% safety buffer and 24h/5m smoothing assumptions.
- **Identified Gaps:**
  - Current v3.0 interface labeled simulated previews with ambiguous "LIVE ENGINE" badges, risking confusion with live tenant connections.
  - No capability to import exported usage CSVs from actual Fabric tenants.
- **Proposed Improvements (v4.0):**
  - Clarify all demo data as synthetic / illustrative.
  - Add Observability & Usage Analysis module (Phase 7) to parse exported metrics CSV files locally without tenant credentials.
- **Priority:** P0 for trust/labeling; P2 for telemetry CSV parser.
- **Evidence Date:** October 2026

---

### 3.3 Benchmark C: Databricks Pricing Calculator
- **Reference URL:** `https://www.databricks.com/product/pricing`
- **Observed Capabilities:**
  - Distinct workload configurations (All-Purpose Compute, Jobs Compute, SQL Warehouse, Model Serving).
  - Multi-cloud infrastructure cost overlays (AWS, Azure, GCP).
  - What-if scenario modeling with side-by-side cost projections.
- **Fabric Master Current Equivalent:**
  - `Wizard.tsx` guides users through Data Factory, Spark, and Power BI inputs to formulate a composite CU baseline.
- **Identified Gaps:**
  - Scenarios could not be easily duplicated, named, persisted locally, or compared side-by-side.
- **Proposed Improvements (v4.0):**
  - Introduce Unified Engineering Workspace with scenario persistence (`localStorage` / `IndexedDB`), scenario cloning, and comparative FinOps tables.
- **Priority:** P1 (Phase 4 & Phase 5)
- **Evidence Date:** October 2026

---

### 3.4 Benchmark D: Azure Architecture Center
- **Reference URL:** `https://learn.microsoft.com/en-us/azure/architecture/`
- **Observed Capabilities:**
  - Standardized reference architectures for analytics, Lakehouse, and medallion designs.
  - Component relationship diagrams with numbered data flows and security boundaries.
  - Explicit architectural tradeoffs, anti-patterns, and technology selection trees.
- **Fabric Master Current Equivalent:**
  - `ArchitecturePlanner.tsx` provides a 6-step questionnaire yielding a linear tier diagram.
  - `OneLakeVisualizer.tsx` provides an interactive layer view of OneLake shortcuts and tables.
- **Identified Gaps:**
  - Rigid sequential flow without freeform node placement or exportable diagram formats (SVG/JSON).
  - Lack of structured architecture validation rules (e.g., detecting disconnected sources or missing governance).
- **Proposed Improvements (v4.0):**
  - Implement Visual Architecture Studio (Phase 6) with reference templates (Medallion, Direct Lake, Enterprise Reporting) and export capabilities.
- **Priority:** P1 (Phase 6)
- **Evidence Date:** October 2026

---

## 4. Key Takeaways & Strategic Guardrails
1. **Independence:** Fabric Master must clearly display its independent status—not an official Microsoft product, but an engineering workbench.
2. **Defensible Estimates:** Every figure must carry traceable assumptions, explicit calculation formulas, and confidence indicators.
3. **Privacy First:** Zero requirement for user login or tenant administrator consent; all evaluations run locally in the browser.
