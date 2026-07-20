export interface FabricSkuInfo {
  slug: string;
  name: string;
  cu: number;
  hourlyPrice: number;
  monthlyPayg: number;
  monthlyReserved: number;
  powerBiFreeUsers: boolean;
  copilotSupport: boolean;
  recommendedFor: string[];
  maxBurstCu: number;
  description: string;
  features: string[];
  faqs: { question: string; answer: string }[];
}

export const FABRIC_SKU_DATA: FabricSkuInfo[] = [
  {
    slug: "f2",
    name: "F2",
    cu: 2,
    hourlyPrice: 0.36,
    monthlyPayg: 262.80,
    monthlyReserved: 155.05,
    powerBiFreeUsers: false,
    copilotSupport: false,
    recommendedFor: ["Small Proof of Concept (PoC)", "Development Environments", "Lightweight Data Factory Pipelines"],
    maxBurstCu: 16,
    description: "The entry-level Microsoft Fabric SKU providing 2 Capacity Units. Ideal for small proof-of-concept testing, lightweight pipeline testing, and learning Fabric.",
    features: [
      "2 Dedicated Capacity Units (CU)",
      "Pay-As-You-Go & Reserved Instance eligible",
      "Full access to Data Factory, Synapse Data Engineering & Warehouse",
      "Requires Power BI Pro/PPU for reporting"
    ],
    faqs: [
      {
        question: "Can F2 support Power BI Free users?",
        answer: "No. SKUs smaller than F64 require users to hold Power BI Pro or Power BI Premium Per User (PPU) licenses to view reports."
      },
      {
        question: "Is Copilot available on F2?",
        answer: "No, Microsoft Fabric Copilot features require F64 or higher capacities."
      }
    ]
  },
  {
    slug: "f4",
    name: "F4",
    cu: 4,
    hourlyPrice: 0.72,
    monthlyPayg: 525.60,
    monthlyReserved: 310.10,
    powerBiFreeUsers: false,
    copilotSupport: false,
    recommendedFor: ["Dev/Test Workspaces", "Small Team ETL Pipelines", "Basic Lakehouse Datasets"],
    maxBurstCu: 32,
    description: "F4 delivers 4 Capacity Units, doubling compute power for small engineering teams developing ETL pipelines and modest Lakehouse setups.",
    features: [
      "4 Dedicated Capacity Units (CU)",
      "Supports auto-scaling and burst compute",
      "Ideal for Dev/Test environments",
      "Requires Power BI Pro for view access"
    ],
    faqs: [
      {
        question: "How does F4 compare to F2?",
        answer: "F4 provides double the Capacity Units (4 CU vs 2 CU), enabling faster Spark job executions and smoother concurrent pipeline runs."
      }
    ]
  },
  {
    slug: "f8",
    name: "F8",
    cu: 8,
    hourlyPrice: 1.44,
    monthlyPayg: 1051.20,
    monthlyReserved: 620.21,
    powerBiFreeUsers: false,
    copilotSupport: false,
    recommendedFor: ["Medium Dev Environments", "Departmental Pipelines", "Small Data Science Models"],
    maxBurstCu: 64,
    description: "F8 provides 8 CUs, serving as a solid foundation for departmental workloads and medium-sized Spark notebook transformations.",
    features: [
      "8 Dedicated Capacity Units (CU)",
      "Enhanced Spark auto-scaling capacity",
      "Support for multi-stage Data Factory orchestrations",
      "Cost-effective for growing data teams"
    ],
    faqs: [
      {
        question: "Can I run Spark on F8?",
        answer: "Yes, Apache Spark notebooks run smoothly on F8, though large parallel node allocations should be tuned to avoid throttling."
      }
    ]
  },
  {
    slug: "f16",
    name: "F16",
    cu: 16,
    hourlyPrice: 2.88,
    monthlyPayg: 2102.40,
    monthlyReserved: 1240.42,
    powerBiFreeUsers: false,
    copilotSupport: false,
    recommendedFor: ["Mid-sized Business Production", "Frequent Spark Jobs", "SQL Data Warehouse Workloads"],
    maxBurstCu: 128,
    description: "F16 delivers 16 CUs, suited for mid-sized business production environments requiring reliable throughput across Data Engineering and SQL Warehousing.",
    features: [
      "16 Dedicated Capacity Units (CU)",
      "High-concurrency query processing",
      "Optimized for medallion lakehouse architectures",
      "Smooth 24-hour background job burst management"
    ],
    faqs: [
      {
        question: "Is F16 equivalent to Power BI Premium P1?",
        answer: "No, Power BI Premium P1 is equivalent to F64 (64 CUs). F16 is equivalent to P1/4 in raw compute capacity."
      }
    ]
  },
  {
    slug: "f32",
    name: "F32",
    cu: 32,
    hourlyPrice: 5.76,
    monthlyPayg: 4204.80,
    monthlyReserved: 2480.83,
    powerBiFreeUsers: false,
    copilotSupport: false,
    recommendedFor: ["Production Workloads", "Multi-team Engineering", "Heavy SQL Data Warehouse Queries"],
    maxBurstCu: 256,
    description: "F32 offers 32 CUs of compute power, capable of supporting heavy data processing, concurrent SQL warehousing, and multi-team collaboration.",
    features: [
      "32 Dedicated Capacity Units (CU)",
      "High performance for heavy Direct Lake datasets",
      "Ideal bridge tier before upgrading to enterprise F64",
      "Significant 41% savings with 1-Year Reserved Instances"
    ],
    faqs: [
      {
        question: "Why upgrade from F32 to F64?",
        answer: "F64 unlocks free Power BI content distribution to organization users and adds Microsoft Fabric Copilot capabilities."
      }
    ]
  },
  {
    slug: "f64",
    name: "F64",
    cu: 64,
    hourlyPrice: 11.52,
    monthlyPayg: 8409.60,
    monthlyReserved: 4961.66,
    powerBiFreeUsers: true,
    copilotSupport: true,
    recommendedFor: ["Enterprise Core Production", "Power BI Free User Distribution", "Microsoft Fabric Copilot", "High-concurrency Enterprise Data Lakehouses"],
    maxBurstCu: 512,
    description: "F64 is the flagship enterprise tier in Microsoft Fabric. It unlocks unlimited content sharing with Power BI Free license holders and enables built-in Copilot AI features.",
    features: [
      "64 Dedicated Capacity Units (CU)",
      "Unlocks Power BI Free user consumption across organization",
      "Includes Microsoft Fabric Copilot AI assistant features",
      "Equivalent to Power BI Premium P1 / Fabric Capacity"
    ],
    faqs: [
      {
        question: "Does F64 allow users without Power BI Pro to view reports?",
        answer: "Yes! F64 is the minimum SKU that enables organizational users with free Power BI licenses to consume content hosted in Fabric capacities."
      },
      {
        question: "Is Copilot enabled on F64?",
        answer: "Yes, F64 and higher SKUs natively support Microsoft Fabric Copilot for notebook generation, DAX creation, and report insights."
      }
    ]
  },
  {
    slug: "f128",
    name: "F128",
    cu: 128,
    hourlyPrice: 23.04,
    monthlyPayg: 16819.20,
    monthlyReserved: 9923.33,
    powerBiFreeUsers: true,
    copilotSupport: true,
    recommendedFor: ["Large Enterprise Workloads", "Power BI Premium P2 Migration", "High-volume Spark Streaming"],
    maxBurstCu: 1024,
    description: "F128 doubles the compute capacity of F64 to 128 CUs, providing enterprise-scale power for high-frequency streaming, large Lakehouses, and massive concurrency.",
    features: [
      "128 Dedicated Capacity Units (CU)",
      "Equivalent to Power BI Premium P2",
      "Free Power BI user distribution included",
      "Full Copilot AI suite enabled"
    ],
    faqs: [
      {
        question: "What is the equivalent Power BI Premium tier for F128?",
        answer: "F128 is the direct equivalent of Power BI Premium P2 (128 CUs)."
      }
    ]
  },
  {
    slug: "f256",
    name: "F256",
    cu: 256,
    hourlyPrice: 46.08,
    monthlyPayg: 33638.40,
    monthlyReserved: 19846.66,
    powerBiFreeUsers: true,
    copilotSupport: true,
    recommendedFor: ["Very Large Enterprises", "Multi-National Data Hubs", "P3 Premium Migrations"],
    maxBurstCu: 2048,
    description: "F256 delivers 256 CUs, engineered for global enterprise platforms requiring extensive parallel compute across Spark, OneLake, and SQL Warehouses.",
    features: [
      "256 Dedicated Capacity Units (CU)",
      "Equivalent to Power BI Premium P3",
      "Enterprise security and isolation boundaries",
      "Extremely fast Direct Lake query processing"
    ],
    faqs: [
      {
        question: "How much can I save on F256 with Reserved Capacity?",
        answer: "Switching from Pay-As-You-Go ($33,638/mo) to 1-Year Reserved ($19,846/mo) saves over $13,791 every month ($165,492 annually)."
      }
    ]
  },
  {
    slug: "f512",
    name: "F512",
    cu: 512,
    hourlyPrice: 92.16,
    monthlyPayg: 67276.80,
    monthlyReserved: 39693.31,
    powerBiFreeUsers: true,
    copilotSupport: true,
    recommendedFor: ["Fortune 500 Data Platforms", "Massive Machine Learning Clusters", "P4 Migrations"],
    maxBurstCu: 4096,
    description: "F512 provides 512 CUs for massive enterprise workloads, large scale batch transformations, and multi-tenant data mesh platforms.",
    features: [
      "512 Dedicated Capacity Units (CU)",
      "Equivalent to Power BI Premium P4",
      "Massive memory and parallelism for complex DAX & Spark",
      "Dedicated enterprise support & SLA readiness"
    ],
    faqs: [
      {
        question: "Who uses F512?",
        answer: "Fortune 500 enterprises, central IT data mesh hubs, and global analytics platforms with tens of thousands of active users."
      }
    ]
  },
  {
    slug: "f1024",
    name: "F1024",
    cu: 1024,
    hourlyPrice: 184.32,
    monthlyPayg: 134553.60,
    monthlyReserved: 79386.62,
    powerBiFreeUsers: true,
    copilotSupport: true,
    recommendedFor: ["Hyperscale Enterprise Platforms", "P5 Migrations", "Global Analytics Infrastructure"],
    maxBurstCu: 8192,
    description: "F1024 supplies 1,024 Capacity Units, delivering immense compute capacity for hyperscale analytics, real-time telemetry processing, and global data warehouses.",
    features: [
      "1,024 Dedicated Capacity Units (CU)",
      "Equivalent to Power BI Premium P5",
      "Top-tier concurrency performance",
      "Unrestricted enterprise growth capacity"
    ],
    faqs: [
      {
        question: "Is F1024 available in all Azure regions?",
        answer: "F1024 is available in major Azure regions supporting Microsoft Fabric. Check Azure region availability for specific deployment locations."
      }
    ]
  },
  {
    slug: "f2048",
    name: "F2048",
    cu: 2048,
    hourlyPrice: 368.64,
    monthlyPayg: 269107.20,
    monthlyReserved: 158773.25,
    powerBiFreeUsers: true,
    copilotSupport: true,
    recommendedFor: ["Maximum Tier Enterprise Infrastructure", "Global Telemetry & AI Engines"],
    maxBurstCu: 16384,
    description: "F2048 is the highest single capacity SKU in Microsoft Fabric, providing 2,048 CUs for the largest data platforms on Earth.",
    features: [
      "2,048 Dedicated Capacity Units (CU)",
      "Maximum single-capacity SKU limit in Fabric",
      "Unmatched parallel execution across Spark, Lakehouse, and Direct Lake",
      "Custom Microsoft enterprise account management"
    ],
    faqs: [
      {
        question: "What happens if our needs exceed F2048?",
        answer: "Organizations can provision multiple F2048 capacities and distribute workspaces across them using Fabric Domain management."
      }
    ]
  }
];
