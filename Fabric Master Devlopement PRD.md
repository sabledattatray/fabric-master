# PRODUCT REQUIREMENTS DOCUMENT
# FABRIC MASTER v4.0
## Enterprise Engineering, Architecture, Capacity Intelligence & FinOps Platform

**Version:** 4.0  
**Document status:** Implementation specification  
**Priority:** P0 — Enterprise Product Transformation  
**Product URL:** https://fabric.dattasable.com/  
**GitHub repository:** https://github.com/sabledattatray/fabric-master  
**Product owner:** Datta Sable  
**Implementation environment:** Existing application and hosting infrastructure  
**Implementation agent:** Antigravity / Codex

---

# PART I — PRODUCT VISION & EXECUTION GOVERNANCE

## 1. Executive Summary

Fabric Master v4.0 will transform the existing Microsoft Fabric engineering website into a premium, professional, transparent, and technically defensible engineering workbench.

The platform must help professionals:

1. Understand Microsoft Fabric capabilities.
2. Estimate capacity requirements.
3. Model cloud expenditure.
4. Compare capacity scenarios.
5. Design Fabric architectures.
6. Analyze imported capacity telemetry.
7. Understand performance bottlenecks.
8. Evaluate migration options.
9. Obtain evidence-backed AI assistance.
10. Generate professional engineering reports.

The experience must resemble the quality and credibility of established enterprise cloud platforms.

### Product identity

**Brand:** Fabric Master

**Professional positioning:**

Independent Microsoft Fabric Engineering & FinOps Workbench

**Tagline:**

Plan Smarter. Architect Better. Optimize Fabric.

**Supporting statement:**

Capacity intelligence, cost modeling, architecture planning, and technical guidance for Microsoft Fabric professionals.

### Product principles

- Accuracy before visual appeal.
- Explainability before automation.
- Evidence before claims.
- Clarity before feature density.
- Security and privacy by design.
- Accessibility across devices.
- No misleading Microsoft affiliation.
- No unsupported promises of cost savings.
- No invented performance results.

---

## 2. Non-Negotiable Agent Instructions

Before writing code:

1. Inspect the complete existing repository.
2. Identify the framework, dependencies, routes, and hosting configuration.
3. Inspect every existing calculator.
4. Inspect the current data sources and calculation formulas.
5. Inspect the existing architecture planner.
6. Inspect the AI Advisor implementation.
7. Identify existing tests and deployment processes.
8. Inventory public URLs.
9. Review current design tokens.
10. Produce a baseline architecture and quality report.

Do not assume the application uses a particular framework merely because other projects by the owner use that framework.

### Strict rules

- Preserve all existing working functionality.
- Do not rewrite the application unnecessarily.
- Do not replace reliable calculation logic with AI-generated estimates.
- Do not introduce fabricated pricing data.
- Do not invent usage statistics or testimonials.
- Do not silently change existing calculation formulas.
- Do not remove working URLs without redirects.
- Do not expose API keys.
- Do not introduce unnecessary paid dependencies.
- Do not deploy without explicit owner approval.
- Do not declare tests passing unless they actually ran.

### Mandatory implementation strategy

Use incremental, reversible changes.

Each phase must produce:

- Code changes.
- Unit tests.
- Integration tests.
- Screenshots.
- Accessibility findings.
- Performance findings.
- Security review.
- Validation report.
- Rollback instructions.

---

# PART II — COMPETITIVE BENCHMARKING

## 3. Benchmark Products

### Benchmark A — Microsoft Azure Pricing Calculator

Reference:

https://azure.microsoft.com/en-us/pricing/calculator/

Study:

- Pricing configuration.
- Azure region selection.
- Service and workload configuration.
- Currency presentation.
- Detailed estimate breakdowns.
- Pricing assumptions.
- Cost comparison.
- Export and sharing patterns.

Fabric Master must exceed a simple cost calculator by connecting estimated cost to workload sizing and architecture planning.

Do not reproduce Microsoft's interface, branding, illustrations, or proprietary assets.

### Benchmark B — Microsoft Fabric Capacity Metrics App

Reference:

https://learn.microsoft.com/en-us/fabric/enterprise/metrics-app

Study:

- Capacity utilization.
- Workload monitoring.
- Compute consumption.
- Throttling.
- Interactive versus background operations.
- Time-based analysis.
- Performance investigation.

Fabric Master must distinguish between estimated workloads and measured capacity telemetry.

The platform must never imply that it has access to a user's live Microsoft tenant without an authorized connection.

### Benchmark C — Databricks Pricing Calculator

Reference:

https://www.databricks.com/product/pricing

Study:

- Workload configuration.
- Compute selections.
- Cloud-provider context.
- Multiple scenarios.
- Cost estimation.
- Calculation assumptions.

Fabric Master must support configurable, reproducible scenarios.

### Benchmark D — Azure Architecture Center

Reference:

https://learn.microsoft.com/en-us/azure/architecture/

Study:

- Reference architectures.
- Technical decision trees.
- Architecture documentation.
- Reliability considerations.
- Security patterns.
- Implementation guidance.

Fabric Master must provide technical guidance with source references, assumptions, and limitations.

### Benchmark deliverable

Create:

`docs/benchmark-analysis.md`

Include:

- Competitor name.
- Reference URL.
- Observed capabilities.
- Fabric Master current equivalent.
- Identified gaps.
- Proposed improvements.
- Implementation priority.
- Evidence date.

Do not claim to have inspected competitor features that were inaccessible.

---

# PART III — PREMIUM DESIGN SYSTEM

## 4. Design Direction

### Target aesthetic

Premium enterprise SaaS with the visual refinement of modern cloud engineering platforms.

The design must feel:

