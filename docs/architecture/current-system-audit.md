# System Architecture, Calculation & Security Audit (Phase 0)
**Product:** Fabric Master v4.0  
**Audit Date:** October 2026  
**Baseline Version:** v3.0  
**Target Version:** v4.0  
**Status:** Complete P0 Technical Audit  

---

## 1. Environment & Technology Stack Inventory

| Component | Technology | Version | Observation / Notes |
|---|---|---|---|
| **Language** | TypeScript | ~5.8.2 | Strict typing enabled (`tsconfig.json`), no emit linter passes clean. |
| **Frontend Framework** | React | ^19.0.1 | Modern React 19 root, concurrent mode compatible. |
| **DOM / Routing** | react-router-dom | ^7.18.0 | Dual support for `BrowserRouter` (client) and `MemoryRouter` (SSG/prerender). |
| **Bundler & Dev Server**| Vite | ^6.2.3 | Vite 6 with `@tailwindcss/vite` and `@vitejs/plugin-react`. |
| **Backend / SSR** | Express + TSX | ^4.21.2 | `server.ts` with Vite middleware mode in dev and static SPA serving in production. |
| **Production Build** | esbuild + Node | ^0.25.0 | Server bundled to `dist/server.cjs` (CommonJS), static assets in `dist/`. |
| **CSS & Design** | Tailwind CSS | ^4.1.14 | Tailwind v4 with `@theme` block in `src/index.css`. |
| **Icons** | Lucide React | ^0.546.0 | Comprehensive icon set. |
| **Data Visualization** | Recharts | ^3.9.0 | Responsive bar, pie, and metric charts. |
| **Internationalization**| i18next + react-i18next| ^26.3.3 / ^17.0.8 | Multilingual translation engine (`i18n.ts`, `i18n-extra.ts`). |
| **Validation** | Zod | ^4.4.3 | WorkloadCalculationSchema runtime enforcement. |
| **SEO & Head** | react-helmet-async | ^3.0.0 | Canonical tags, Open Graph, meta descriptions, schema markup. |
| **Pre-rendering** | Custom esbuild runner | scripts/prerender.mjs | Pre-renders 53 HTML entry points for zero-JS crawlability. |

---

## 2. Complete Route & Feature Inventory

The application currently exposes 22 primary routes through `src/App.tsx`. All 22 routes are fully operational and must be preserved:

| Route Path | Component | Category | Current Status |
|---|---|---|---|
| `/` | `Landing.tsx` | Overview / Entry | Active: Hero, feature cards, FAQ, preview widget. |
| `/wizard` | `Wizard.tsx` | Capacity Intelligence | Active: 4-step workload sizing questionnaire. |
| `/results` | `Dashboard.tsx` | Capacity Intelligence | Active: Evaluation dashboard, charts, throttling, export. |
| `/pricing` | `PricingMatrices.tsx` | FinOps Studio | Active: Comprehensive F2–F2048 pricing matrix. |
| `/cost-calculator` | `CostCalculator.tsx` | FinOps Studio | Active: SKU selector, annual PAYG vs. RI cost calculator. |
| `/reserved-savings` | `ReservedSavings.tsx` | FinOps Studio | Active: 1-Year Reserved Instance savings breakdown. |
| `/spark-estimator` | `SparkEstimator.tsx` | Capacity Intelligence | Active: Node/vCore cluster compute calculator. |
| `/power-bi-capacity`| `PowerBICapacity.tsx` | Capacity Intelligence | Active: Power BI concurrent user / semantic model planner. |
| `/fsku-comparisons` | `FskuComparisons.tsx` | FinOps Studio | Active: Multi-SKU comparison directory. |
| `/fsku/:sku` | `FskuDetailPage.tsx` | FinOps Studio | Active: 11 individual SKU specification pages (F2 to F2048). |
| `/compare/:pair` | `SkuComparisonDetail.tsx`| FinOps Studio | Active: Head-to-head SKU comparison pages. |
| `/docs` | `Documentation.tsx` | Knowledge Hub | Active: 25 structured Microsoft Fabric guides. |
| `/docs/:articleId` | `ArticlePage.tsx` | Knowledge Hub | Active: Individual Markdown documentation articles. |
| `/labs` | `Labs.tsx` | Operations & Experiments | Active: Interactive experimental modules. |
| `/about` | `About.tsx` | Trust & Governance | Active: Creator background, mission, architecture articles. |
| `/report` | `Report.tsx` | Enterprise Reporting | Active: Executive summary export generator. |
| `/terms` | `Terms.tsx` | Governance | Active: Terms of service and open source terms. |
| `/privacy` | `Privacy.tsx` | Security & Privacy | Active: Local data handling, zero-telemetry policy. |
| `/architecture/planner` | `ArchitecturePlanner.tsx`| Architecture Studio | Active: 6-step workload architecture flow generator. |
| `/architecture/onelake` | `OneLakeVisualizer.tsx`| Architecture Studio | Active: Interactive OneLake multi-layer visualizer. |
| `/ai-advisor` | `AIAdvisor.tsx` | AI Engineering | Active: Deterministic rule-based workload advisor. |
| `/resources/open-source` | `ResourcesOpenSource.tsx`| Resources | Active: Upstream references & community projects. |

---

## 3. Mathematical & Calculation Engine Audit

