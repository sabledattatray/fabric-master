# Microsoft Fabric Capacity Calculation Methodology
**Product:** Fabric Master v4.0  
**Status:** Official Sizing Methodology Specification  
**Version:** 4.0  
**Effective Date:** October 2026  

---

## 1. Overview & Sizing Principles

Microsoft Fabric compute capacity is measured in **Capacity Units (CUs)**. Unlike traditional cloud architectures where compute resources are siloed per engine, Microsoft Fabric pools all workloads—Data Factory pipelines, Apache Spark jobs, SQL Data Warehouses, KQL Real-Time Analytics, and Power BI semantic models—into a single shared Capacity Unit pool.

Fabric Master applies four engineering principles to sizing:
1. **Deterministic Formulation:** Sizing outputs must be mathematically reproducible given identical inputs.
2. **Workload Isolation & Smoothing:** Accounts for Microsoft Fabric's workload smoothing windows (24 hours for background batch jobs, 5 minutes for interactive DAX queries).
3. **50% Production Safety Buffer:** Enterprise production environments require headroom to absorb unplanned spikes without triggering capacity throttling.
4. **Transparent Assumptions:** Every estimation discloses its mathematical weights and variables.

---

## 2. Workload Mathematical Models

### 2.1 Data Factory Component ($CU_{DF}$)
Data Factory compute accounts for pipeline scheduling, activity orchestration, and data movement volume across 730 monthly hours:

$$CU_{DF} = \left(\frac{N_{\text{pipelines}}}{730}\right) \times N_{\text{activities}} \times w_{\text{activity}} + \left(V_{\text{data}} \times w_{\text{movement}}\right)$$

Where:
- $N_{\text{pipelines}}$ = Monthly pipeline executions
- $N_{\text{activities}}$ = Average activity count per pipeline (e.g. Copy, Web, Stored Procedure)
- $w_{\text{activity}} = 0.005$ CU/activity coefficient
- $V_{\text{data}}$ = Total data movement in Gigabytes (GB)
- $w_{\text{movement}} = 0.002$ CU/GB coefficient

### 2.2 Synapse Spark Compute Component ($CU_{\text{Spark}}$)
Microsoft Fabric Spark pools allocate compute based on vCores, where 2 Spark vCores equate to 1 Fabric Capacity Unit (CU):

$$CU_{\text{Spark}} = N_{\text{nodes}} \times V_{\text{cores/node}} \times \left(\frac{T_{\text{daily}}}{24}\right) \times 0.5$$

Where:
- $N_{\text{nodes}}$ = Total cluster node count (driver + executors)
- $V_{\text{cores/node}}$ = vCore allocation per node (standard cloud sizes: 2, 4, 8, 16, 32, 64)
- $T_{\text{daily}}$ = Active daily runtime hours ($0 \le T_{\text{daily}} \le 24$)
- $0.5$ = The official Fabric vCore-to-CU translation constant ($\frac{1 \text{ CU}}{2 \text{ vCores}}$)
- $24$ = Background smoothing divisor (24-hour window)

### 2.3 Power BI Reporting Component ($CU_{\text{PBI}}$)
Interactive Power BI workloads are evaluated based on peak concurrent user concurrency and DAX query model complexity:

$$CU_{\text{PBI}} = U_{\text{concurrent}} \times \left(S_{\text{complexity}} \times 0.2\right)$$

Where:
- $U_{\text{concurrent}}$ = Concurrently active query-generating users during peak usage
- $S_{\text{complexity}}$ = Query complexity scale ($1 = \text{Simple}$ to $5 = \text{Complex/Large Direct Lake}$)
- $0.2 = \text{Base CU allocation factor per user level}$ (range: 0.2 CU to 1.0 CU per concurrent user)

---

## 3. Capacity Recommendation Logic

### 3.1 Baseline & Safe Demand
$$\text{Calculated Baseline CU} = CU_{DF} + CU_{\text{Spark}} + CU_{\text{PBI}}$$
$$\text{Recommended Safe CU} = \text{Calculated Baseline CU} \times 1.50 \quad (+50\% \text{ Headroom})$$

### 3.2 SKU Matching
The engine selects the minimum SKU tier $S \in \{\text{F2}, \text{F4}, \text{F8}, \text{F16}, \text{F32}, \text{F64}, \text{F128}, \text{F256}, \text{F512}, \text{F1024}, \text{F2048}\}$ such that:
$$\text{Cost-Optimized SKU}: \min \{S_{\text{CU}} \mid S_{\text{CU}} \ge \text{Baseline CU}\}$$
$$\text{Safe Recommended SKU}: \min \{S_{\text{CU}} \mid S_{\text{CU}} \ge \text{Safe CU}\}$$

If demand exceeds F2048 (2048 CUs), the engine locks to F2048 with an explicit enterprise scale warning, preventing any arithmetic wrap-around.

---

## 4. Smoothing & Throttling Mitigation

Microsoft Fabric manages temporary compute spikes through **Smoothing** and **Throttling Policies**:
- **Background Smoothing (24 Hours):** Batch workloads (Spark notebooks, Data Factory pipelines) are smoothed across 24 hours. A 24-CU job running for 1 hour consumes 1 CU/hr over 24 hours.
- **Interactive Smoothing (5 Minutes):** Interactive DAX queries and warehouse queries are smoothed over 5 minutes.
- **Throttling Phases:**
  1. *Carryforward:* Bursts borrowing against future capacity quota without blocking operations.
  2. *Interactive Delay:* Interactive queries experience latency throttling when future burn exceeds thresholds.
  3. *Rejection:* Operations are rejected when capacity limits are exhausted.

Fabric Master calculates an illustrative **Throttling Risk Percentage** reflecting the buffer ratio between estimated peak workload and selected SKU tier.