- Professional.
- Trustworthy.
- Modern.
- Technically sophisticated.
- Calm.
- Precise.
- Fast.
- Consistent.

Avoid:

- Excessive neon effects.
- Heavy glassmorphism.
- Unnecessary animations.
- Oversized gradient backgrounds.
- Decorative dashboards without real data.
- Fake terminal outputs.
- Excessive emoji.
- Overcrowded navigation.
- Misleading status indicators.

### Primary design inspiration

Use the visual discipline of enterprise software rather than copying any one website.

Key principles:

- Strong typographic hierarchy.
- Generous spacing.
- Restrained color.
- Consistent components.
- Clear information density.
- Excellent data visualization.
- Accessible interaction states.

---

## 5. Color System

### Dark theme

| Token | Hex |
|---|---|
| Background | #080F1D |
| Surface | #101B2D |
| Elevated Surface | #17263D |
| Border | #2B3B53 |
| Primary Text | #F3F7FC |
| Secondary Text | #A7B8CC |
| Primary Accent | #3B82F6 |
| Cyan Accent | #22D3EE |
| Success | #22C55E |
| Warning | #F59E0B |
| Error | #F87171 |

### Light theme

| Token | Hex |
|---|---|
| Background | #F7F9FC |
| Surface | #FFFFFF |
| Elevated Surface | #F1F5FA |
| Border | #DCE4EF |
| Primary Text | #142235 |
| Secondary Text | #52657D |
| Primary Accent | #2563EB |
| Cyan Accent | #0891B2 |
| Success | #15803D |
| Warning | #B45309 |
| Error | #B91C1C |

### Theme requirements

- Support dark mode.
- Support light mode.
- Support system preference.
- Persist preference where storage is permitted.
- Prevent theme flashing on initial render.
- Ensure chart colors remain distinguishable.
- Meet WCAG 2.2 AA contrast requirements for applicable text and controls.

---

## 6. Typography

Use a professional, legible font family.

Recommended:

- Inter for UI text, if properly licensed and available.
- System sans-serif as a reliable fallback.
- A suitable monospaced font for code and numeric technical output.

### Typography scale

| Element | Desktop | Mobile |
|---|---|---|
| Hero heading | 48–56px | 32–38px |
| Page title | 34–40px | 28–32px |
| Section title | 24–28px | 21–24px |
| Card title | 17–20px | 16–18px |
| Body | 15–16px | 15–16px |
| Labels | 12–14px | 12–14px |

Use responsive typography rather than fixed desktop sizes.

---

## 7. Spacing and Layout

Adopt an 8-point spacing system.

Recommended spacing tokens:

4, 8, 12, 16, 24, 32, 48, and 64 pixels.

### Layout standards

- Maximum content width: approximately 1440px.
- Dashboard sidebar: approximately 240–260px.
- Main workspace padding: 24–32px on desktop.
- Mobile padding: 16px.
- Card border radius: 12–16px.
- Consistent section spacing.
- Avoid unnecessarily tall cards.
- Avoid large empty areas without purpose.

### Responsive breakpoints

Use the existing project's conventions where possible.

Target:

- Mobile: 320–767px.
- Tablet: 768–1023px.
- Desktop: 1024–1439px.
- Wide desktop: 1440px and above.

Test at 320, 375, 768, 1024, 1440, and 1920 pixels.

---

## 8. Component Library

Create or refine reusable components:

- AppShell
- SidebarNavigation
- TopNavigation
- MobileNavigation
- Breadcrumbs
- PageHeader
- SectionHeader
- MetricCard
- TechnicalMetricCard
- ComparisonCard
- CalculatorInput
- CurrencySelector
- RegionSelector
- SKUSelector
- ScenarioCard
- AssumptionPanel
- FormulaExplanation
- SourceReference
- ConfidenceIndicator
- DataTable
- EmptyState
- ErrorState
- LoadingSkeleton
- ToastNotification
- ExportMenu
- ConfirmationDialog
- ArchitectureCanvas
- AIExplanationPanel

Use the existing component framework where practical.

Do not add a new UI library unless a technical review justifies it.

---

# PART IV — WEBSITE INFORMATION ARCHITECTURE

## 9. Proposed Navigation

### Main navigation

**Overview**
- Home
- Engineering Workspace
- Saved Scenarios

**Capacity Intelligence**
- Capacity Sizing Wizard
- F-SKU Comparison
- Workload Estimator
- Power BI Capacity Planner
- Spark Capacity Planner

**FinOps Studio**
- Cost Calculator
- PAYG vs Reservation
- Region Comparison
- Cost Optimization
- Scenario Comparison

**Architecture Studio**
- Architecture Planner
- Reference Architectures
- Medallion Architecture
- Direct Lake Architecture
- Data Integration Patterns

**Observability**
- Usage Import
- Capacity Analysis
- Throttling Diagnostics
- Workload Timeline

**AI Engineering**
- AI Advisor
- Explain My Estimate
- Architecture Review
- Optimization Guidance

**Resources**
- Documentation
- Microsoft Fabric Guides
- Pricing Methodology
- Technical Articles
- Glossary
- FAQ

### Footer

- About Fabric Master
- Methodology
- Data Sources
- Privacy Policy
- Terms of Use
- Disclaimer
- GitHub
- Contact
- Changelog

### Routing requirements

Audit existing URLs before changing routes.

Prefer preserving existing paths.

If a route changes:

- Implement permanent redirects where appropriate.
- Preserve query parameters where meaningful.
- Update internal links.
- Update canonical URLs.
- Update sitemap entries.
- Test old links.

---

# PART V — HOMEPAGE REDESIGN

## 10. Hero Section

### Primary headline

**Engineer Microsoft Fabric with Confidence**

### Supporting headline

Capacity planning, cost intelligence, architecture design, and explainable engineering guidance in one independent workspace.

