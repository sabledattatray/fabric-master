/**
 * Architecture Studio Engine (Fabric Master v4.0 - Phase 6)
 * Interactive visual architecture canvas, reference templates, and validation engine.
 */

export type ComponentCategory =
  | "source"
  | "ingestion"
  | "storage"
  | "processing"
  | "analytics"
  | "governance";

export interface ArchitectureNode {
  id: string;
  label: string;
  category: ComponentCategory;
  serviceName: string;
  description: string;
  x?: number;
  y?: number;
  tier: number; // 1: Source, 2: Ingestion, 3: Storage, 4: Processing, 5: Analytics, 6: Governance
}

export interface ArchitectureConnection {
  from: string;
  to: string;
  label?: string;
  protocol?: string;
}

export interface ArchitectureDiagram {
  id: string;
  name: string;
  description: string;
  templateId?: string;
  updatedAt: string;
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  prerequisites: string[];
  governanceNotes: string;
}

export interface ValidationIssue {
  id: string;
  severity: "error" | "warning" | "info";
  message: string;
  nodeId?: string;
  remediation: string;
}

export interface ArchitectureValidationResult {
  valid: boolean;
  score: number; // 0 to 100
  issues: ValidationIssue[];
  flowContinuity: "complete" | "broken" | "isolated";
  recommendation: string;
}

