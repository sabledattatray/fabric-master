# Microsoft Fabric Pricing & FinOps Methodology
**Product:** Fabric Master v4.0  
**Status:** Official Pricing Methodology Specification  
**Version:** 4.0  
**Effective Date:** October 2026  

---

## 1. Official Pricing Source & Hierarchy

Fabric Master maintains strict pricing transparency. All cost calculations are anchored to official Microsoft Azure retail pricing for Microsoft Fabric:

### Pricing Source Reference:
- **Primary Source:** [Microsoft Azure Fabric Pricing](https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/)
- **Baseline Region:** Azure US East / US West Standard Tier
- **Currency:** USD ($) with multi-currency conversion support
- **Published Unit Rate:** $\$0.1800 \text{ USD per Capacity Unit (CU) per hour}$
- **Last Verified Date:** October 2026
- **Update Frequency:** Quarterly review against Azure Retail Rates API

---

## 2. Fabric SKU Pricing Table (Standard Reference)

| SKU Tier | Capacity Units (CU) | Hourly Rate (USD) | Monthly PAYG (730 hrs) | 1-Yr Reserved Hourly | 1-Yr Reserved Monthly | Annual Savings (USD) |
|---|---|---|---|---|---|---|
| **F2** | 2 | $0.36 | $262.80 | $0.212 | $155.05 | $1,293.00 |
| **F4** | 4 | $0.72 | $525.60 | $0.425 | $310.10 | $2,586.00 |
| **F8** | 8 | $1.44 | $1,051.20 | $0.850 | $620.21 | $5,171.88 |
| **F16** | 16 | $2.88 | $2,102.40 | $1.699 | $1,240.42 | $10,343.76 |
| **F32** | 32 | $5.76 | $4,204.80 | $3.398 | $2,480.83 | $20,687.64 |
| **F64** | 64 | $11.52 | $8,409.60 | $6.797 | $4,961.66 | $41,375.28 |
| **F128** | 128 | $23.04 | $16,819.20 | $13.594 | $9,923.33 | $82,750.44 |
| **F256** | 256 | $46.08 | $33,638.40 | $27.187 | $19,846.66 | $165,500.88 |
| **F512** | 512 | $92.16 | $67,276.80 | $54.374 | $39,693.31 | $331,001.88 |
| **F1024** | 1024 | $184.32 | $134,553.60 | $108.749 | $79,386.62 | $662,003.76 |
| **F2048** | 2048 | $368.64 | $269,107.20 | $217.498 | $158,773.25 | $1,324,007.40 |

---

## 3. Financial Calculation Formulas

### 3.1 Pay-As-You-Go (PAYG)
$$\text{Hourly Cost} = \text{SKU CU} \times \$0.18$$
$$\text{Monthly Cost} = \text{Hourly Cost} \times 730 \text{ hours}$$
$$\text{Annual Cost} = \text{Monthly Cost} \times 12 \text{ months}$$

### 3.2 1-Year Reserved Capacity (RI)
Microsoft offers commitment discounts of approximately **40.998% (~41%)** for 1-Year Reserved Instances:
$$\text{RI Hourly Cost} = \text{PAYG Hourly Cost} \times 0.590003$$
$$\text{RI Monthly Cost} = \text{RI Hourly Cost} \times 730 \text{ hours}$$
$$\text{Monthly Savings} = \text{PAYG Monthly Cost} - \text{RI Monthly Cost}$$

---

## 4. Ancillary Costs & Exclusions

In compliance with PRD Section 17, the following cost items are accounted for separately:
1. **OneLake Storage:** Billed under Azure Data Lake Storage (ADLS) Gen2 standard pricing ($0.023/GB/month for hot LRS storage).
2. **Bandwidth / Egress:** Standard Azure egress data transfer rates apply to cross-region transfers.
3. **Power BI Licensing:**
   - **F2 to F32:** Requires individual Power BI Pro ($10/user/mo) or Premium Per User ($20/user/mo) licenses to consume shared reports.
   - **F64 and above:** Unlocks unlimited organizational viewing for users holding free Power BI licenses without individual Pro subscriptions.
4. **Copilot for Fabric:** Available on paid Fabric capacity (F2 or higher) subject to regional availability and tenant administrative enablement.