### 3.1 Workload Normalization & Formula Analysis
In `src/lib/calculator.ts`, `calculateCapacity(data)` implements a deterministic workload formulation:

1. **Data Factory CU Component ($CU_{DF}$):**
   $$CU_{DF} = \left(\frac{\text{monthlyPipelines}}{730}\right) \times \text{avgActivities} \times 0.005 + (\text{dataVolumeGb} \times 0.002)$$
   - *Audit Finding:* Assumes linear activity cost and data movement impact over 730 monthly hours. Standardized and deterministic.

2. **Spark Compute CU Component ($CU_{\text{Spark}}$):**
   $$CU_{\text{Spark}} = \text{totalNodes} \times \text{vCoresPerNode} \times \left(\frac{\text{dailyRuntimeHours}}{24}\right) \times 0.5$$
   - *Audit Finding:* Corresponds to 2 vCores = 1 Fabric Capacity Unit (CU) ratio under 24-hour daily smoothing. Accurate to Microsoft Fabric Spark compute specifications.

3. **Power BI CU Component ($CU_{\text{PBI}}$):**
   $$CU_{\text{PBI}} = \text{peakConcurrentUsers} \times (\text{queryComplexityScale} \times 0.2)$$
   - *Audit Finding:* Scales concurrency with a 1–5 complexity multiplier ($0.2$ to $1.0$ CU per concurrent user). Reasonable heuristic for DAX query processing.

4. **Composite Baseline & Safety Headroom:**
   $$\text{Baseline CU} = CU_{DF} + CU_{\text{Spark}} + CU_{\text{PBI}}$$
   $$\text{Safe Required CU} = \text{Baseline CU} \times 1.5 \quad (50\% \text{ buffer})$$

5. **Financial Sizing:**
   - Standard baseline rate: $\$0.18 / \text{CU} / \text{hour}$ (e.g., F64 = $64 \times \$0.18 = \$11.52/\text{hr}$).
   - Monthly base: $730 \text{ hours/month}$ (e.g., F64 PAYG = $\$8,409.60/\text{mo}$).
   - 1-Year Reserved Instance discount: $\approx 41\%$ savings (e.g., F64 RI = $\$4,961.66/\text{mo}$).

### 3.2 Audit Assessment:
- **Reproducibility:** 100% deterministic. Identical inputs yield identical outputs.
- **Edge Cases:** Zod validation enforces positive integers, max limits, valid currency codes, and allowed vCore configurations ([2, 4, 8, 16, 32, 64]).
- **Identified Improvement:** Confidence score in v3.0 returned an integer percentage that could be misinterpreted as a probabilistic certainty. PRD Section 15 requires clear classification labels (`measured`, `model_based`, `heuristic`, `insufficient`).

---

## 4. Security & Privacy Audit

1. **Credential Exposure:**
   - Verified: No API keys, database secrets, or personal tokens are committed to source control or exposed in client bundles.
   - `.env.example` documents `GEMINI_API_KEY=""` and `APP_URL="http://localhost:3000"`.
2. **Data Handling & Local Processing:**
   - Scenario and evaluation data are retained strictly within browser `localStorage` (`fabric_master_last_evaluation`, `fabric_master_last_input_data`).
   - Zero telemetry upload; no external analytics beacon tracking user financial models.
3. **API Security:**
   - `/api/v1/capacity-evaluation` validates all inputs against `WorkloadCalculationSchema`. Malformed inputs are rejected with HTTP 400 and structured error arrays.
   - Express applies JSON body parsing with strict content-type expectations.
4. **XSS & Content Injection:**
   - React 19 escapes rendered text by default. Markdown rendering in `ArticlePage.tsx` uses sanitized components without arbitrary raw HTML injection.

---

## 5. UI/UX & Design System Audit

1. **Theme Support:**
   - Baseline application uses hardcoded `#0d1117` background with `#c9d1d9` text (GitHub Dark style).
   - Light mode is currently missing or partially inconsistent (e.g. `Dashboard.tsx` had `#F8F9FA` fallbacks).
   - Target requirement: Implement formal CSS variable tokens for Dark (#080F1D) and Light (#F7F9FC) themes per PRD Section 5.
2. **Typography & Spacing:**
   - Uses system font stack. Target: Clean, readable typography scale and an 8-point spacing system.
3. **Accessibility (WCAG 2.2 AA):**
   - High contrast in dark mode, but needs formal light mode contrast verification.
   - Buttons, inputs, and modal dialogs need explicit `aria-label`, visible focus rings, and keyboard escape handlers.

---

## 6. Risk Register & Mitigation Strategy

| Risk ID | Description | Severity | Mitigation Plan |
|---|---|---|---|
| **R-01** | Port 3000 conflicts with external developer services | Medium | Updated `server.ts` to respect `process.env.PORT` with 3000 fallback. |
| **R-02** | Stale pricing perception without dates | High | Introduce explicit pricing provenance (source URL, effective date, retrieval date). |
| **R-03** | Perceived official Microsoft affiliation | High | Surface prominent independent-product disclaimer across header/footer/trust center. |
| **R-04** | Accidental regression of existing 22 routes | Critical | Validate all routes against routing table; maintain pre-rendering in `scripts/prerender.mjs`. |
| **R-05** | Broken build due to missing prerender directory | Low | Ensure build script handles clean dist recreation automatically. |