// 8 Official Microsoft Fabric Reference Templates (PRD Section 19)
export const REFERENCE_ARCHITECTURE_TEMPLATES: Record<string, ArchitectureDiagram> = {
  "medallion-lakehouse": {
    id: "medallion-lakehouse",
    name: "Medallion Lakehouse Architecture (Bronze / Silver / Gold)",
    description: "Multi-layer data architecture utilizing OneLake Delta Parquet tables for raw landing, cleansed conformance, and aggregated business data marts.",
    updatedAt: "2026-10-26T10:00:00.000Z",
    templateId: "medallion-lakehouse",
    prerequisites: [
      "Microsoft Fabric Capacity (F2 or higher; F64+ recommended for free report distribution)",
      "OneLake workspace with hierarchical permissions",
      "Source system service principal credentials"
    ],
    governanceNotes: "Apply Microsoft Purview labels at the OneLake workspace root and configure row-level security on Gold semantic models.",
    nodes: [
      { id: "src-sql", label: "Enterprise RDBMS & APIs", category: "source", serviceName: "SQL Server / PostgreSQL / REST", description: "Operational transactional databases and cloud telemetry endpoints", tier: 1 },
      { id: "ing-df", label: "Fabric Data Factory", category: "ingestion", serviceName: "Copy Pipelines & Dataflows Gen2", description: "Scheduled data orchestration and micro-batch incremental ingestion", tier: 2 },
      { id: "sto-bronze", label: "Bronze Lakehouse (Raw)", category: "storage", serviceName: "OneLake Delta Parquet", description: "Immutable raw append-only data history", tier: 3 },
      { id: "prc-spark", label: "Apache Spark ETL", category: "processing", serviceName: "Fabric Notebooks & Spark Jobs", description: "Data deduplication, schema enforcement, and transformation", tier: 4 },
      { id: "sto-silver", label: "Silver Lakehouse (Clean)", category: "storage", serviceName: "OneLake Conformed Delta", description: "Cleansed, validated, and normalized dimensional tables", tier: 3 },
      { id: "sto-gold", label: "Gold Lakehouse (Marts)", category: "storage", serviceName: "OneLake Curated Business Marts", description: "Aggregated star-schema business domain datasets", tier: 3 },
      { id: "ana-dl", label: "Direct Lake Semantic Model", category: "analytics", serviceName: "Power BI Direct Lake", description: "Sub-second memory-mapped analytical model querying Delta files directly", tier: 5 },
      { id: "ana-pbi", label: "Power BI Executive Reports", category: "analytics", serviceName: "Power BI Service", description: "Interactive organizational dashboards and paginated reports", tier: 5 },
      { id: "gov-purview", label: "Microsoft Purview Lineage", category: "governance", serviceName: "Purview Data Governance", description: "Automated cross-workspace data lineage and sensitivity labels", tier: 6 }
    ],
    connections: [
      { from: "src-sql", to: "ing-df", label: "CDC / Incremental Extraction" },
      { from: "ing-df", to: "sto-bronze", label: "Raw Ingestion" },
      { from: "sto-bronze", to: "prc-spark", label: "Read Raw" },
      { from: "prc-spark", to: "sto-silver", label: "Cleanse & Conform" },
      { from: "sto-silver", to: "sto-gold", label: "Aggregate to Marts" },
      { from: "sto-gold", to: "ana-dl", label: "Direct Lake Pointer" },
      { from: "ana-dl", to: "ana-pbi", label: "Interactive DAX Queries" },
      { from: "sto-gold", to: "gov-purview", label: "Metadata Cataloging" }
    ]
  },
  "sql-mirroring": {
    id: "sql-mirroring",
    name: "SQL Database Mirroring to Fabric Analytics",
    description: "Near real-time sub-minute database replication into OneLake Delta tables without ETL pipeline maintenance.",
    updatedAt: "2026-10-26T10:00:00.000Z",
    templateId: "sql-mirroring",
    prerequisites: [
      "Azure SQL Database, Snowflake, or Cosmos DB source",
      "Fabric capacity with mirroring entitlement (F2+)",
      "CDC enabled on source database"
    ],
    governanceNotes: "Network isolation via Managed Private Endpoints recommended for source replication traffic.",
    nodes: [
      { id: "src-azsql", label: "Azure SQL Database", category: "source", serviceName: "Azure SQL OLTP", description: "High-volume operational transactional database", tier: 1 },
      { id: "ing-mirror", label: "Fabric Database Mirroring", category: "ingestion", serviceName: "Fabric Native Mirroring", description: "Continuous log-based CDC replication directly to OneLake", tier: 2 },
      { id: "sto-mirrored", label: "Mirrored Delta Parquet", category: "storage", serviceName: "OneLake Managed Storage", description: "Automatically maintained, vacuumed Delta Parquet replica", tier: 3 },
      { id: "ana-sql-ep", label: "SQL Analytics Endpoint", category: "processing", serviceName: "T-SQL Serverless Engine", description: "Cross-database queries and view definitions via standard T-SQL", tier: 4 },
      { id: "ana-dl-pbi", label: "Direct Lake Power BI", category: "analytics", serviceName: "Power BI Service", description: "Direct Lake reports updated automatically as source transactions commit", tier: 5 }
    ],
    connections: [
      { from: "src-azsql", to: "ing-mirror", label: "Log-based CDC Replication" },
      { from: "ing-mirror", to: "sto-mirrored", label: "Auto Delta Conversion" },
      { from: "sto-mirrored", to: "ana-sql-ep", label: "T-SQL Direct Query" },
      { from: "ana-sql-ep", to: "ana-dl-pbi", label: "Direct Lake Semantic Cache" }
    ]
  },
  "realtime-kql": {
    id: "realtime-kql",
    name: "Real-Time Eventstream & KQL Analytics",
    description: "High-throughput streaming ingestion for IoT telemetry, system logs, and clickstreams with sub-second analytical querying.",
    updatedAt: "2026-10-26T10:00:00.000Z",
    templateId: "realtime-kql",
    prerequisites: [
      "Event hub or streaming source endpoint (Kafka, Event Hubs, Custom App)",
      "Fabric Eventstream workspace resource",
      "KQL Database container"
    ],
    governanceNotes: "Retention policies and hot cache windows must be tuned to control OneLake storage footprint.",
    nodes: [
      { id: "src-iot", label: "IoT Hub & Kafka Streams", category: "source", serviceName: "Telemetry Streams", description: "High-frequency operational event telemetry", tier: 1 },
      { id: "ing-es", label: "Fabric Eventstreams", category: "ingestion", serviceName: "Real-Time Eventstream", description: "No-code stream filtering, transformation, and multi-route fan-out", tier: 2 },
      { id: "sto-kql", label: "KQL Database", category: "storage", serviceName: "Real-Time Analytics Engine", description: "Indexed columnar database optimized for millisecond time-series queries", tier: 3 },
      { id: "sto-lake", label: "OneLake Raw Archive", category: "storage", serviceName: "OneLake Delta Storage", description: "Long-term cold storage archive for machine learning feature training", tier: 3 },
      { id: "ana-rt-dash", label: "Real-Time Dashboard & Alerting", category: "analytics", serviceName: "Data Activator / Power BI", description: "Continuous monitoring dashboards with automated anomaly triggers", tier: 5 }
    ],
    connections: [
      { from: "src-iot", to: "ing-es", label: "AMQP / Kafka Protocol" },
      { from: "ing-es", to: "sto-kql", label: "Low-Latency Stream Ingestion" },
      { from: "ing-es", to: "sto-lake", label: "Historical Cold Parquet Archive" },
      { from: "sto-kql", to: "ana-rt-dash", label: "Sub-Second KQL Queries" }
    ]
  },
  "warehouse-enterprise": {
    id: "warehouse-enterprise",
    name: "Enterprise Data Warehouse with T-SQL",
    description: "Traditional Kimball dimensional warehouse implemented natively on Fabric's distributed serverless SQL query engine.",
    updatedAt: "2026-10-26T10:00:00.000Z",
    templateId: "warehouse-enterprise",
    prerequisites: [
      "Data Factory pipeline orchestration",
      "Fabric Data Warehouse asset",
      "Database schema and stored procedures"
    ],
    governanceNotes: "Enforce object-level permissions, column-level security, and dynamic data masking via T-SQL.",
    nodes: [
      { id: "src-erp", label: "Enterprise ERP & CRM", category: "source", serviceName: "SAP / Dynamics / Salesforce", description: "Core enterprise business system records", tier: 1 },
      { id: "ing-df-pipe", label: "Data Factory Pipelines", category: "ingestion", serviceName: "Fabric Copy Pipelines", description: "Extract, load, and staging orchestration", tier: 2 },
      { id: "sto-wh", label: "Fabric Synapse Data Warehouse", category: "storage", serviceName: "OneLake ACID Warehouse", description: "Fully ACID-compliant relational data warehouse on open Delta Parquet", tier: 3 },
      { id: "prc-tsql", label: "T-SQL Stored Procedures", category: "processing", serviceName: "Serverless SQL Engine", description: "Business logic transformations and dimensional table updates", tier: 4 },
      { id: "ana-pbi-wh", label: "Power BI Enterprise Reporting", category: "analytics", serviceName: "Direct Lake & Import Mode", description: "Corporate financial statements and regulatory compliance reports", tier: 5 }
    ],
    connections: [
      { from: "src-erp", to: "ing-df-pipe", label: "Scheduled Batch Ingestion" },
      { from: "ing-df-pipe", to: "sto-wh", label: "Direct Ingest to Staging Tables" },
      { from: "sto-wh", to: "prc-tsql", label: "Execute Transformation Procedures" },
      { from: "prc-tsql", to: "sto-wh", label: "Write Star Schema Marts" },
      { from: "sto-wh", to: "ana-pbi-wh", label: "Direct Lake Analytical Delivery" }
    ]
  },
  "lakehouse-powerbi": {
    id: "lakehouse-powerbi",
    name: "Lakehouse and Power BI Analytics",
    description: "Modern data platform pairing OneLake Delta tables with Direct Lake Power BI semantic models for sub-second visual query execution.",
    updatedAt: "2026-10-26T10:00:00.000Z",
    templateId: "lakehouse-powerbi",
    prerequisites: [
      "Microsoft Fabric Capacity (F64+ recommended for free report distribution)",
      "Delta table optimization and V-Order enabled",
      "Power BI workspace associated with Fabric capacity"
    ],
    governanceNotes: "Enable OneLake data access roles and enforce dataset endorsement (Promoted / Certified).",
    nodes: [
      { id: "src-files", label: "Cloud Files & SaaS Streams", category: "source", serviceName: "Azure Blob / S3 / REST", description: "Multi-cloud semi-structured file dumps and APIs", tier: 1 },
      { id: "ing-df2", label: "Dataflows Gen2", category: "ingestion", serviceName: "Power Query Online", description: "Visual low-code data profiling, cleansing, and type coercion", tier: 2 },
      { id: "sto-lh", label: "OneLake Lakehouse", category: "storage", serviceName: "OneLake Managed Delta", description: "Open parquet tables stored in unified enterprise storage", tier: 3 },
      { id: "prc-sql-ep", label: "SQL Analytics Endpoint", category: "processing", serviceName: "Serverless SQL", description: "Automated read-only T-SQL endpoint over Lakehouse delta tables", tier: 4 },
      { id: "ana-pbi", label: "Power BI Direct Lake Model", category: "analytics", serviceName: "Direct Lake Semantic Engine", description: "Zero-latency in-memory cache directly loading Delta parquet files", tier: 5 },
      { id: "gov-purview", label: "Purview Data Governance", category: "governance", serviceName: "Microsoft Purview", description: "Data cataloging and sensitive label classification", tier: 6 }
    ],
    connections: [
      { from: "src-files", to: "ing-df2", label: "Connect & Transform" },
      { from: "ing-df2", to: "sto-lh", label: "Load to Lakehouse" },
      { from: "sto-lh", to: "prc-sql-ep", label: "Auto Endpoint Generation" },
      { from: "prc-sql-ep", to: "ana-pbi", label: "Direct Lake Bind" },
      { from: "sto-lh", to: "gov-purview", label: "Lineage Tracking" }
    ]
  },
  "data-factory-etl": {
    id: "data-factory-etl",
    name: "Data Factory ETL/ELT Pipeline Orchestration",
    description: "Enterprise data movement and transformation orchestration featuring parameterized pipelines, conditional execution, and automated failure retries.",
    updatedAt: "2026-10-26T10:00:00.000Z",
    templateId: "data-factory-etl",
    prerequisites: [
      "Fabric Data Factory pipeline workspace",
      "Source credentials securely configured in Azure Key Vault",
      "Alert notification webhook or Teams channel"
    ],
    governanceNotes: "Configure monitoring alerts in Fabric Monitoring Hub and retain pipeline run history for audit compliance.",
    nodes: [
      { id: "src-apis", label: "Partner REST APIs & SFTP", category: "source", serviceName: "External Partners", description: "Third-party vendor data feeds and secure file transfers", tier: 1 },
      { id: "ing-pipe", label: "Copy Activity Pipeline", category: "ingestion", serviceName: "Fabric Data Factory", description: "High-throughput serverless parallel data movement", tier: 2 },
      { id: "sto-raw", label: "Bronze Raw Landing", category: "storage", serviceName: "OneLake Delta Storage", description: "Raw landing zone storing unchanged source payloads", tier: 3 },
      { id: "prc-notebook", label: "Fabric Spark Notebooks", category: "processing", serviceName: "Managed Spark Pool", description: "Complex schema validation and business logic enrichment", tier: 4 },
      { id: "sto-curated", label: "Silver Conformed Lakehouse", category: "storage", serviceName: "OneLake Curated Tables", description: "Deduplicated and conformed dimension and fact tables", tier: 3 },
      { id: "ana-pbi-mon", label: "Operations Telemetry Dashboard", category: "analytics", serviceName: "Power BI Operational App", description: "Pipeline health, latency, and throughput KPI reports", tier: 5 }
    ],
    connections: [
      { from: "src-apis", to: "ing-pipe", label: "Scheduled Pull" },
      { from: "ing-pipe", to: "sto-raw", label: "Append Raw" },
      { from: "sto-raw", to: "prc-notebook", label: "Trigger Transform" },
      { from: "prc-notebook", to: "sto-curated", label: "Write Conformed" },
      { from: "sto-curated", to: "ana-pbi-mon", label: "Deliver Metrics" }
    ]
  },
  "direct-lake-model": {
    id: "direct-lake-model",
    name: "Direct Lake Semantic Model Architecture",
    description: "Sub-second analytical query performance on massive datasets without data duplication or scheduled semantic model refreshes.",
    updatedAt: "2026-10-26T10:00:00.000Z",
    templateId: "direct-lake-model",
    prerequisites: [
      "Fabric capacity (F2 minimum; F64+ recommended)",
      "Delta Parquet tables formatted with V-Order compression",
      "Power BI Premium / Fabric workspace"
    ],
    governanceNotes: "Monitor Direct Lake fallback events to DirectQuery and set memory throttling limits.",
    nodes: [
      { id: "src-oltp", label: "Operational OLTP Systems", category: "source", serviceName: "Transactional Feeds", description: "Continuous transactional application updates", tier: 1 },
      { id: "ing-fabric", label: "High-Speed Ingestion", category: "ingestion", serviceName: "Fabric Pipelines & Mirroring", description: "Rapid micro-batch data loading directly into Delta tables", tier: 2 },
      { id: "sto-onelake", label: "OneLake Gold Delta Mart", category: "storage", serviceName: "OneLake Managed Delta", description: "V-Order compressed Delta Parquet tables", tier: 3 },
      { id: "ana-semantic", label: "Direct Lake Semantic Model", category: "analytics", serviceName: "Power BI Direct Lake Cache", description: "In-memory metadata model mapping directly to Delta files", tier: 5 },
      { id: "ana-reports", label: "Power BI Thin Reports", category: "analytics", serviceName: "Power BI Service", description: "Interactive executive dashboards with instantaneous filter response", tier: 5 },
      { id: "gov-security", label: "OneLake Security & RLS", category: "governance", serviceName: "Fabric Security Hub", description: "Unified Row-Level Security applied across OneLake and Power BI", tier: 6 }
    ],
    connections: [
      { from: "src-oltp", to: "ing-fabric", label: "Continuous Feed" },
      { from: "ing-fabric", to: "sto-onelake", label: "Write Delta V-Order" },
      { from: "sto-onelake", to: "ana-semantic", label: "Memory Map Files" },
      { from: "ana-semantic", to: "ana-reports", label: "DAX Query Stream" },
      { from: "sto-onelake", to: "gov-security", label: "Enforce Security" }
    ]
  },
  "enterprise-reporting": {
    id: "enterprise-reporting",
    name: "Enterprise Reporting & Governed Semantic Distribution",
    description: "Centralized certified semantic modeling architecture supporting self-service reporting, organizational apps, and granular Purview data governance.",
    updatedAt: "2026-10-26T10:00:00.000Z",
    templateId: "enterprise-reporting",
    prerequisites: [
      "Fabric F64 or higher capacity for organizational free viewer distribution",
      "Power BI organizational app workspace setup",
      "Purview enterprise catalog registration"
    ],
    governanceNotes: "Implement certified and promoted semantic model tagging and separate developer vs consumer workspaces.",
    nodes: [
      { id: "src-dw", label: "Corporate Data Feeds", category: "source", serviceName: "Enterprise Warehouses", description: "Consolidated enterprise systems of record", tier: 1 },
      { id: "ing-load", label: "Data Factory Pipelines", category: "ingestion", serviceName: "Fabric Orchestrator", description: "Automated batch data load and validation", tier: 2 },
      { id: "sto-gold-wh", label: "Certified Gold Lakehouse", category: "storage", serviceName: "OneLake Curated", description: "Governed gold dimensional models with guaranteed SLAs", tier: 3 },
      { id: "ana-certified", label: "Certified Core Semantic Model", category: "analytics", serviceName: "Power BI Core Model", description: "Standardized business metrics with single source of truth", tier: 5 },
      { id: "ana-apps", label: "Power BI Organizational App", category: "analytics", serviceName: "Power BI Apps", description: "Curated distribution to hundreds of business decision-makers", tier: 5 },
      { id: "gov-catalog", label: "Purview Data Catalog", category: "governance", serviceName: "Microsoft Purview", description: "Enterprise glossary, sensitivity labels, and lineage auditing", tier: 6 }
    ],
    connections: [
      { from: "src-dw", to: "ing-load", label: "Batch Replication" },
      { from: "ing-load", to: "sto-gold-wh", label: "Load Golden Records" },
      { from: "sto-gold-wh", to: "ana-certified", label: "Bind Certified Models" },
      { from: "ana-certified", to: "ana-apps", label: "Publish Organizational App" },
      { from: "sto-gold-wh", to: "gov-catalog", label: "Metadata & Lineage Registration" }
    ]
  },
  "hybrid-integration": {
    id: "hybrid-integration",
    name: "Hybrid Data Integration Architecture",
    description: "Secure hybrid connectivity bridging on-premises data centers and third-party clouds with Microsoft Fabric via Data Gateways and OneLake Shortcuts.",
    updatedAt: "2026-10-26T10:00:00.000Z",
    templateId: "hybrid-integration",
    prerequisites: [
      "On-premises Data Gateway cluster installed in secure DMZ",
      "ExpressRoute or Site-to-Site VPN to Azure virtual network",
      "Fabric workspace configured with Managed Private Endpoints"
    ],
    governanceNotes: "Enforce network boundary isolation and zero-trust credentials stored in Azure Key Vault.",
    nodes: [
      { id: "src-onprem", label: "On-Premises SQL & File Shares", category: "source", serviceName: "Local Data Center", description: "Internal enterprise databases behind corporate firewall", tier: 1 },
      { id: "ing-gateway", label: "On-Premises Data Gateway", category: "ingestion", serviceName: "Fabric Gateway Cluster", description: "Secure outbound-only TLS proxy into Azure cloud", tier: 2 },
      { id: "sto-hybrid", label: "OneLake Hybrid Lakehouse", category: "storage", serviceName: "OneLake Managed Storage", description: "Centralized Lakehouse storing hybrid synchronized Delta tables", tier: 3 },
      { id: "prc-spark-hybrid", label: "PySpark Data Enrichment", category: "processing", serviceName: "Fabric Spark Compute", description: "Combines on-premises records with cloud-native datasets", tier: 4 },
      { id: "ana-hybrid-pbi", label: "Executive Hybrid Dashboards", category: "analytics", serviceName: "Power BI Service", description: "Unified operational reports spanning cloud and ground data", tier: 5 },
      { id: "gov-net", label: "Managed Private Endpoints", category: "governance", serviceName: "Azure Virtual Network", description: "Private link connectivity with complete internet egress denial", tier: 6 }
    ],
    connections: [
      { from: "src-onprem", to: "ing-gateway", label: "Internal LAN Extraction" },
      { from: "ing-gateway", to: "sto-hybrid", label: "Encrypted Cloud Egress" },
      { from: "sto-hybrid", to: "prc-spark-hybrid", label: "Load Data for Enrichment" },
      { from: "prc-spark-hybrid", to: "sto-hybrid", label: "Persist Curated Datasets" },
      { from: "sto-hybrid", to: "ana-hybrid-pbi", label: "Direct Lake Visualization" },
      { from: "sto-hybrid", to: "gov-net", label: "Network Security Auditing" }
    ]
  }
};