### Primary CTA

**Launch Engineering Workspace**

### Secondary CTA

**Explore Fabric Calculators**

### Supporting trust statement

Independent engineering tools. Transparent calculations. Documented assumptions.

### Hero visual

Build a genuine product interface preview.

The preview should contain:

- Selected F-SKU.
- Estimated monthly cost.
- Capacity utilization scenario.
- Architecture summary.
- Calculation assumptions.
- Source verification indicator.

All sample values must be labeled illustrative.

Do not display invented real-time capacity telemetry.

---

## 11. Homepage Sections

Implement the following sequence.

### Section A — Hero

Headline, explanation, CTA, and actual product interface preview.

### Section B — Core Capabilities

Four premium cards:

1. Capacity Intelligence.
2. FinOps Studio.
3. Architecture Studio.
4. AI Engineering Advisor.

Each card must link to a functioning destination.

### Section C — Engineering Workflow

Show a six-step process:

Define Workload → Estimate Capacity → Compare Cost → Design Architecture → Validate → Export Report.

### Section D — Interactive Preview

Allow a visitor to select an F-SKU and explore an illustrative estimate.

Show the source and assumptions.

### Section E — Technical Trust

Explain:

- Calculation transparency.
- Pricing source policy.
- Data handling.
- Version history.
- Model limitations.
- Independent product status.

### Section F — Reference Architectures

Show verified architecture examples with technical explanations.

### Section G — Technical Resources

Feature high-quality guides.

### Section H — FAQ

Answer genuine engineering questions.

### Section I — Final CTA

**Start Planning Your Microsoft Fabric Architecture**

---

# PART VI — UNIFIED ENGINEERING WORKSPACE

## 12. Core Workspace

Create a unified workspace connecting the existing tools.

### Workspace layout

Left sidebar:

- Project Overview
- Workload Inputs
- Capacity Estimate
- FinOps Analysis
- Architecture
- Validation
- Report

Main panel:

Displays the selected workflow.

Right contextual panel:

- Assumptions.
- Technical explanation.
- Source references.
- Warnings.
- AI assistance, where available.

### Workspace header

Display:

- Project name.
- Scenario name.
- Last modified date.
- Unsaved changes.
- Save.
- Duplicate.
- Export.

### Workspace requirements

- Users can create scenarios.
- Users can edit scenarios.
- Users can duplicate scenarios.
- Users can compare scenarios.
- Users can export scenarios.
- Users can import valid scenario files.
- Users can reset a scenario.
- Users can view calculation history.

### Persistence

Default to local-first storage where feasible.

Use IndexedDB or the existing persistence layer.

If cloud synchronization is introduced:

- Require explicit user opt-in.
- Implement authentication.
- Enforce authorization.
- Define retention and deletion policies.
- Document external data processing.

No mandatory account should be required for basic public calculators.

---

# PART VII — CAPACITY INTELLIGENCE ENGINE

## 13. Workload Input Model

Support separate workload categories.

### Data Factory

Inputs:

- Number of pipelines.
- Pipeline execution frequency.
- Activities per pipeline.
- Data movement volume.
- Execution duration.
- Peak concurrency.
- Scheduling window.

### Spark

Inputs:

- Workload category.
- Job frequency.
- Runtime.
- Concurrency.
- Cluster characteristics.
- Processing volume.
- Scheduling window.

### Power BI

Inputs:

- Semantic model size.
- Refresh frequency.
- Interactive user concurrency.
- Query frequency.
- Query complexity assumptions.
- Storage mode.
- Background processing.
- Peak usage window.

### Warehouse and Lakehouse

Inputs:

- Storage volume.
- Ingestion frequency.
- Transformation workloads.
- Query concurrency.
- Workload duration.
- Background operations.

### Other Fabric workloads

Add support only where a documented and maintainable calculation methodology exists.

Unsupported workloads must be identified explicitly.

---

## 14. Calculation Engine Architecture

Separate the calculation engine from the UI.

Suggested modules:

- WorkloadNormalizer
- CapacityEstimator
- SKUComparator
- PricingEngine
- ScenarioEngine
- AssumptionValidator
- SourceRegistry
- ReportSerializer

### Deterministic calculation requirement

Given identical:

- Inputs.
- Calculation-engine version.
- Pricing dataset version.
- Assumptions.

The engine must produce identical numerical results.

AI-generated text must not change deterministic calculation outputs.

### Calculation transparency

Every estimate must expose:

- Input variables.
- Formula or model reference.
- Assumptions.
- Source.
- Version.
- Date.
- Known limitations.

### Critical engineering rule

Do not invent a direct conversion between dataset size, Spark processing volume, and required Fabric Capacity Units.

Where accurate sizing requires observed telemetry, mark the output as a preliminary estimate.

---

## 15. Capacity Recommendation Output

Display:

- Estimated capacity demand.
- Candidate F-SKUs.
- Selected F-SKU.
- Expected workload fit.
- Peak risk.
- Cost implications.
- Assumptions.
- Validation steps.

### Three scenarios

**Conservative**

Lower workload assumptions, where justified.

**Baseline**

Expected workload.

**Peak**

Higher concurrency or processing demand.

These scenarios must be derived from explicit inputs or documented assumptions.

### Confidence classification

Use:

- Measured.
- Model-based estimate.
- Heuristic estimate.
- Insufficient evidence.

Do not display arbitrary numerical confidence percentages.

### Recommendation language

Acceptable:

"F64 is a candidate capacity under the selected workload assumptions."

Unacceptable:

"F64 guarantees optimal performance."

---

# PART VIII — FINOPS STUDIO

## 16. Pricing Engine

Create a source-backed pricing subsystem.

### Inputs

