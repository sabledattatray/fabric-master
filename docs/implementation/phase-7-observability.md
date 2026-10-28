# Fabric Master v4.0 — Phase 7: Capacity Observability & Telemetry Diagnostics Implementation Report

**Phase:** Phase 7 — Observability, Telemetry Ingestion, Smoothing Diagnostics & Capacity Validation  
**Date:** October 2026  
**Status:** Implemented, Tested, and Verified Locally  
**Production Deployment:** Pending Authorization  
**Environment:** Local Dev Server (`http://localhost:3000/observability` and `http://localhost:3000/workspace`)  

---

## 1. Executive Summary

Phase 7 delivers the **Capacity Observability & Telemetry Diagnostics Subsystem** in accordance with **PRD Section 20 and Section 43 (Phase 7)**.

Prior to Phase 7, capacity estimation in Microsoft Fabric was purely forward-looking and scenario-modeled. Phase 7 closes the loop between **architectural planning** and **operational reality** by providing enterprise architects and FinOps practitioners with a client-side telemetry ingestion, normalization, and smoothing diagnostic engine.

### Key Objectives Achieved

1. **Client-Side Ingestion for Fabric Telemetry Exports**:
   - Ingests Microsoft Fabric Capacity Metrics App exports in CSV or JSON format.
   - Robust column alias mapping: recognizes `Timestamp`, `Item Name`, `Item Kind`, `Operation Name`, `Operation Type`, `Total CU (s)`, `Status`, and principal users.
   - Fault-tolerant parser: isolates corrupted, malformed, or unparseable lines into an audit drawer without breaking dataset ingestion.

2. **Accurate Microsoft Fabric 24-Hour Smoothing Engine**:
   - **Background Smoothing**: Amortizes batch operations (Spark notebooks, ADF pipelines, Lakehouse compaction) across a 24-hour sliding window queue.
   - **Interactive Burst Tracking**: Evaluates instantaneous user queries (Direct Lake, DAX, Power BI renders) on a 5-minute smoothing basis.
   - **Cumulative Debt & Borrow Tracking**: Simulates Fabric's 24x hourly quota borrow pool to detect carryforward exhaustion.

3. **Throttling Diagnostics & Early Warning System**:
   - Accurately tracks **Interactive Delay** (10-minute continuous saturation threshold) and **Interactive Rejection** (60-minute cumulative starvation threshold).
   - Generates a **Throttling Risk Index (0–100)** to alert architects before users encounter HTTP 429 errors.

4. **Engine Consumption Breakdown & Top Consumers**:
   - Classifies compute consumption across 10 engine types: Lakehouse, Warehouse, Notebook, SparkJob, SemanticModel, Dataflow, Pipeline, Eventhouse, KQLDatabase, and Other.
   - Identifies top capacity-consuming artifacts, showing exact CU-hours, % of capacity footprint, and peak burst CU.

5. **Scenario vs. Telemetry "Reality Check"**:
   - Correlates observed metrics against the user's active planning scenario in the Unified Workspace (`/workspace`).
   - Categorizes sizing alignment into `Optimal`, `Under-Provisioned` (concurrency risk), `Critical Throttling Risk`, or `Over-Provisioned` (wasteful expenditure).

6. **100% In-Browser Local Execution & Privacy Guarantee**:
   - Zero telemetry exfiltration: all parsing, sliding-window calculations, and visualizations run entirely within browser memory.
   - Zero transmission to third-party endpoints or AI services without explicit authorization.

7. **Pre-Loaded Enterprise Stress Profiles**:
   - **Healthy Enterprise Medallion Lakehouse (F64)**: Balanced nightly batch and business-hours Direct Lake usage, 0 throttling incidents.
   - **High-Concurrency Morning Peak & Throttling (F32)**: Morning reporting storm spiking past 32 CUs, triggering interactive delays.
   - **Unoptimized 24-hr Spark Batch Burn (F16)**: Continuous unstructured streaming exhausting the 24-hour borrow budget.

---

## 2. Technical Architecture & Component Mapping