export const AVAILABLE_COMPONENT_CATALOG: Omit<ArchitectureNode, "id">[] = [
  // Sources
  { label: "Azure SQL Database", category: "source", serviceName: "Azure SQL Database", description: "Cloud relational database for transaction workloads", tier: 1 },
  { label: "On-Premises SQL Server", category: "source", serviceName: "SQL Server (On-Prem)", description: "On-premises enterprise database connected via On-Prem Data Gateway", tier: 1 },
  { label: "Snowflake / Databricks", category: "source", serviceName: "External Cloud Warehouse", description: "Third-party cloud data warehouse or Lakehouse data platform", tier: 1 },
  { label: "REST APIs & Webhooks", category: "source", serviceName: "HTTP Endpoints", description: "External JSON/XML SaaS service APIs", tier: 1 },
  { label: "Kafka / IoT Telemetry", category: "source", serviceName: "Streaming Message Bus", description: "Real-time sensor logs and event brokers", tier: 1 },

  // Ingestion
  { label: "Fabric Data Factory", category: "ingestion", serviceName: "Copy Pipeline", description: "High-scale serverless data movement", tier: 2 },
  { label: "Dataflows Gen2", category: "ingestion", serviceName: "Power Query Online", description: "Low-code visual data preparation and transformation", tier: 2 },
  { label: "Fabric Eventstreams", category: "ingestion", serviceName: "Eventstream Routing", description: "Real-time streaming ingestion and filtering", tier: 2 },
  { label: "Database Mirroring", category: "ingestion", serviceName: "Native CDC Mirroring", description: "Zero-ETL continuous replication to OneLake", tier: 2 },

  // Storage
  { label: "OneLake Lakehouse", category: "storage", serviceName: "Lakehouse (Delta Parquet)", description: "Unmanaged and managed open Delta tables in OneLake", tier: 3 },
  { label: "Fabric Data Warehouse", category: "storage", serviceName: "Data Warehouse", description: "Relational ACID warehouse with full T-SQL support", tier: 3 },
  { label: "KQL Database", category: "storage", serviceName: "Real-Time KQL Store", description: "Fast time-series analytics and log engine", tier: 3 },

  // Processing
  { label: "Apache Spark Pool", category: "processing", serviceName: "Fabric Spark Compute", description: "Distributed PySpark, Scala, and Spark SQL processing", tier: 4 },
  { label: "T-SQL Query Engine", category: "processing", serviceName: "Serverless SQL Query", description: "Cross-database T-SQL transformation procedures", tier: 4 },

  // Analytics
  { label: "Direct Lake Semantic Model", category: "analytics", serviceName: "Direct Lake", description: "Blazing fast memory-mapped cache querying Delta directly", tier: 5 },
  { label: "Power BI Report", category: "analytics", serviceName: "Power BI Reporting", description: "Interactive organizational dashboards and paginated reports", tier: 5 },

  // Governance
  { label: "Microsoft Purview", category: "governance", serviceName: "Data Lineage & Catalog", description: "Automated discovery, sensitivity labels, and data lineage", tier: 6 }
];