- Azure region.
- Currency.
- Fabric SKU.
- Operating hours.
- PAYG pricing.
- Reservation assumptions.
- Usage schedule.
- Additional relevant services.

### Outputs

- Estimated hourly cost.
- Estimated daily cost.
- Estimated monthly cost.
- Estimated annual cost.
- PAYG comparison.
- Reservation comparison.
- Scenario difference.
- Cost assumptions.

### Pricing source hierarchy

1. Official Azure pricing data or documented APIs.
2. Official Microsoft pricing documentation.
3. Clearly dated and attributed manually maintained pricing tables.

Never silently substitute guessed prices.

### Pricing provenance

Each pricing record must include:

- Source URL.
- Region.
- Currency.
- SKU.
- Unit.
- Effective date, if available.
- Retrieval date.
- Pricing dataset version.
- Tax treatment.
- Reservation assumptions.

### Stale data handling

If pricing cannot be refreshed:

- Show the last verified date.
- Label the estimate as potentially outdated.
- Do not silently present it as current.

### Regional availability

Verify supported SKUs and region availability.

Do not display unsupported region/SKU combinations as purchasable configurations.

---

## 17. Pricing Calculation Requirements

### PAYG estimate

For an applicable fixed hourly rate:

Estimated cost = Hourly rate × Billable hours.

### Reservation comparison

Use the applicable reservation terms and official pricing.

Account for:

- Reservation term.
- Commitment scope.
- Eligible capacity.
- Actual utilization.
- Payment assumptions.
- Relevant exclusions.

Do not assume every capacity can be reserved under identical terms.

### Additional cost categories

Display separately where applicable:

- Storage.
- Network or egress.
- Other Azure services.
- Licensing considerations.
- Taxes.
- Support costs.

Do not add unsupported cost categories to a calculation.

### Cost comparison

Support:

- Side-by-side scenarios.
- Monthly and annual views.
- Sensitivity analysis.
- Difference charts.
- Break-even analysis where justified.

---

# PART IX — ARCHITECTURE STUDIO

## 18. Visual Architecture Designer

Create a premium, interactive architecture canvas.

### Required capabilities

- Drag-and-drop components.
- Connect components.
- Edit labels.
- Move and resize nodes.
- Zoom and pan.
- Fit to screen.
- Undo and redo.
- Save and restore.
- Duplicate diagrams.
- Export SVG and PNG.
- Export structured JSON.
- Keyboard-accessible alternatives.

### Component categories

**Data Sources**
- SQL Server.
- PostgreSQL.
- APIs.
- Files.
- ERP systems.
- Cloud storage.

**Ingestion**
- Fabric Data Factory.
- Pipelines.
- Dataflows Gen2.
- Mirroring, where applicable.

**Storage**
- OneLake.
- Lakehouse.
- Warehouse.
- Delta tables.

**Processing**
- Spark.
- Notebooks.
- SQL transformations.
- Data engineering workflows.

**Analytics**
- Semantic models.
- Direct Lake.
- Power BI reports.
- Dashboards.

**Governance**
- Access control.
- Data lineage.
- Monitoring.
- Data quality.

---

## 19. Reference Architecture Templates

Provide templates for:

1. Medallion Architecture.
2. SQL Server to Fabric Analytics.
3. Lakehouse and Power BI.
4. Warehouse-centric Analytics.
5. Data Factory ETL/ELT.
6. Direct Lake Semantic Model.
7. Enterprise Reporting Architecture.
8. Hybrid Data Integration.

Each template must include:

- Architecture diagram.
- Purpose.
- Prerequisites.
- Component explanation.
- Data flow.
- Security considerations.
- Performance considerations.
- Limitations.
- Official documentation references.

### Architecture validation

Detect:

- Disconnected nodes.
- Missing data sources.
- Unsupported connections.
- Unclear data flows.
- Missing governance considerations.
- Invalid component configurations.

Validation rules must be evidence-based.

---

# PART X — OBSERVABILITY & CAPACITY VALIDATION

## 20. Capacity Usage Analysis

Add a dedicated observability module.

### Phase-one scope

Import supported exported usage data.

Do not require live tenant access initially.

### Import capabilities

- CSV import.
- Schema validation.
- Field mapping.
- Data preview.
- Time-zone normalization.
- Duplicate detection.
- Missing-value handling.
- Invalid-record reporting.

### Analytics

Where source data supports it:

- Capacity utilization trends.
- Peak periods.
- Workload distribution.
- Interactive operations.
- Background operations.
- Throttling indicators.
- Workload concentration.
- Capacity consumption trends.

### Visualizations

- Utilization time series.
- Workload distribution.
- Peak usage heatmap.
- Operation table.
- Anomaly indicators.
- Scenario comparison.

### Security

Capacity telemetry may contain sensitive operational metadata.

Default to local processing.

Clearly explain any external data transfer.

Never upload telemetry to an AI provider without explicit consent.

---

# PART XI — AI ENGINEERING ADVISOR

## 21. AI Advisor v2

The AI Advisor must act as a technical explanation layer.

It must not replace the deterministic pricing or capacity engines.

### Supported tasks

- Explain capacity estimates.
- Explain cost differences.
- Review architecture assumptions.
- Identify missing inputs.
- Explain Fabric concepts.
- Suggest documentation.
- Discuss potential optimization options.
- Summarize exported analysis.

### Grounding hierarchy

1. Current scenario data.
2. Deterministic calculation results.
3. Versioned product documentation.
4. Official Microsoft documentation.
5. General model knowledge, clearly distinguished.

### AI response format

For engineering recommendations, show:

- Summary.
- Supporting evidence.
- Assumptions.
- Limitations.
- Suggested validation.
- References.

### AI trust controls