| Subsystem Component | File Location | Responsibility |
|---|---|---|
| **Observability Core Library** | [`src/lib/observability.ts`](file:///d:/Datta%20Sable/Fabric.dattasable/src/lib/observability.ts) | CSV/JSON parsers, Zod schemas, 24-hour sliding window queue, throttling risk heuristics, scenario comparison engine, sample datasets. |
| **Standalone Observability Studio** | [`src/pages/Observability.tsx`](file:///d:/Datta%20Sable/Fabric.dattasable/src/pages/Observability.tsx) | Dedicated full-page telemetry analyzer (`/observability`) with Recharts time series, smoothing breakdown, and top consumer tables. |
| **Workspace Observability Tab** | [`src/pages/Workspace.tsx`](file:///d:/Datta%20Sable/Fabric.dattasable/src/pages/Workspace.tsx) | Seventh tab (`TabId = "observability"`) embedding reality check comparison, timeline charts, and sample dataset testing. |
| **Application Routing** | [`src/App.tsx`](file:///d:/Datta%20Sable/Fabric.dattasable/src/App.tsx) | Adds `/observability` route under shared enterprise Layout. |
| **Navigation & Discoverability** | [`src/components/Layout.tsx`](file:///d:/Datta%20Sable/Fabric.dattasable/src/components/Layout.tsx) | Adds "Capacity Observability" with `Activity` icon under "Operations & Expertise". |
| **Sitemap & SEO Prerendering** | [`generate-sitemap.js`](file:///d:/Datta%20Sable/Fabric.dattasable/generate-sitemap.js), [`scripts/prerender-entry.tsx`](file:///d:/Datta%20Sable/Fabric.dattasable/scripts/prerender-entry.tsx) | Categorizes `/observability` as priority 0.9 indexable route with prerendered heading and meta tags. |
| **Readiness Test Suite** | [`tests/readiness.test.ts`](file:///d:/Datta%20Sable/Fabric.dattasable/tests/readiness.test.ts) | 6 new unit and integration tests covering CSV parsing, error isolation, smoothing algorithms, and scenario comparison. |

---

## 3. Microsoft Fabric Smoothing Algorithm Details

Microsoft Fabric calculates consumption in **Capacity Unit Seconds (CU-seconds)**. One Capacity Unit for one hour equals 3,600 CU-seconds.

Fabric does not instantaneously terminate workloads when momentary usage spikes above capacity. Instead, it utilizes two distinct smoothing windows:

$$\text{Hourly Raw CU} = \frac{\sum \text{CU-seconds}}{3600}$$

1. **Background Operations (24-Hour Sliding Window)**:
   - Evaluated as the moving average across a 24-hour queue:
     $$\text{Smoothed Background CU}_t = \frac{1}{\min(t, 24)} \sum_{i=\max(1, t-23)}^t \text{Raw Background CU}_i$$
   - A single massive batch burst of 72,000 CU-seconds is divided across 24 hours, adding only 2.0 CUs of load per hour.

2. **Interactive Operations (5-Minute Window)**:
   - Renders and DAX queries reflect immediate concurrency demand within the active hour.
   - Total smoothed demand:
     $$\text{Total Smoothed CU}_t = \text{Raw Interactive CU}_t + \text{Smoothed Background CU}_t$$

3. **Cumulative Debt and Throttling Thresholds**:
   - Each hour's net balance: $\Delta_t = \text{Total Smoothed CU}_t - \text{Capacity Quota}$.
   - Capacities can borrow up to $24 \times \text{Capacity Quota}$.
   - **Interactive Delay**: Triggered when borrow debt continues for $>10$ minutes.
   - **Interactive Rejection**: Triggered when cumulative borrow debt exceeds 100% of the borrowing limit ($24 \times \text{Quota}$). Subsequent user queries fail with HTTP 429 until the deficit burns down.

---

## 4. Verification and Test Results

The test suite executed synchronously via Node.js native test runner (`node scripts/test-readiness.mjs`):

```text
✔ all original documentation URLs remain available, with explicit reference disposition (1.1574ms)
✔ Copilot eligibility and free-viewer licensing are separate (0.1677ms)
✔ buffered demand above the largest tier never wraps back to F2 (2.4827ms)
✔ all public documentation has rendered text, canonical URLs, and correct indexing (147.1859ms)
✔ scenario schema validates version 4.0 and sanitizes malicious script tags (2.5346ms)
✔ scenario import rejects malformed or corrupted payloads (1.1885ms)
✔ scenario numerical parity and calculation engine consistency (0.5568ms)
✔ regional pricing catalog enforces official multi-region rates and multipliers (19.3057ms)
✔ reservation economics calculates break-even threshold and unused commitment across operating hours (1.3496ms)
✔ unsupported regions catalog identifies sovereign clouds and non-standard boundaries (0.3215ms)
✔ configurable headroom sizing evaluates safety buffers across SKU tiers (0.2591ms)
✔ FinOps provenance metadata retains all 9 mandatory governance parameters (0.2389ms)
✔ sensitivity analysis derives conservative and peak stress variants (0.5072ms)
✔ mathematical explainability produces exact arithmetic equivalence (0.4049ms)
✔ supported currencies format amounts with expected currency symbols (8.3006ms)
✔ all reference architecture templates exist with required nodes, connections, and governance notes (0.6775ms)
✔ architecture validation rule engine flags disconnected nodes, missing source, and missing storage (0.2218ms)
✔ parseTelemetryCSV handles Microsoft Fabric Capacity Metrics CSV exports and computes valid metrics (1.3222ms)
✔ parseTelemetryCSV isolates corrupted or malformed rows without failing ingestion (0.3765ms)
✔ parseTelemetryJSON validates array structure and rejects malformed payloads (1.9112ms)
✔ 24-hour background smoothing amortizes batch bursts while interactive operations peak rapidly (0.9611ms)
✔ throttling detection identifies capacity starvation and triggers alerts (0.5065ms)
✔ compareTelemetryWithScenario accurately evaluates fit assessment against active scenario F-SKU (0.5003ms)
ℹ tests 23
ℹ suites 0
ℹ pass 23
ℹ fail 0
```

- **Typecheck**: `npm run lint` (`tsc --noEmit`) passes with 0 errors.
- **Sitemap**: 39 indexable Category A URLs generated cleanly.
- **Privacy Review**: Verified that no fetch/HTTP requests transmit telemetry data outside the client browser.

---

## 5. Next Steps & Phase Progression

With Phase 7 complete and fully verified, the pending phases on the PRD roadmap are:

- **Phase 8 — AI Engineering Advisor v2**: Contextual grounded explanations connected to active scenario data and calculation results, with graceful fallback.
- **Phase 9 — Enterprise Report Generator**: Professional PDF and HTML export with executive summary, FinOps breakdown, and architecture diagrams.
- **Phase 10 — SEO, Security & Performance Hardening**: End-to-end accessibility, structured data, and production release checklist.