export function validateArchitecture(
  nodes: ArchitectureNode[],
  connections: ArchitectureConnection[]
): ArchitectureValidationResult {
  const issues: ValidationIssue[] = [];
  let score = 100;

  if (nodes.length === 0) {
    return {
      valid: false,
      score: 0,
      issues: [{ id: "empty", severity: "error", message: "Architecture diagram contains no components.", remediation: "Select a reference template or add components from the library." }],
      flowContinuity: "isolated",
      recommendation: "Load the Medallion Lakehouse template to establish a proven baseline architecture."
    };
  }

  // 1. Check for Disconnected Nodes
  const connectedNodeIds = new Set<string>();
  connections.forEach(c => {
    connectedNodeIds.add(c.from);
    connectedNodeIds.add(c.to);
  });

  nodes.forEach(node => {
    if (!connectedNodeIds.has(node.id) && nodes.length > 1) {
      issues.push({
        id: `disconnected-${node.id}`,
        severity: "warning",
        nodeId: node.id,
        message: `Node "${node.label}" is isolated with zero connections.`,
        remediation: `Connect "${node.label}" to upstream ingestion or downstream analytics.`
      });
      score -= 10;
    }
  });

  // 2. Check for Missing Data Sources
  const hasSource = nodes.some(n => n.category === "source");
  if (!hasSource) {
    issues.push({
      id: "no-source",
      severity: "error",
      message: "Architecture lacks an identified Data Source component.",
      remediation: "Add an operational database, API, or telemetry source component."
    });
    score -= 25;
  }

  // 3. Check for Storage Layer
  const hasStorage = nodes.some(n => n.category === "storage");
  if (!hasStorage) {
    issues.push({
      id: "no-storage",
      severity: "error",
      message: "Architecture lacks a OneLake storage layer (Lakehouse or Data Warehouse).",
      remediation: "Add a Lakehouse or Data Warehouse to persist conformed Delta tables."
    });
    score -= 25;
  }

  // 4. Check for Analytics / Consumption Layer
  const hasAnalytics = nodes.some(n => n.category === "analytics");
  if (!hasAnalytics) {
    issues.push({
      id: "no-analytics",
      severity: "warning",
      message: "Architecture contains no consumption or semantic reporting components.",
      remediation: "Connect storage to a Direct Lake semantic model and Power BI report."
    });
    score -= 15;
  }

  // 5. Check Governance Best Practices
  const hasGovernance = nodes.some(n => n.category === "governance");
  if (!hasGovernance) {
    issues.push({
      id: "no-governance",
      severity: "info",
      message: "No Purview or governance components identified in estate diagram.",
      remediation: "Include Microsoft Purview to ensure compliance, sensitivity labeling, and lineage tracking."
    });
    score -= 5;
  }

  // Determine Flow Continuity
  let flowContinuity: "complete" | "broken" | "isolated" = "complete";
  if (!hasSource || !hasStorage) {
    flowContinuity = "broken";
  } else if (issues.some(i => i.severity === "error")) {
    flowContinuity = "broken";
  }

  score = Math.max(0, Math.min(100, score));

  return {
    valid: issues.every(i => i.severity !== "error"),
    score,
    issues,
    flowContinuity,
    recommendation:
      score >= 90
        ? "Enterprise-ready architecture compliant with Microsoft Fabric well-architected framework."
        : score >= 70
        ? "Sound architecture with minor gaps. Review warnings to ensure end-to-end data lineage."
        : "Critical architectural gaps detected. Connect sources through storage to consumption layers."
  };
}