- Clearly label AI-generated explanations.
- Show relevant source references.
- Never fabricate documentation citations.
- Never claim access to a Microsoft tenant without authorization.
- Never expose hidden system prompts or API keys.
- Treat imported content as untrusted.
- Protect against prompt injection.
- Provide an option to disable AI features.

### Failure behavior

If AI is unavailable:

- Calculators must continue working.
- Existing scenarios must remain accessible.
- Deterministic reports must still export.
- Show a useful error message.

---

# PART XII — ENTERPRISE REPORT GENERATOR

## 22. Engineering Decision Report

Implement a professional export system.

### Supported formats

- PDF.
- HTML.
- JSON.
- CSV for applicable tabular outputs.
- SVG/PNG for architecture diagrams.

### PDF requirements

- Real PDF binary.
- A4 and Letter support.
- Professional typography.
- Correct page breaks.
- Embedded or compatible fonts.
- Selectable text where practical.
- Vector charts where feasible.
- Readable tables.
- Consistent headers and footers.
- Page numbering.
- Document metadata.

### Report structure

**Page 1 — Cover**

- Fabric Master branding.
- Report title.
- Project name.
- Scenario name.
- Creation date.
- Methodology version.

**Page 2 — Executive Summary**

- Selected capacity.
- Estimated cost.
- Workload summary.
- Important assumptions.
- Key risks.

**Page 3 — Capacity Analysis**

- Workload inputs.
- Estimated demand.
- Candidate SKUs.
- Scenario comparison.
- Limitations.

**Page 4 — FinOps Analysis**

- Regional pricing.
- PAYG comparison.
- Reservation comparison.
- Cost breakdown.
- Source date.

**Page 5 — Architecture & Recommendations**

- Architecture diagram.
- Design considerations.
- Validation steps.
- References.

Additional pages may be used where needed.

### Export integrity

All numerical outputs must match the underlying calculation engine.

No fabricated KPIs.

No silently omitted warnings.

No unsupported AI-generated numerical values.

### Report disclaimer

Include:

"Fabric Master is an independent engineering planning tool. Estimates are based on documented assumptions and should be validated against official Microsoft pricing, licensing, and actual workload measurements."

---

# PART XIII — TRUST, TRANSPARENCY & BRAND CREDIBILITY

## 23. Trust Center

Create a dedicated Trust & Methodology area.

### Required pages

- About Fabric Master.
- Calculation Methodology.
- Pricing Sources.
- Data Privacy.
- Security Overview.
- Technical Limitations.
- Changelog.
- Contact.

### About page

Explain:

- What Fabric Master does.
- Who maintains it.
- Why it exists.
- What it does not do.
- How users can report issues.

Identify the project owner appropriately.

### Independent product notice

Display a clear notice:

"Fabric Master is an independent project and is not affiliated with, endorsed by, or sponsored by Microsoft."

Use Microsoft product names accurately.

Do not imitate official Microsoft branding in a way that creates confusion.

---

## 24. Trustworthy Claims Policy

Remove or substantiate:

- Unsupported user counts.
- Unverified testimonials.
- Invented customer logos.
- Fake certifications.
- Fabricated savings.
- Fake real-time telemetry.
- Unsupported accuracy percentages.
- Unverified SLA statements.

### Verified metric policy

A public metric requires:

- Defined methodology.
- Data source.
- Measurement date.
- Reproducible evidence.
- Clear limitations.

### Sample data

All demonstration values must be labeled:

"Illustrative Example" or "Synthetic Demonstration Data."

Do not present demo data as production telemetry.

---

# PART XIV — SEO & TECHNICAL CONTENT

## 25. Search Engine Optimization

Create a technical SEO plan.

### Required checks

- Unique page titles.
- Unique meta descriptions.
- Correct canonical URLs.
- XML sitemap.
- Robots directives.
- Open Graph metadata.
- Social sharing images.
- Structured data where applicable.
- Descriptive headings.
- Internal linking.
- Mobile usability.
- Indexability.
- Duplicate content.

### Recommended content clusters

**Fabric Capacity**
- F-SKU comparison.
- Capacity sizing.
- Throttling.
- Utilization.
- Capacity Metrics interpretation.

**Fabric FinOps**
- Cost estimation.
- Regional pricing.
- PAYG vs Reservation.
- Cost optimization.
- Budget scenarios.

**Fabric Architecture**
- OneLake.
- Lakehouse.
- Warehouse.
- Direct Lake.
- Medallion architecture.
- Data Factory.

**Fabric Engineering**
- Spark planning.
- Pipeline design.
- Performance tuning.
- Semantic modeling.

### Content standards

Each technical article should contain:

- Author.
- Publication date.
- Last reviewed date.
- Technical references.
- Code or examples where useful.
- Limitations.
- Related resources.

Do not generate large volumes of shallow SEO content.

Prioritize accuracy and usefulness.

---

# PART XV — SECURITY, PRIVACY & RELIABILITY

## 26. Security Requirements

### Application security

- Validate all inputs.
- Sanitize untrusted content.
- Prevent cross-site scripting.
- Avoid unsafe HTML injection.
- Protect API endpoints.
- Apply rate limits where appropriate.
- Protect secrets.
- Enforce authorization on protected resources.
- Use HTTPS.
- Review dependencies.
- Prevent sensitive data leakage in logs.

### AI security

- Keep provider API keys server-side.
- Validate tool permissions.
- Treat retrieved documents as untrusted.
- Restrict access to sensitive scenario data.
- Avoid exposing internal prompts.
- Prevent unauthorized data access.

### Export security

- Escape exported HTML.
- Validate imported JSON.
- Avoid executing imported scripts.
- Sanitize filenames.
- Restrict file sizes.
- Reject unsupported file types.

---

## 27. Privacy Requirements

Default to privacy-conscious processing.

