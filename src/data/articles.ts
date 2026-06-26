export interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
}

export const ARTICLES: Article[] = [
  {
    id: "getting-started-fabric-master",
    title: "Getting Started with Fabric Master",
    description: "Learn the basics of Fabric Master, your ultimate tool for Microsoft Fabric capacity planning.",
    category: "Get started",
    content: "## Welcome to Fabric Master\n\nFabric Master is an advanced toolkit designed to help data professionals estimate, optimize, and manage their Microsoft Fabric capacity. Microsoft Fabric brings together Data Engineering, Data Factory, Data Science, Data Warehouse, Real-Time Analytics, and Power BI onto a single unified platform.\n\n### Why Fabric Master?\n\nChoosing the right Fabric SKU (F2 to F2048) can be challenging. Over-provisioning leads to wasted budget, while under-provisioning causes throttling and performance degradation. Fabric Master uses intelligent workload analysis to recommend the perfect capacity tier for your specific needs.\n\n### First Steps\n\n1. **Assess your Data Factory needs:** Estimate pipeline executions and data movement.\n2. **Analyze Spark compute:** Determine the vCore requirements for your Data Engineering and Data Science jobs.\n3. **Evaluate Power BI usage:** Factor in concurrent users and query complexity.\n\nNavigate to our Capacity Calculator to begin your optimization journey."
  },
  {
    id: "understanding-fabric-capacities",
    title: "Understanding Microsoft Fabric Capacities (SKUs)",
    description: "A deep dive into Fabric SKUs, Capacity Units (CUs), and how they relate to computing power.",
    category: "Get started",
    content: "## The Anatomy of a Fabric SKU\n\nMicrosoft Fabric is licensed through Capacities, which are pools of resources that power all Fabric experiences. These are measured in Capacity Units (CUs).\n\n### The F-SKU Lineup\n\n- **F2 (2 CUs):** Entry-level, ideal for small PoCs.\n- **F64 (64 CUs):** The sweet spot for many enterprises, unlocking Power BI Free user consumption and Copilot features.\n- **F2048 (2048 CUs):** For massive, enterprise-scale data workloads.\n\n### Pay-As-You-Go vs. Reserved Instances\n\nFabric offers flexible billing. Pay-As-You-Go allows you to pause and resume capacity to save costs. Reserved Instances (1-year commitment) provide significant discounts (roughly 41% off) but require continuous uptime.\n\nUse Fabric Master's Pricing Matrices to compare these costs in real-time."
  },
  {
    id: "optimizing-spark-workloads",
    title: "Optimizing Spark Workloads in Fabric",
    description: "Best practices for configuring Spark compute to minimize CU consumption and avoid throttling.",
    category: "Data Engineering",
    content: "## Spark on Microsoft Fabric\n\nApache Spark is the engine behind Data Engineering and Data Science in Fabric. While powerful, it can consume CUs rapidly if not configured correctly.\n\n### Node Sizes and Pools\n\nFabric offers various node sizes (Small, Medium, Large). Choosing the right node size depends on your data volume and transformation complexity.\n\n- **Small Nodes (4 vCores):** Good for lightweight ETL.\n- **Large Nodes (16+ vCores):** Necessary for heavy machine learning or massive data shuffling.\n\n### Auto-Scaling and Dynamic Allocation\n\nEnable auto-scaling to allow your Spark clusters to grow during peak loads and shrink when idle. Fabric handles this seamlessly, but you must define the minimum and maximum node boundaries to control costs. Fabric Master calculates the aggregate CU impact of your Spark configurations."
  },
  {
    id: "power-bi-concurrency-limits",
    title: "Navigating Power BI Concurrency and Complexity",
    description: "How to estimate the impact of concurrent Power BI users on your Fabric capacity.",
    category: "Power BI",
    content: "## The Interactive Workload Challenge\n\nUnlike background jobs (like Data Factory pipelines), Power BI report rendering and DAX queries are considered *interactive workloads*. These are smoothed over a much shorter window (typically 5 minutes).\n\n### The Impact of Concurrency\n\nWhen 100 users open a complex dashboard simultaneously (e.g., Monday morning at 9 AM), it creates a burst of compute demand. If this burst exceeds your capacity's interactive limits, Microsoft Fabric will begin throttling requests, leading to slow load times or errors.\n\n### Mitigation Strategies\n\n1. **Optimize DAX:** Slow queries consume more CUs.\n2. **Use Import Mode:** DirectQuery against large datasets is expensive.\n3. **Enable Query Caching:** Reduce the load for frequently accessed reports.\n\nFabric Master's calculator specifically analyzes your peak concurrency to calculate a 'Throttling Risk' score."
  },
  {
    id: "fabric-throttling-mechanisms",
    title: "Demystifying Fabric Throttling Mechanisms",
    description: "Understand how smoothing, bursting, and throttling work to protect Fabric capacities.",
    category: "Architecture",
    content: "## Smoothing and Bursting\n\nMicrosoft Fabric doesn't immediately throttle you the second you exceed your CU limit. Instead, it uses a concept called *smoothing*.\n\n- **Interactive Workloads (Power BI):** Smoothed over a few minutes.\n- **Background Workloads (Spark, Pipelines):** Smoothed over 24 hours.\n\n### The Smoothing Algorithm\n\nIf your F64 capacity (which provides 64 CUs every second) runs a job that requires 128 CUs for 10 seconds, Fabric allows it (this is *bursting*). However, it will account for those 'borrowed' CUs over the smoothing window. If you consistently borrow more than you have, you enter a state of *debt*.\n\n### Throttling Stages\n\n1. **Interactive Delay:** Power BI reports take longer to load.\n2. **Interactive Rejection:** New Power BI sessions are refused.\n3. **Background Rejection:** New Spark jobs or pipelines fail to start.\n\nMonitor your capacity metrics app to stay out of debt."
  },
  {
    id: "data-factory-pipeline-costs",
    title: "Estimating Data Factory Pipeline Costs",
    description: "How to accurately forecast the CU usage of data movement and orchestration.",
    category: "Data Integration",
    content: "## Data Movement vs. Orchestration\n\nData Factory in Fabric handles both moving data (Copy activities) and orchestrating logic (For Each, If Condition, etc.).\n\n### Copy Activity CU Consumption\n\nMoving data consumes CUs based on the volume of data, the source/destination systems, and the complexity of any on-the-fly transformations. High-throughput data ingestion requires significant capacity.\n\n### Orchestration Overhead\n\nWhile orchestration activities consume fewer CUs than data movement, running thousands of tiny pipelines every minute will quickly drain your capacity due to overhead. Batch your processes where possible.\n\nFabric Master takes your daily execution frequency and data volume to provide a baseline CU estimate for Data Factory operations."
  },
  {
    id: "fabric-master-api",
    title: "Integrating with the Fabric Master API",
    description: "Automate your capacity planning by integrating with our REST API.",
    category: "Developers",
    content: "## Programmatic Capacity Planning\n\n*(Coming Soon)*\n\nThe Fabric Master API allows you to programmatically submit workload metrics and receive SKU recommendations, pricing estimates, and risk scores.\n\n### Use Cases\n\n- **CI/CD Integration:** Automatically evaluate the capacity impact of a new data pipeline before deploying it to production.\n- **FinOps Dashboards:** Feed real-time capacity estimates into your internal cloud cost management tools.\n- **Dynamic Scaling:** Use our risk scores to automatically trigger Fabric capacity scale-up/scale-down via Azure ARM templates.\n\nStay tuned for the full API documentation and Swagger definitions."
  },
  {
    id: "security-and-governance",
    title: "Security and Governance in Microsoft Fabric",
    description: "Best practices for securing your workspaces, capacities, and data in Fabric.",
    category: "Enterprise",
    content: "## Securing the Unified Platform\n\nMicrosoft Fabric simplifies security by allowing you to manage permissions at the workspace, item, and data level.\n\n### Workspace Roles\n\n- **Admin:** Full control over the workspace and its settings.\n- **Member:** Can read, create, and modify items.\n- **Contributor:** Can read and modify items, but cannot manage permissions.\n- **Viewer:** Read-only access (requires F64+ for free users).\n\n### Network Security\n\nFor enterprise workloads, consider implementing Managed Private Endpoints and configuring network isolation to ensure your data never traverses the public internet. While Fabric Master focuses on capacity, ensuring your architecture is secure is paramount."
  },
  {
    id: "cost-efficiency-strategies",
    title: "Top 5 Strategies for Fabric Cost Efficiency",
    description: "Actionable tips to lower your monthly Fabric bill without sacrificing performance.",
    category: "FinOps",
    content: "## Maximizing Your Investment\n\n1. **Pause During Off-Hours:** If you use Pay-As-You-Go, use Azure REST APIs or Runbooks to pause your capacity during nights and weekends.\n2. **Optimize Inefficient Queries:** A poorly written DAX measure can consume 10x more CUs than an optimized one.\n3. **Leverage Smoothing:** Schedule heavy background jobs (like large ML model training) during low-usage periods. Since they smooth over 24 hours, they won't impact interactive users.\n4. **Right-Size Your SKU:** Use Fabric Master to ensure you aren't paying for an F128 when an F64 would suffice.\n5. **Evaluate Reserved Instances:** If your baseline load requires an F32 24/7, purchasing a 1-year Reserved Instance will save you ~41% on that baseline compute."
  },
  {
    id: "migrating-to-fabric",
    title: "Migrating from Synapse to Microsoft Fabric",
    description: "A high-level guide on transitioning your legacy data estate into the Fabric ecosystem.",
    category: "Migrations",
    content: "## The Evolution of Analytics\n\nMicrosoft Fabric is the next evolution of Azure Synapse Analytics. Migrating requires understanding the paradigm shift to OneLake.\n\n### Dedicated SQL Pools vs. Fabric Warehouse\n\nFabric Warehouses separate compute and storage natively. You no longer need to scale DWUs. Compute scales automatically based on your Fabric Capacity.\n\n### Synapse Spark vs. Fabric Spark\n\nFabric Spark starts up significantly faster (often in seconds via 'Starter Pools') compared to legacy Synapse Spark. This reduces the wait time and the associated idle CU burn.\n\nFabric Master can help you map your existing Synapse compute costs to the equivalent Fabric SKU."
  }
];
