import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Box,
  ChevronRight,
  Database,
  DatabaseZap,
  FileJson,
  GitBranch,
  Info,
  Layers,
  LayoutDashboard,
  List,
  MousePointer2,
  Network,
  RotateCcw,
  ShieldCheck,
  Waves,
} from "lucide-react";
import type {
  ArchitectureNode,
  ArchitectureEdge,
} from "../lib/fabric/architecture/types";
import "../styles/onelake.css";

type LakeNode = ArchitectureNode & {
  layer: "bronze" | "silver" | "gold" | "serving";
  kind: string;
  purpose: string;
  objects: string[];
};

const SAMPLE_NODES: LakeNode[] = [
  {
    id: "bronze",
    label: "Bronze Lakehouse",
    type: "lakehouse",
    layer: "bronze",
    kind: "Lakehouse",
    description:
      "The landing zone for source data. Keep the original shape of ingested records before applying downstream transformations.",
    purpose: "Ingest & preserve",
    objects: ["orders_raw", "customers_raw", "transactions_raw"],
  },
  {
    id: "silver",
    label: "Silver Lakehouse",
    type: "lakehouse",
    layer: "silver",
    kind: "Lakehouse",
    description:
      "A conformed layer for cleaned, standardized data. Prepare consistent datasets for the business models that follow.",
    purpose: "Clean & conform",
    objects: ["orders", "customers", "transactions"],
  },
  {
    id: "gold",
    label: "Gold Warehouse",
    type: "warehouse",
    layer: "gold",
    kind: "Warehouse",
    description:
      "A business-ready analytical layer. Organize curated facts and dimensions around the questions your team needs to answer.",
    purpose: "Curate & model",
    objects: ["fact_sales", "dim_customer", "dim_date"],
  },
  {
    id: "semantic",
    label: "Core Semantic Model",
    type: "semantic-model",
    layer: "serving",
    kind: "Semantic model",
    description:
      "The consumption layer for business intelligence. Present a consistent analytical model for reporting and exploration.",
    purpose: "Analyze & serve",
    objects: ["Sales performance", "Customer analysis", "Revenue measures"],
  },
  {
    id: "realtime",
    label: "Eventhouse",
    type: "kql-database",
    layer: "bronze",
    kind: "Real-time analytics",
    description:
      "A parallel real-time workload for streaming telemetry. This illustrative item is shown separately from the batch medallion flow; no connection is configured in this example.",
    purpose: "Explore event data",
    objects: ["Telemetry events", "Operational signals", "Streaming records"],
  },
];
const SAMPLE_EDGES: ArchitectureEdge[] = [
  { source: "bronze", target: "silver", relationship: "Clean & conform" },
  { source: "silver", target: "gold", relationship: "Curate & model" },
  { source: "gold", target: "semantic", relationship: "Serve analytics" },
];
const STAGES = [
  {
    layer: "bronze",
    number: "01",
    title: "Raw & ingested",
    subtitle: "Bronze layer",
  },
  {
    layer: "silver",
    number: "02",
    title: "Clean & conformed",
    subtitle: "Silver layer",
  },
  {
    layer: "gold",
    number: "03",
    title: "Business ready",
    subtitle: "Gold layer",
  },
  {
    layer: "serving",
    number: "04",
    title: "Analytics & BI",
    subtitle: "Serving layer",
  },
];
const TYPE_ICONS = {
  lakehouse: Database,
  warehouse: DatabaseZap,
  "semantic-model": LayoutDashboard,
  "kql-database": Activity,
};

function NodeIcon({ node, size = 19 }: { node: LakeNode; size?: number }) {
  const Icon = TYPE_ICONS[node.type as keyof typeof TYPE_ICONS] || Box;
  return <Icon size={size} strokeWidth={1.6} />;
}