const STORAGE_KEY = "fabric_master_architecture_diagrams";

export function getSavedDiagrams(): ArchitectureDiagram[] {
  if (typeof window === "undefined") {
    return Object.values(REFERENCE_ARCHITECTURE_TEMPLATES);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = Object.values(REFERENCE_ARCHITECTURE_TEMPLATES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : Object.values(REFERENCE_ARCHITECTURE_TEMPLATES);
  } catch (err) {
    return Object.values(REFERENCE_ARCHITECTURE_TEMPLATES);
  }
}

export function saveDiagramToStorage(diagram: ArchitectureDiagram): void {
  if (typeof window === "undefined") return;
  const list = getSavedDiagrams();
  const index = list.findIndex(d => d.id === diagram.id);
  const updated = { ...diagram, updatedAt: new Date().toISOString() };
  if (index >= 0) {
    list[index] = updated;
  } else {
    list.unshift(updated);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function exportDiagramAsJSON(diagram: ArchitectureDiagram): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(diagram, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${diagram.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-architecture.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportDiagramAsSVG(diagram: ArchitectureDiagram): void {
  const width = 1000;
  const height = 600;

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <style>
    .bg { fill: #080F1D; }
    .card { fill: #11192e; stroke: #21262d; stroke-width: 1.5; rx: 12; }
    .text-title { fill: #F0F6FC; font-family: sans-serif; font-weight: bold; font-size: 14px; }
    .text-sub { fill: #8B949E; font-family: sans-serif; font-size: 11px; }
    .line { stroke: #388bfd; stroke-width: 2; marker-end: url(#arrow); }
  </style>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#388bfd" />
    </marker>
  </defs>
  <rect width="100%" height="100%" class="bg" />
  <text x="30" y="40" fill="#388bfd" font-family="sans-serif" font-weight="bold" font-size="18px">${diagram.name}</text>
  <text x="30" y="65" fill="#8B949E" font-family="sans-serif" font-size="12px">Microsoft Fabric Reference Architecture • Fabric Master v4.0</text>
`;

  // Render Nodes grouped by tier
  const tierWidth = (width - 100) / 6;
  diagram.nodes.forEach((n, idx) => {
    const x = 50 + (n.tier - 1) * tierWidth;
    const y = 120 + (idx % 4) * 110;
    svgContent += `  <g transform="translate(${x}, ${y})">
    <rect width="130" height="85" class="card" />
    <text x="10" y="25" class="text-title">${n.label.slice(0, 15)}</text>
    <text x="10" y="45" class="text-sub">${n.serviceName.slice(0, 18)}</text>
    <text x="10" y="65" fill="#58a6ff" font-family="sans-serif" font-size="9px">Tier 0${n.tier}</text>
  </g>\n`;
  });

  svgContent += `</svg>`;

  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", url);
  downloadAnchor.setAttribute("download", `${diagram.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.svg`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}