### Required behaviors

- No undisclosed telemetry upload.
- No hidden file transmission.
- No mandatory account for basic calculators.
- Clear AI data-processing notice.
- Explicit consent before sending sensitive inputs externally.
- Clear local-storage explanation.
- Data deletion controls.
- No credentials inside exported reports.

### Local-first scenarios

Use browser storage where practical.

Provide:

- Save.
- Export.
- Import.
- Delete.
- Clear all local data.

---

# PART XVI — PERFORMANCE & ACCESSIBILITY

## 28. Performance Targets

These are engineering targets, not claims of current performance.

### Core Web Vitals

At the 75th percentile of real-user measurements where sufficient data exists:

- LCP: 2.5 seconds or less.
- INP: 200 milliseconds or less.
- CLS: 0.1 or less.

### Additional targets

- Minimize initial JavaScript.
- Lazy-load heavy architecture components.
- Avoid unnecessary network requests.
- Optimize fonts and images.
- Cache appropriate static resources.
- Keep calculator interactions responsive.
- Prevent unnecessary rerenders.
- Use workers for expensive computations where justified.

Measure before and after changes.

Do not invent Lighthouse results.

---

## 29. Accessibility

Target WCAG 2.2 AA.

### Requirements

- Keyboard navigation.
- Visible focus indicators.
- Proper form labels.
- Accessible error messages.
- Semantic headings.
- Sufficient contrast.
- Screen-reader-friendly tables.
- Reduced-motion support.
- Accessible dialogs.
- Chart data alternatives.
- Responsive zoom support.

### Architecture editor accessibility

Provide an alternative structured node-and-connection editor for users who cannot operate drag-and-drop controls.

---

# PART XVII — ENGINEERING ARCHITECTURE

## 30. Suggested Module Organization

Adapt to the existing codebase rather than forcing a rewrite.

Suggested conceptual structure:

```text
src/
  app/
    workspace/
    capacity/
    finops/
    architecture/
    observability/
    advisor/
    reports/
    resources/
    trust/

  components/
    layout/
    navigation/
    cards/
    forms/
    charts/
    calculators/
    architecture/
    reports/
    trust/

  features/
    scenarios/
    capacity/
    pricing/
    architecture/
    telemetry/
    advisor/
    reporting/

  lib/
    calculations/
    validation/
    pricing/
    persistence/
    security/
    exports/
    references/

  data/
    pricing/
    reference-architectures/
    documentation/

  tests/
    unit/
    integration/
    e2e/
    accessibility/
    regression/

docs/
  architecture/
  methodology/
  benchmark/
  security/
  implementation/
  validation/
```

This is a reference organization, not a mandatory directory rewrite.

---

## 31. Core Data Models

### Scenario

```typescript
type Scenario = {
  id: string;
  schemaVersion: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  region: string;
  currency: string;
  workloads: WorkloadInput[];
  assumptions: Assumption[];
  selectedSku?: string;
  calculationVersion: string;
  pricingVersion?: string;
};
```

### Calculation Result

```typescript
type CalculationResult = {
  scenarioId: string;
  calculationVersion: string;
  calculatedAt: string;
  candidateSkus: string[];
  selectedSku?: string;
  metrics: Record<string, number | null>;
  warnings: string[];
  assumptions: Assumption[];
  references: SourceReference[];
  evidenceLevel:
    | "measured"
    | "model_based"
    | "heuristic"
    | "insufficient";
};
```

### Pricing Record

```typescript
type PricingRecord = {
  sku: string;
  region: string;
  currency: string;
  hourlyRate: number;
  unit: string;
  pricingModel: string;
  sourceUrl: string;
  retrievedAt: string;
  effectiveAt?: string;
  version: string;
};
```

### Data model requirements

- Use schema validation.
- Version persisted data.
- Support migrations.
- Reject malformed imports.
- Avoid unsafe defaults.
- Handle missing values explicitly.

---

# PART XVIII — TESTING STRATEGY

## 32. Unit Tests

Test:

- Workload normalization.
- Capacity calculations.
- SKU comparisons.
- Pricing calculations.
- Currency handling.
- Region handling.
- Scenario cloning.
- Input validation.
- Export serialization.
- Date and time handling.

### Mandatory edge cases

- Zero workload.
- Missing inputs.
- Negative inputs.
- Extremely large values.
- Invalid currencies.
- Unsupported regions.
- Missing pricing records.
- Stale pricing.
- Duplicate telemetry rows.
- Invalid timestamps.
- Corrupt imported files.

---

## 33. Integration Tests

Verify:

- Wizard to calculation engine.
- Calculation engine to FinOps.
- Scenario persistence.
- Architecture linking.
- AI explanation context.
- Report generation.
- Pricing source loading.
- Import/export consistency.

### Numerical parity

For identical inputs:

- Workspace totals.
- Comparison totals.
- PDF totals.
- HTML totals.
- JSON totals.

Must match within explicitly documented rounding tolerances.

---

## 34. End-to-End Tests

Test these user journeys:

**Journey A — First-Time Visitor**

Home → Capacity Wizard → Estimate → Explanation.

**Journey B — FinOps Analyst**

Select Region → Select SKU → Compare Pricing → Export.

**Journey C — Fabric Architect**

Create Scenario → Design Architecture → Validate → Export Diagram.

**Journey D — Engineering Consultant**

Enter Workload → Compare Scenarios → Generate Decision Report.

**Journey E — Returning User**

Open Saved Scenario → Modify Inputs → Recalculate → Export.

**Journey F — AI Unavailable**

Open Calculator → Calculate → Export without AI.

---

## 35. Visual Regression Tests

Test:

- Homepage.
- Navigation.
- Capacity Wizard.
- FinOps Studio.
- Architecture Studio.
- AI Advisor.
- Report preview.
- Mobile navigation.
- Dark theme.
- Light theme.