export function OneLakeVisualizer() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState("silver");
  const [view, setView] = useState<"diagram" | "inventory">("diagram");
  const [showRelationships, setShowRelationships] = useState(true);
  const diagramTab = useRef<HTMLButtonElement>(null);
  const inventoryTab = useRef<HTMLButtonElement>(null);
  const selected = SAMPLE_NODES.find((node) => node.id === selectedId)!;
  const connections = SAMPLE_EDGES.filter(
    (edge) => edge.source === selected.id || edge.target === selected.id,
  );

  const resetView = () => {
    setSelectedId("silver");
    setView("diagram");
    setShowRelationships(true);
  };
  const exportTopology = () => {
    const file = new Blob(
      [
        JSON.stringify(
          {
            name: "OneLake example topology",
            sample: true,
            nodes: SAMPLE_NODES,
            edges: SAMPLE_EDGES,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "onelake-example-topology.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const handleTabKey = (event: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? "diagram"
        : event.key === "End"
          ? "inventory"
          : view === "diagram"
            ? "inventory"
            : "diagram";
    setView(next);
    (next === "diagram" ? diagramTab : inventoryTab).current?.focus();
  };
  const nodeCard = (node: LakeNode) => (
    <button
      key={node.id}
      type="button"
      className={`ol-node ol-tone-${node.layer} ${selected.id === node.id ? "is-selected" : ""}`}
      onClick={() => setSelectedId(node.id)}
      aria-pressed={selected.id === node.id}
      aria-label={`Inspect ${node.label}`}
    >
      <span className="ol-node-top">
        <span className="ol-node-icon">
          <NodeIcon node={node} />
        </span>
        <span className="ol-node-kind">{t(node.kind)}</span>
        <span className="ol-node-port" />
      </span>
      <strong>{t(node.label)}</strong>
      <span className="ol-node-purpose">
        {t(node.purpose)}
        <ChevronRight size={13} />
      </span>
    </button>
  );

  return (
    <div className="onelake-page">
      <Helmet>
        <title>
          {t("OneLake Visualizer")} | {t("Fabric Master")}
        </title>
        <meta
          name="description"
          content={t(
            "Explore an illustrative Microsoft Fabric OneLake topology, medallion layers, and logical data relationships.",
          )}
        />
        <link
          rel="canonical"
          href="https://fabric.dattasable.com/architecture/onelake"
        />
      </Helmet>
      <div className="ol-page-heading">
        <div>
          <div className="eyebrow">
            <Waves size={14} />
            ARCHITECTURE EXPLORER
          </div>
          <h1>
            {t("OneLake Visualizer")}
            <span>One foundation. A connected view.</span>
          </h1>
          <p>
            {t(
              "Follow your data from raw ingestion to business insight. Explore the layers, inspect each item, and see how it all fits together.",
            )}
          </p>
        </div>
        <Link to="/architecture/planner" className="premium-button secondary">
          <Layers size={15} />
          Open architecture planner
          <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="ol-summary-strip">
        <div>
          <span className="ol-summary-icon">
            <Database size={17} />
          </span>
          <span>
            <strong>5</strong>Fabric items
          </span>
        </div>
        <div>
          <span className="ol-summary-icon">
            <Layers size={17} />
          </span>
          <span>
            <strong>4</strong>Logical layers
          </span>
        </div>
        <div>
          <span className="ol-summary-icon">
            <GitBranch size={17} />
          </span>
          <span>
            <strong>3</strong>Relationships
          </span>
        </div>
        <div className="ol-sample-notice">
          <span className="ol-sample-dot" />
          <span>
            Sample architecture<span>Explore freely. No live connection.</span>
          </span>
        </div>
      </div>

      <div className="ol-workbench">
        <section
          className="ol-canvas-panel"
          aria-label="OneLake topology explorer"
        >
          <div className="ol-canvas-heading">
            <div>
              <span className="ol-project-symbol">
                <Waves size={18} />
              </span>
              <div>
                <h2>Analytics estate</h2>
                <p>
                  Medallion architecture <span>/</span> Logical view
                </p>
              </div>
            </div>
            <span className="ol-sample-badge">EXAMPLE</span>
          </div>
          <div className="ol-toolbar">
            <div
              className="ol-view-tabs"
              role="tablist"
              aria-label="Topology view"
              onKeyDown={handleTabKey}
            >
              <button
                ref={diagramTab}
                type="button"
                id="ol-diagram-tab"
                role="tab"
                aria-selected={view === "diagram"}
                aria-controls="ol-diagram-panel"
                tabIndex={view === "diagram" ? 0 : -1}
                onClick={() => setView("diagram")}
              >
                <Network size={14} />
                Diagram
              </button>
              <button
                ref={inventoryTab}
                type="button"
                id="ol-inventory-tab"
                role="tab"
                aria-selected={view === "inventory"}
                aria-controls="ol-inventory-panel"
                tabIndex={view === "inventory" ? 0 : -1}
                onClick={() => setView("inventory")}
              >
                <List size={14} />
                Inventory<span>5</span>
              </button>
            </div>
            <div className="ol-canvas-actions">
              <button
                type="button"
                className="ol-reset-button"
                aria-label="Reset view"
                onClick={resetView}
                title="Reset view and selection"
              >
                <RotateCcw size={14} />
                <span>Reset view</span>
              </button>
              <span className="ol-toolbar-divider" />
              <button
                type="button"
                className="ol-export-button"
                onClick={exportTopology}
              >
                <FileJson size={14} />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
          <div className="ol-mobile-selection">
            <span>{t(selected.label)}</span>
            <a href="#onelake-item-inspector">View details <ArrowDown size={13} /></a>
          </div>
          {view === "diagram" ? (
            <div
              id="ol-diagram-panel"
              role="tabpanel"
              aria-labelledby="ol-diagram-tab"
              tabIndex={0}
              className="ol-diagram-panel"
            >
              <div className="ol-canvas-context">
                <span>
                  <span className="status-dot" />
                  ONELAKE / EXAMPLE WORKSPACE
                </span>
                <span>SELECT AN ITEM TO INSPECT</span>
              </div>
              <div
                className={`ol-topology ${showRelationships ? "show-relationships" : ""}`}
              >
                <div className="ol-batch-flow">
                  {STAGES.map((stage, index) => (
                    <React.Fragment key={stage.layer}>
                      <div className={`ol-stage ol-tone-${stage.layer}`}>
                        <div className="ol-stage-label">
                          <span>{stage.number}</span>
                          <div>
                            <strong>{stage.title}</strong>
                            <small>{stage.subtitle}</small>
                          </div>
                        </div>
                        {nodeCard(SAMPLE_NODES[index])}
                      </div>
                      {index < STAGES.length - 1 && (
                        <div
                          className={`ol-flow-connector ${connections.some((edge) => edge.source === SAMPLE_NODES[index].id) ? "is-related" : ""}`}
                          aria-hidden="true"
                        >
                          <span>
                            {index === 0
                              ? "Transform"
                              : index === 1
                                ? "Curate"
                                : "Serve"}
                          </span>
                          <div>
                            <i />
                            <ArrowRight size={12} />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="ol-parallel-lane">
                  <div className="ol-parallel-label">
                    <Activity size={13} />
                    <span>PARALLEL WORKLOAD</span>
                    <span className="ol-lane-rule" />
                  </div>
                  <div className="ol-parallel-content">
                    {nodeCard(SAMPLE_NODES[4])}
                    <p>
                      Real-time analytics alongside your batch estate.
                      <span>
                        Shown independently; no relationship configured.
                      </span>
                    </p>
                  </div>
                </div>
                <div className="ol-foundation">
                  <span className="ol-foundation-icon">
                    <Waves size={22} strokeWidth={1.5} />
                  </span>
                  <div>
                    <strong>OneLake</strong>
                    <span>A unified view of your Fabric data estate</span>
                  </div>
                  <span className="ol-foundation-badge">
                    <Layers size={12} />
                    LOGICAL FOUNDATION
                  </span>
                </div>
              </div>
              <div className="ol-diagram-footer">
                <span>
                  <MousePointer2 size={13} />
                  Select an item to explore its role
                </span>
                <label>
                  <input
                    type="checkbox"
                    checked={showRelationships}
                    onChange={(event) =>
                      setShowRelationships(event.target.checked)
                    }
                  />
                  Show flow labels
                </label>
              </div>
            </div>
          ) : (
            <div
              id="ol-inventory-panel"
              role="tabpanel"
              aria-labelledby="ol-inventory-tab"
              tabIndex={0}
              className="ol-inventory-panel"
            >
              <div className="ol-inventory-caption">
                5 illustrative items{" "}
                <span>Select a row to inspect its properties.</span>
              </div>
              <div className="ol-inventory-list">
                {SAMPLE_NODES.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    aria-pressed={selected.id === node.id}
                    onClick={() => setSelectedId(node.id)}
                    className={`ol-inventory-row ol-tone-${node.layer} ${selected.id === node.id ? "is-selected" : ""}`}
                  >
                    <span className="ol-node-icon">
                      <NodeIcon node={node} />
                    </span>
                    <span>
                      <strong>{node.label}</strong>
                      <small>{node.kind}</small>
                    </span>
                    <span className="ol-layer-pill">
                      {node.id === "realtime" ? "Parallel" : node.layer}
                    </span>
                    <ChevronRight size={15} />
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="ol-canvas-bottom">
            <span>
              <ShieldCheck size={13} />
              Illustrative topology · no live telemetry
            </span>
            <span>
              5 items <i />3 relationships
            </span>
          </div>
        </section>

        <aside
          id="onelake-item-inspector"
          tabIndex={-1}
          className="ol-inspector"
          aria-label="Selected item details"
        >
          <div className="ol-inspector-heading">
            <span>ITEM INSPECTOR</span>
            <MousePointer2 size={13} />
          </div>
          <div className="ol-inspector-content" aria-live="polite">
            <div className={`ol-inspector-identity ol-tone-${selected.layer}`}>
              <span className="ol-inspector-icon">
                <NodeIcon node={selected} size={25} />
              </span>
              <span className="ol-layer-pill">
                {selected.id === "realtime"
                  ? "Parallel workload"
                  : `${selected.layer} layer`}
              </span>
              <h2>{t(selected.label)}</h2>
              <span>{t(selected.kind)}</span>
            </div>
            <div className="ol-inspector-section">
              <h3>ROLE IN YOUR ESTATE</h3>
              <p>{t(selected.description || "")}</p>
            </div>
            <dl className="ol-item-properties">
              <div>
                <dt>Workspace</dt>
                <dd>Example analytics</dd>
              </div>
              <div>
                <dt>Item type</dt>
                <dd>{selected.kind}</dd>
              </div>
              <div>
                <dt>Purpose</dt>
                <dd>{selected.purpose}</dd>
              </div>
              <div>
                <dt>Connections</dt>
                <dd>
                  {connections.length} logical{" "}
                  {connections.length === 1 ? "relationship" : "relationships"}
                </dd>
              </div>
            </dl>
            <div className="ol-inspector-section ol-lineage">
              <h3>
                CONNECTED ITEMS <span>{connections.length}</span>
              </h3>
              {connections.length ? (
                connections.map((edge) => {
                  const incoming = edge.target === selected.id;
                  const neighbor = SAMPLE_NODES.find(
                    (node) =>
                      node.id === (incoming ? edge.source : edge.target),
                  )!;
                  return (
                    <button
                      type="button"
                      className={`ol-lineage-item ol-tone-${neighbor.layer}`}
                      key={`${edge.source}-${edge.target}`}
                      onClick={() => setSelectedId(neighbor.id)}
                    >
                      <span className="ol-node-icon">
                        <NodeIcon node={neighbor} size={16} />
                      </span>
                      <span>
                        <small>{incoming ? "UPSTREAM" : "DOWNSTREAM"}</small>
                        <strong>{neighbor.label}</strong>
                      </span>
                      <ArrowUpRight size={14} />
                    </button>
                  );
                })
              ) : (
                <p className="ol-no-connections">
                  No connections in this example.
                </p>
              )}
            </div>
            <div className="ol-inspector-section ol-object-section">
              <h3>
                EXAMPLE {selected.id === "semantic" ? "CONTENTS" : "OBJECTS"}
                <span>{selected.objects.length}</span>
              </h3>
              {selected.objects.map((object) => (
                <div className="ol-example-object" key={object}>
                  <Box size={12} />
                  <span>{object}</span>
                </div>
              ))}
            </div>
            <div className="ol-inspector-note">
              <Info size={14} />
              <p>
                Example properties for exploration. Connect your design
                decisions in the architecture planner.
              </p>
            </div>
          </div>
        </aside>
      </div>
      <div className="ol-explainer">
        <span>
          <GitBranch size={20} />
        </span>
        <div>
          <h2>Follow the flow. Understand the architecture.</h2>
          <p>
            Bronze preserves the source. Silver brings consistency. Gold
            prepares business-ready data. The semantic layer makes it available
            for analysis.
          </p>
        </div>
        <Link to="/docs" className="text-link">
          Explore the guides
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
