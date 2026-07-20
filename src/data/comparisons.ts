export interface ComparisonSpec {
  feature: string;
  leftValue: string;
  rightValue: string;
  winner?: "left" | "right" | "neutral";
}

export interface ComparisonData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  leftName: string;
  rightName: string;
  specs: ComparisonSpec[];
  keyDifferences: { title: string; detail: string }[];
  recommendation: string;
  faqs: { question: string; answer: string }[];
}

export const COMPARISONS_DATA: ComparisonData[] = [
  {
    slug: "f32-vs-f64",
    title: "F32 vs F64 Capacity Comparison",
    subtitle: "The Critical Decision: Standard Production vs. Enterprise Copilot & Free Licensing",
    description: "Compare Microsoft Fabric F32 and F64 capacities. Understand the crucial differences in compute power, Power BI free user distribution, Microsoft Fabric Copilot support, and monthly cost impact.",
    leftName: "F32 (32 CU)",
    rightName: "F64 (64 CU)",
    specs: [
      { feature: "Capacity Units (CU)", leftValue: "32 CUs", rightValue: "64 CUs", winner: "right" },
      { feature: "Pay-As-You-Go Monthly Cost", leftValue: "$4,204.80 / mo", rightValue: "$8,409.60 / mo", winner: "left" },
      { feature: "Reserved Instance Monthly Cost", leftValue: "$2,480.83 / mo", rightValue: "$4,961.66 / mo", winner: "left" },
      { feature: "Power BI Free User Distribution", leftValue: "No (Pro/PPU Required)", rightValue: "Yes (Unlimited Free Viewers)", winner: "right" },
      { feature: "Microsoft Fabric Copilot AI", leftValue: "No", rightValue: "Yes (Native Copilot Enabled)", winner: "right" },
      { feature: "Burst Capacity", leftValue: "256 CUs", rightValue: "512 CUs", winner: "right" },
      { feature: "Equivalent Power BI Premium Tier", leftValue: "P1/2 Equivalent", rightValue: "P1 Equivalent", winner: "right" }
    ],
    keyDifferences: [
      {
        title: "Power BI Free License Viewer Access",
        detail: "F64 is the minimum SKU in Microsoft Fabric that permits users with free Power BI licenses to consume reports and dashboards without buying individual Pro licenses. For organizations with over 80-100 consumers, upgrading to F64 often pays for itself by eliminating Pro license fees."
      },
      {
        title: "Microsoft Fabric Copilot Features",
        detail: "Copilot AI capabilities for automated DAX generation, Data Factory pipeline creation, and Spark notebook assistance are exclusively unlocked at F64 and above."
      },
      {
        title: "Raw Compute Throughput",
        detail: "F64 offers 64 Capacity Units, doubling the background and interactive processing throughput compared to F32. This enables smoother Direct Lake report rendering and faster Spark batch execution."
      }
    ],
    recommendation: "Choose F32 if you are running developer/test environments or small production workloads where all consumers already hold Power BI Pro licenses. Upgrade to F64 if you need to serve reports to free Power BI users or leverage Copilot AI assistance.",
    faqs: [
      {
        question: "Is F64 more cost-effective than buying 100 Power BI Pro licenses?",
        answer: "Yes! 100 Power BI Pro licenses cost around $1,000/month. If your capacity needs are growing, the $4,961/mo Reserved rate for F64 provides both compute power AND eliminates Pro license requirements for thousands of internal report viewers."
      },
      {
        question: "Can I upgrade seamlessly from F32 to F64?",
        answer: "Yes, Microsoft Fabric capacity resizing takes less than a minute in the Azure Portal without data loss or downtime."
      }
    ]
  },
  {
    slug: "f64-vs-f128",
    title: "F64 vs F128 Capacity Comparison",
    subtitle: "Enterprise Tier Scaling: P1 vs. P2 Capacity Sizing",
    description: "A detailed architectural breakdown of Microsoft Fabric F64 vs F128 SKUs for high-throughput enterprise data platforms.",
    leftName: "F64 (64 CU)",
    rightName: "F128 (128 CU)",
    specs: [
      { feature: "Capacity Units (CU)", leftValue: "64 CUs", rightValue: "128 CUs", winner: "right" },
      { feature: "Pay-As-You-Go Monthly Cost", leftValue: "$8,409.60 / mo", rightValue: "$16,819.20 / mo", winner: "left" },
      { feature: "Reserved Instance Monthly Cost", leftValue: "$4,961.66 / mo", rightValue: "$9,923.33 / mo", winner: "left" },
      { feature: "Power BI Free Viewer Access", leftValue: "Yes", rightValue: "Yes", winner: "neutral" },
      { feature: "Copilot AI Enabled", leftValue: "Yes", rightValue: "Yes", winner: "neutral" },
      { feature: "Max Burst Capacity", leftValue: "512 CUs", rightValue: "1,024 CUs", winner: "right" },
      { feature: "Power BI Premium Equivalence", leftValue: "P1", rightValue: "P2", winner: "right" }
    ],
    keyDifferences: [
      {
        title: "Concurrency & Throttle Prevention",
        detail: "F128 provides double the burst capacity (1024 CU), preventing throttling during morning peak hours when hundreds of report queries execute simultaneously alongside heavy Spark ETL schedules."
      },
      {
        title: "Spark Batch Parallelism",
        detail: "With 128 CUs, data engineering teams can run multiple large Spark nodes in parallel without queueing delays."
      }
    ],
    recommendation: "Start with F64 as your standard enterprise capacity. If monitoring metrics in the Fabric Capacity Metrics App show persistent background smoothing utilization above 80%, upgrade to F128.",
    faqs: [
      {
        question: "Do both F64 and F128 include Copilot?",
        answer: "Yes, both F64 and F128 natively include Microsoft Fabric Copilot."
      }
    ]
  },
  {
    slug: "power-bi-premium-vs-fabric",
    title: "Power BI Premium vs Microsoft Fabric Capacity",
    subtitle: "Understanding the Shift from P-SKUs to F-SKUs",
    description: "Complete migration guide and pricing comparison between legacy Power BI Premium (P1, P2, P3) and unified Microsoft Fabric (F-SKUs).",
    leftName: "Power BI Premium (P-SKU)",
    rightName: "Microsoft Fabric (F-SKU)",
    specs: [
      { feature: "Pricing Flexibility", leftValue: "Annual commitment only", rightValue: "Pay-As-You-Go per second or Reserved", winner: "right" },
      { feature: "Workload Support", leftValue: "Power BI & Datamarts", rightValue: "Power BI, Spark, Lakehouse, Warehouse, Data Factory, Real-Time Analytics", winner: "right" },
      { feature: "Pause / Resume Capability", leftValue: "No", rightValue: "Yes (PAYG capacities can be paused)", winner: "right" },
      { feature: "Storage Architecture", leftValue: "Proprietary Dataset Storage", rightValue: "Open OneLake Delta Parquet", winner: "right" },
      { feature: "P1 Equivalent Tier", leftValue: "P1 ($4,995 / mo)", rightValue: "F64 ($4,961 / mo Reserved)", winner: "right" }
    ],
    keyDifferences: [
      {
        title: "Unified Compute Pool",
        detail: "Unlike Power BI Premium which was primarily locked to BI reporting, Fabric capacities allow your compute pool to be dynamically shared between Data Factory, Spark ETL, Data Warehousing, and Power BI."
      },
      {
        title: "Flexibility & Pausing",
        detail: "Fabric Pay-As-You-Go capacities can be paused during non-business hours or weekends, reducing overall cloud spend compared to fixed Power BI Premium commitments."
      }
    ],
    recommendation: "Migrate legacy Power BI Premium P1 capacities to Fabric F64 Reserved Instances to unlock open Delta storage, unified data engineering, and flexible cloud management.",
    faqs: [
      {
        question: "When is Power BI Premium being retired?",
        answer: "Microsoft announced the deprecation of Power BI Premium P-SKUs in favor of Fabric F-SKUs. Existing P-SKU contracts remain valid through their renewal terms, after which migration to F-SKUs is required."
      }
    ]
  },
  {
    slug: "synapse-vs-fabric",
    title: "Azure Synapse Analytics vs Microsoft Fabric",
    subtitle: "PaaS Data Warehousing vs. SaaS Unified Data Platform",
    description: "Compare Azure Synapse Analytics with Microsoft Fabric. Discover how Fabric simplifies architecture with SaaS management, OneLake, and Direct Lake mode.",
    leftName: "Azure Synapse Analytics",
    rightName: "Microsoft Fabric",
    specs: [
      { feature: "Service Model", leftValue: "PaaS (Azure Managed)", rightValue: "SaaS (Fully Managed Unified Fabric)", winner: "right" },
      { feature: "Storage Format", leftValue: "Dedicated SQL Tables & ADLS Gen2", rightValue: "OneLake Open Delta Parquet", winner: "right" },
      { feature: "Power BI Access Mode", leftValue: "Import / DirectQuery", rightValue: "Direct Lake Mode (Sub-second speed)", winner: "right" },
      { feature: "Compute Management", leftValue: "Separate SQL Pools & Spark Pools", rightValue: "Unified Capacity Units (CU)", winner: "right" },
      { feature: "Deployment Complexity", leftValue: "High (Azure Resource Management)", rightValue: "Low (One-click workspace allocation)", winner: "right" }
    ],
    keyDifferences: [
      {
        title: "Direct Lake Technology",
        detail: "Fabric replaces slow DirectQuery and memory-limited Import Mode with Direct Lake mode, executing DAX queries directly on OneLake Delta Parquet files without duplicating data."
      },
      {
        title: "SaaS Simplicity",
        detail: "Fabric eliminates complex Azure portal provisioning, resource providers, and key vaults. Workspace governance is managed natively within a unified SaaS portal."
      }
    ],
    recommendation: "Organizations building new analytics platforms or modernizing Azure Synapse should build natively on Microsoft Fabric to eliminate data duplication and simplify data architecture.",
    faqs: [
      {
        question: "Can I migrate Synapse SQL scripts to Fabric Data Warehouse?",
        answer: "Yes! Fabric Data Warehouse uses the T-SQL dialect, making migration from Synapse dedicated pools seamless."
      }
    ]
  },
  {
    slug: "warehouse-vs-lakehouse",
    title: "Fabric Warehouse vs Fabric Lakehouse",
    subtitle: "T-SQL Analytics vs. Spark & Delta Lake Architecture",
    description: "Compare Microsoft Fabric Warehouse and Lakehouse items to select the right engine for your data engineering and reporting teams.",
    leftName: "Fabric Data Warehouse",
    rightName: "Fabric Lakehouse",
    specs: [
      { feature: "Primary Persona", leftValue: "SQL Developers & Data Warehouse Engineers", rightValue: "Data Engineers & Data Scientists", winner: "neutral" },
      { feature: "Primary Language", leftValue: "T-SQL", rightValue: "PySpark, Scala, Spark SQL, Python", winner: "neutral" },
      { feature: "ACID Transactions", leftValue: "Full T-SQL ACID Transactions", rightValue: "Delta Lake ACID Transactions", winner: "neutral" },
      { feature: "Storage Format", leftValue: "OneLake Delta Parquet (T-SQL managed)", rightValue: "OneLake Delta Parquet (Tables & Files)", winner: "neutral" },
      { feature: "Unstructured Data Support", leftValue: "No (Structured Tabular Data)", rightValue: "Yes (Files, Images, PDFs, Delta)", winner: "right" }
    ],
    keyDifferences: [
      {
        title: "Developer Paradigm",
        detail: "Fabric Warehouse provides a standard T-SQL engine ideal for enterprise data warehouse developers. Lakehouse provides a unified Apache Spark environment with support for unstructured files and notebooks."
      },
      {
        title: "Cross-Querying via OneLake",
        detail: "Because both Warehouse and Lakehouse store tables in open Delta Parquet format in OneLake, T-SQL queries can seamlessly join data across Warehouses and Lakehouses within the same workspace."
      }
    ],
    recommendation: "Use Lakehouse for data ingestion, unstructured files, and PySpark transformations. Use Warehouse for enterprise dimensional modeling and T-SQL analytics. Combine both in a Medallion Architecture.",
    faqs: [
      {
        question: "Do Warehouse and Lakehouse share the same Fabric Capacity?",
        answer: "Yes! Both compute engines draw from your single unified Fabric Capacity Unit (CU) pool."
      }
    ]
  }
];
