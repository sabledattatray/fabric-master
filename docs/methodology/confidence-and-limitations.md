# Confidence Classification & Technical Limitations
**Product:** Fabric Master v4.0  
**Status:** Engineering Governance & Trust Specification  
**Version:** 4.0  
**Effective Date:** October 2026  

---

## 1. Evidence-Based Confidence Classification

In accordance with PRD Section 15 and Non-Negotiable Instructions, Fabric Master does not present arbitrary statistical probability scores (e.g. "99% guaranteed accurate"). Instead, all sizing outputs and architectural recommendations are classified into four transparent tiers:

| Tier | Classification | Definition & Basis | Appropriate Use |
|---|---|---|---|
| **1** | **Measured** | Derived directly from imported Microsoft Fabric Capacity Metrics telemetry or verified tenant telemetry logs. | Post-migration tuning; actual usage analysis. |
| **2** | **Model-Based Estimate** | Calculated from verified deterministic formulas combining known workload inputs (vCores, runtime, pipelines, concurrent users). | Pre-deployment capacity budgeting and SKU selection. |
| **3** | **Heuristic Estimate** | Derived from general rule-of-thumb ratios where specific query runtime or DAX complexity data is absent. | Preliminary ballpark sizing; initial discovery. |
| **4** | **Insufficient Evidence** | Workload inputs are missing, incomplete, or span unsupported preview features without public sizing models. | Requires user to supply missing parameters. |

---

## 2. Technical Limitations & Boundary Conditions

Fabric Master is an independent planning and FinOps workbench designed for architectural modeling. Users must understand the following boundary conditions:

1. **No Live Tenant Introspection:** Fabric Master runs client-side and does not connect directly to a user's Microsoft 365 or Azure tenant. It does not inspect live enterprise metadata without explicit user file import.
2. **DAX Query Variance:** Actual Power BI memory and CPU burn depend heavily on semantic model optimization, relationship cardinality, measure efficiency, and cache hit ratios. Calculations assume typical star schema query characteristics.
3. **Data Factory Orchestration vs. Data Movement:** Pipeline runtimes vary significantly based on source connection latency, Integration Runtime (IR) configuration, and network egress bandwidth.
4. **Dynamic Bursting:** Microsoft Fabric provides automatic bursting capabilities beyond capacity limits when platform resources permit. Sizing recommendations focus on steady-state sustainable workload limits to prevent throttling.
5. **Contractual Terms:** Cloud pricing and currency conversions fluctuate. Fabric Master estimates are for technical decision guidance and do not constitute an official commercial offer or binding quote from Microsoft.

---

## 3. Independent Product Statement

Fabric Master is an independent open-source project and is not affiliated with, endorsed by, or sponsored by Microsoft Corporation. All product names, logos, and brands are property of their respective owners.
