# Route Regression Matrix & Pre-Implementation Verification
**Product:** Fabric Master v4.0  
**Phase:** Phase 3 Pre-Implementation Verification  
**Audit Date:** October 2026  
**Status:** ALL 22 ROUTES VERIFIED (PASS)  

---

## 1. Route Verification Matrix

All 22 routes configured in `src/App.tsx` were tested against the local server (`http://localhost:3000`) and verified functional:

| Index | Route Path | Component | HTTP Code | Status | Verification Details |
|---|---|---|---|---|---|
| 1 | `/` | `Landing.tsx` | 200 OK | **PASS** | Hero, preview widget, capability cards, footer disclaimer |
| 2 | `/wizard` | `Wizard.tsx` | 200 OK | **PASS** | 4-step capacity sizing input wizard |
| 3 | `/results` | `Dashboard.tsx` | 200 OK | **PASS** | Sizing results, breakdown charts, throttling meter |
| 4 | `/pricing` | `PricingMatrices.tsx` | 200 OK | **PASS** | F2–F2048 pricing matrix with assumptions header |
| 5 | `/cost-calculator` | `CostCalculator.tsx` | 200 OK | **PASS** | SKU cost slider, PAYG vs 1-Yr Reserved breakdown |
| 6 | `/reserved-savings` | `ReservedSavings.tsx` | 200 OK | **PASS** | Reserved capacity savings analysis |
| 7 | `/spark-estimator` | `SparkEstimator.tsx` | 200 OK | **PASS** | Spark pool vCore to CU converter |
| 8 | `/power-bi-capacity` | `PowerBICapacity.tsx` | 200 OK | **PASS** | Concurrency and semantic model sizing |
| 9 | `/fsku-comparisons` | `FskuComparisons.tsx` | 200 OK | **PASS** | SKU comparison index |
| 10 | `/fsku/:sku` (`/fsku/f64`) | `FskuDetailPage.tsx` | 200 OK | **PASS** | Detailed SKU spec sheet with Copilot/PBI rules |
| 11 | `/compare/:pair` (`/compare/f32-vs-f64`) | `SkuComparisonDetail.tsx` | 200 OK | **PASS** | Head-to-head comparison table |
| 12 | `/docs` | `Documentation.tsx` | 200 OK | **PASS** | 25 Fabric engineering guides |
| 13 | `/docs/:articleId` | `ArticlePage.tsx` | 200 OK | **PASS** | Prerendered technical documentation articles |
| 14 | `/labs` | `Labs.tsx` | 200 OK | **PASS** | Experimental architecture labs |
| 15 | `/about` | `About.tsx` | 200 OK | **PASS** | Author background & independent status principles |
| 16 | `/report` | `Report.tsx` | 200 OK | **PASS** | Executive summary report generator |
| 17 | `/terms` | `Terms.tsx` | 200 OK | **PASS** | Terms of use & MIT licensing |
| 18 | `/privacy` | `Privacy.tsx` | 200 OK | **PASS** | Local-first zero telemetry policy |
| 19 | `/architecture/planner` | `ArchitecturePlanner.tsx` | 200 OK | **PASS** | 6-step architecture flow generator |
| 20 | `/architecture/onelake` | `OneLakeVisualizer.tsx` | 200 OK | **PASS** | Interactive OneLake shortcut visualizer |
| 21 | `/ai-advisor` | `AIAdvisor.tsx` | 200 OK | **PASS** | Rule-based architecture advisor |
| 22 | `/resources/open-source` | `ResourcesOpenSource.tsx` | 200 OK | **PASS** | Open-source ecosystem references |

---

## 2. Pricing Provenance & Formula Classification

- **Pricing Provenance:** Verified against [Microsoft Azure Fabric Pricing](https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/) at $\$0.1800/\text{CU/hour}$ PAYG and $\approx 41\%$ 1-Year Reserved Instance discount. Verified October 2026.
- **Formula Classification:**
  - Data Factory: Heuristic activity ($0.005 \text{ CU/act}$) and data volume ($0.002 \text{ CU/GB}$) model.
  - Spark Compute: Evidence-based 2:1 vCore-to-CU mapping with 24-hour background smoothing.
  - Power BI Concurrency: Heuristic DAX query complexity factor ($0.2$ to $1.0 \text{ CU/user}$) with 5-minute interactive smoothing.
  - Sizing Headroom: Production safety buffer of $+50\%$ above baseline demand.
- **Theme Switching:** Verified on both desktop and mobile viewports with persisted local storage and zero FOUT.
- **Unresolved Issues from Phase 0–2:** None. All exit criteria met.