Capture screenshots at defined viewport sizes.

Flag unexpected layout changes.

---

# PART XIX — IMPLEMENTATION PHASES

## 36. Phase 0 — Complete Audit

**Priority:** P0

Tasks:

1. Inspect repository.
2. Identify framework.
3. Inventory routes.
4. Inventory calculators.
5. Review formulas.
6. Review pricing sources.
7. Review AI integration.
8. Review current assets.
9. Inspect test coverage.
10. Establish performance baseline.

Deliverables:

- Current architecture report.
- Feature inventory.
- Calculation audit.
- Pricing audit.
- Risk register.
- Implementation dependency map.

### Exit criteria

No major feature may be redesigned until its current behavior and dependencies are documented.

---

## 37. Phase 1 — Trust & Accuracy

**Priority:** P0

Tasks:

- Remove unsupported claims.
- Add pricing provenance.
- Add methodology pages.
- Add independent-product disclaimer.
- Improve error messages.
- Add calculation assumptions.
- Correct misleading example data.
- Fix verified technical content errors.

### Exit criteria

Every published pricing and capacity result has a documented source or model explanation.

---

## 38. Phase 2 — Premium Design System

**Priority:** P0

Tasks:

- Establish design tokens.
- Rebuild application shell.
- Improve navigation.
- Implement theme support.
- Redesign cards.
- Standardize forms.
- Standardize charts.
- Improve responsive layouts.
- Add accessible loading and error states.

### Exit criteria

All existing tools remain functional and visually consistent.

---

## 39. Phase 3 — Homepage Transformation

**Priority:** P1

Tasks:

- Implement premium hero.
- Add product preview.
- Add capability sections.
- Add engineering workflow.
- Add methodology/trust section.
- Improve resource discovery.
- Add clear CTAs.

### Exit criteria

A new visitor can understand the product's purpose and access a useful tool without unnecessary navigation.

---

## 40. Phase 4 — Unified Workspace

**Priority:** P1

Tasks:

- Build scenario model.
- Add scenario management.
- Integrate existing calculators.
- Add assumptions panel.
- Add calculation history.
- Add import/export.
- Add comparison workflow.

### Exit criteria

A scenario can be created, saved, reopened, modified, and reproduced.

---

## 41. Phase 5 — Capacity & FinOps Intelligence

**Priority:** P1

Tasks:

- Refactor calculation engine.
- Implement pricing provenance.
- Add regional comparison.
- Add workload scenarios.
- Add sensitivity analysis.
- Add estimate explanations.
- Add formula tests.

### Exit criteria

All outputs are deterministic, explainable, and supported by documented assumptions.

---

## 42. Phase 6 — Architecture Studio

**Priority:** P1

Tasks:

- Implement interactive canvas.
- Add component library.
- Add templates.
- Add validation rules.
- Add diagram persistence.
- Add exports.
- Add accessibility alternative.

### Exit criteria

Users can create, edit, save, restore, validate, and export architecture diagrams.

---

## 43. Phase 7 — Observability

**Priority:** P2

Tasks:

- Build telemetry import.
- Add schema validation.
- Add utilization charts.
- Add throttling analysis.
- Add workload breakdown.
- Add data quality reporting.

### Exit criteria

Supported telemetry can be imported and analyzed without misleading results.

---

## 44. Phase 8 — AI Advisor

**Priority:** P2

Tasks:

- Connect advisor to scenario context.
- Ground explanations in calculations.
- Add source references.
- Add AI disclosure.
- Add privacy controls.
- Add graceful fallback.

### Exit criteria

AI cannot silently alter numerical calculation results.

---

## 45. Phase 9 — Report Generator

**Priority:** P1

Tasks:

- Create PDF templates.
- Create HTML export.
- Add scenario comparison.
- Add methodology appendix.
- Add architecture diagram.
- Add data provenance.
- Validate numerical parity.

### Exit criteria

Reports are professional, readable, and numerically consistent.

---

## 46. Phase 10 — SEO, Security & Performance

**Priority:** P1

Tasks:

- Technical SEO audit.
- Structured data.
- Metadata.
- Sitemap.
- Accessibility audit.
- Security review.
- Dependency audit.
- Performance optimization.
- Regression testing.

### Exit criteria

All critical defects are resolved and the quality report documents measured results.

---

# PART XX — RELEASE MANAGEMENT

## 47. Deployment Strategy

Do not deploy all phases simultaneously.

### Required release process

1. Create a feature branch.
2. Implement a bounded phase.
3. Run tests.
4. Generate preview.
5. Review changes.
6. Obtain approval.
7. Deploy to staging or preview.
8. Run smoke tests.
9. Deploy to production after approval.
10. Monitor errors.
11. Retain rollback capability.

### Feature flags

Use feature flags for substantial new modules where appropriate.

Suggested flags:

- `workspace_v4`
- `finops_v4`
- `architecture_studio_v4`
- `observability_v4`
- `advisor_v2`
- `reports_v4`

Use existing configuration conventions.

Do not expose sensitive server-side feature configuration unnecessarily.

---

## 48. Backward Compatibility

Preserve:

- Existing calculator URLs.
- Existing shared links where feasible.
- Existing saved data where migration is possible.
- Existing public documentation.
- Existing working API contracts.
- Existing search engine indexing.

### Migration requirements

- Version storage schemas.
- Provide migration logic.
- Test legacy scenarios.
- Handle invalid legacy records safely.
- Do not silently delete user data.

---

# PART XXI — ACCEPTANCE CRITERIA

## 49. Master Acceptance Matrix

| ID | Requirement | Priority |
|---|---|---|
| AC-001 | Existing tools remain functional | P0 |
| AC-002 | Premium responsive design | P0 |
| AC-003 | Dark and light themes | P0 |
| AC-004 | No unsupported public claims | P0 |
| AC-005 | Source-backed pricing | P0 |
| AC-006 | Visible calculation assumptions | P0 |
| AC-007 | Independent-product disclaimer | P0 |
| AC-008 | Validated numerical calculations | P0 |
| AC-009 | No exposed credentials | P0 |
| AC-010 | Scenario creation and editing | P1 |
| AC-011 | Scenario persistence | P1 |
| AC-012 | Scenario comparison | P1 |
| AC-013 | Regional pricing | P1 |
| AC-014 | Capacity sizing explanations | P1 |
| AC-015 | Architecture editor | P1 |
| AC-016 | Architecture export | P1 |
| AC-017 | Professional PDF reports | P1 |
| AC-018 | Export numerical parity | P0 |
| AC-019 | Accessible navigation | P0 |
| AC-020 | Mobile compatibility | P0 |
| AC-021 | AI grounding | P1 |
| AC-022 | AI privacy controls | P0 |
| AC-023 | Telemetry import validation | P2 |
| AC-024 | SEO metadata and sitemap | P1 |
| AC-025 | Core Web Vitals measured | P1 |
| AC-026 | Security audit completed | P0 |
| AC-027 | Regression suite passing | P0 |
| AC-028 | Documentation complete | P1 |
| AC-029 | Rollback procedure documented | P0 |
| AC-030 | Owner approval before deployment | P0 |

A requirement may be marked PASS only with supporting evidence.

---

# PART XXII — REQUIRED DELIVERABLES

## 50. Documentation Files

Generate or update:

```text
docs/
  benchmark/
    enterprise-competitor-analysis.md

  architecture/
    current-system-audit.md
    target-architecture.md
    data-models.md

  methodology/
    capacity-calculation-methodology.md
    pricing-methodology.md
    confidence-and-limitations.md

  security/
    security-review.md
    privacy-data-flow.md

  implementation/
    phase-0-audit.md
    phase-1-trust.md
    phase-2-design.md
    phase-3-homepage.md
    phase-4-workspace.md
    phase-5-capacity-finops.md
    phase-6-architecture.md
    phase-7-observability.md
    phase-8-ai-advisor.md
    phase-9-reporting.md
    phase-10-quality.md

  validation/
    regression-report.md
    accessibility-report.md
    performance-report.md
    pricing-validation.md
    export-parity-report.md

  release/
    deployment-checklist.md
    rollback-plan.md
    final-acceptance-report.md
```

Do not create empty placeholder reports and mark them complete.

---

## 51. Final Quality Report

For each phase, provide:

- Scope.
- Files modified.
- Features added.
- Features preserved.
- Tests executed.
- Tests passed.
- Tests failed.
- Screenshots.
- Performance measurements.
- Accessibility findings.
- Security findings.
- Known limitations.
- Deployment readiness.

### Status values

Use:

- PASS
- FAIL
- PARTIAL
- BLOCKED
- NOT TESTED

Never use PASS for an unexecuted test.

---

# PART XXIII — IMPLEMENTATION PRIORITIES

## 52. Recommended Delivery Order

### Release 4.0A — Foundation

- Repository audit.
- Trust corrections.
- Design system.
- Homepage redesign.
- Responsive navigation.

### Release 4.0B — Engineering Workspace

- Scenario model.
- Workspace integration.
- Capacity estimation.
- FinOps comparison.
- Assumptions and provenance.

### Release 4.0C — Professional Engineering

- Architecture Studio.
- Scenario comparison.
- PDF report generation.
- Reference architecture documentation.

### Release 4.0D — Advanced Intelligence

- Observability import.
- AI Advisor improvements.
- Engineering diagnostics.
- Advanced validation.

### Release 4.0E — Enterprise Hardening

- Accessibility.
- Security.
- Performance.
- SEO.
- Regression testing.
- Documentation.
- Production readiness.

---

# PART XXIV — OUT OF SCOPE

Unless separately approved, do not:

- Build a paid subscription system.
- Introduce mandatory user registration.
- Connect directly to Microsoft tenants.
- Request Microsoft tenant administrator permissions.
- Build a multi-tenant SaaS backend.
- Implement automatic Azure purchasing.
- Modify live Azure capacities.
- Introduce billing or payment collection.
- Migrate hosting providers.
- Replace the existing application framework.
- Rebuild unrelated websites.
- Add unnecessary AI agents.

These can be considered future initiatives after the core platform is stable.

---

# PART XXV — FINAL AGENT EXECUTION DIRECTIVE

You are authorized to inspect and prepare implementation changes for Fabric Master v4.0.

Begin with Phase 0.

Do not begin by replacing the homepage.

First understand the existing application, document the current implementation, verify the calculation logic, and identify dependencies.

Then implement the transformation incrementally.

The target product must combine:

- The pricing transparency of enterprise cloud calculators.
- The engineering depth of Microsoft Fabric capacity monitoring.
- The scenario modeling usability of modern cloud platforms.
- The architecture discipline of established reference architecture systems.
- A distinctive, premium Fabric Master visual identity.

The result must be a trustworthy, technically accurate, visually refined, and maintainable engineering platform.

### Mandatory completion condition

Do not declare Fabric Master v4.0 production-ready unless:

1. Existing functionality passes regression tests.
2. Pricing assumptions are transparent.
3. Calculation results are reproducible.
4. Public technical claims are defensible.
5. The application is responsive and accessible.
6. Security review is completed.
7. Exported reports match the calculation engine.
8. All critical defects are resolved.
9. Documentation is complete.
10. The owner explicitly approves deployment.

**END OF FABRIC MASTER v4.0 PRD**

