import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Database,
  Download,
  FileJson,
  GitBranch,
  Info,
  Layers,
  LayoutList,
  Link2,
  MousePointer2,
  Network,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  Waves,
  X,
} from "lucide-react";
import {
  type ArchitectureDiagram,
  type ComponentCategory,
  REFERENCE_ARCHITECTURE_TEMPLATES,
  AVAILABLE_COMPONENT_CATALOG,
  validateArchitecture,
  getSavedDiagrams,
  saveDiagramToStorage,
  exportDiagramAsJSON,
  exportDiagramAsSVG,
} from "../lib/architecture";
import {
  ARCHITECTURE_STAGES,
  ArchitectureCanvas,
  ArchitectureItemIcon,
} from "../components/architecture/ArchitectureCanvas";
import "../styles/onelake.css";
import "../styles/architecture-planner.css";

const DEFAULT_TEMPLATE = "medallion-lakehouse";
type View = "diagram" | "outline" | "connections";
const VIEW_OPTIONS = [
  { id: "diagram", label: "Diagram", icon: Network },
  { id: "outline", label: "Outline", icon: LayoutList },
  { id: "connections", label: "Connections", icon: GitBranch },
] as const;

export function ArchitecturePlanner() {
  const [selectedTemplateKey, setSelectedTemplateKey] =
    useState(DEFAULT_TEMPLATE);
  const [currentDiagram, setCurrentDiagram] = useState<ArchitectureDiagram>(
    REFERENCE_ARCHITECTURE_TEMPLATES[DEFAULT_TEMPLATE],
  );
  const [selectedId, setSelectedId] = useState("sto-bronze");
  const [view, setView] = useState<View>("diagram");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeCategoryIndex, setNewNodeCategoryIndex] = useState(0);
  const [connectionTarget, setConnectionTarget] = useState("");
  const [connectionLabel, setConnectionLabel] = useState("");
  const [saveState, setSaveState] = useState<"ready" | "saved" | "unavailable">(
    "ready",
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabRefs = useRef(new Map<View, HTMLButtonElement>());

  useEffect(() => {
    const saved = getSavedDiagrams().find(
      (diagram) => diagram.id === DEFAULT_TEMPLATE,
    );
    if (
      saved &&
      Array.isArray(saved.nodes) &&
      Array.isArray(saved.connections)
    ) {
      setCurrentDiagram(saved);
      setSelectedId(
        saved.nodes.find((node) => node.category === "storage")?.id ||
          saved.nodes[0]?.id ||
          "",
      );
    }
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!showAddModal) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    modalRef.current?.querySelector<HTMLElement>("select")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowAddModal(false);
      if (event.key !== "Tab") return;
      const items = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(
          "button, input, select",
        ) || [],
      );
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items[items.length - 1]?.focus();
      }
      if (
        !event.shiftKey &&
        document.activeElement === items[items.length - 1]
      ) {
        event.preventDefault();
        items[0]?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, [showAddModal]);

  const selected =
    currentDiagram.nodes.find((node) => node.id === selectedId) ||
    currentDiagram.nodes[0];
  const validation = useMemo(
    () =>
      validateArchitecture(currentDiagram.nodes, currentDiagram.connections),
    [currentDiagram],
  );
  const selectedConnections = currentDiagram.connections.filter(
    (edge) => edge.from === selected?.id || edge.to === selected?.id,
  );
  const availableTargets = currentDiagram.nodes.filter(
    (node) =>
      node.id !== selected?.id &&
      !currentDiagram.connections.some(
        (edge) => edge.from === selected?.id && edge.to === node.id,
      ),
  );
  const activeTarget = availableTargets.some(
    (node) => node.id === connectionTarget,
  )
    ? connectionTarget
    : availableTargets[0]?.id || "";
  const selectedFindings = validation.issues.filter(
    (issue) => issue.nodeId === selected?.id,
  );
  const populatedStages = new Set(
    currentDiagram.nodes.map((node) => node.category),
  ).size;

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 3500);
  };
  const commit = (diagram: ArchitectureDiagram) => {
    const updated = { ...diagram, updatedAt: new Date().toISOString() };
    setCurrentDiagram(updated);
    try {
      saveDiagramToStorage(updated);
      setSaveState("saved");
    } catch {
      setSaveState("unavailable");
    }
  };
  const selectNode = (id: string) => {
    setSelectedId(id);
    setConnectionTarget("");
    setConnectionLabel("");
  };
  const selectTemplate = (key: string) => {
    const base = REFERENCE_ARCHITECTURE_TEMPLATES[key];
    if (!base) return;
    const saved = getSavedDiagrams().find((diagram) => diagram.id === base.id);
    const next =
      saved && Array.isArray(saved.nodes) && Array.isArray(saved.connections)
        ? saved
        : base;
    setSelectedTemplateKey(key);
    setCurrentDiagram(next);
    selectNode(
      next.nodes.find((node) => node.category === "storage")?.id ||
        next.nodes[0]?.id ||
        "",
    );
    setSaveState("ready");
    showToast("Reference architecture loaded.");
  };
  const resetDiagram = () => {
    const template = REFERENCE_ARCHITECTURE_TEMPLATES[selectedTemplateKey];
    commit(template);
    selectNode(
      template.nodes.find((node) => node.category === "storage")?.id ||
        template.nodes[0]?.id ||
        "",
    );
    showToast("Restored the original reference template.");
  };
  const openAdd = (category?: ComponentCategory) => {
    setNewNodeLabel("");
    if (category)
      setNewNodeCategoryIndex(
        Math.max(
          0,
          AVAILABLE_COMPONENT_CATALOG.findIndex(
            (item) => item.category === category,
          ),
        ),
      );
    setShowAddModal(true);
  };
  const addComponent = (event: React.FormEvent) => {
    event.preventDefault();
    const item = AVAILABLE_COMPONENT_CATALOG[newNodeCategoryIndex];
    if (!item) return;
    const node = {
      ...item,
      id: `node-${crypto.randomUUID()}`,
      label: newNodeLabel.trim() || item.label,
    };
    commit({ ...currentDiagram, nodes: [...currentDiagram.nodes, node] });
    selectNode(node.id);
    setShowAddModal(false);
    showToast(`Added ${node.label}. Connect it from the inspector.`);
  };
  const removeSelected = () => {
    if (!selected) return;
    const nodes = currentDiagram.nodes.filter(
      (node) => node.id !== selected.id,
    );
    commit({
      ...currentDiagram,
      nodes,
      connections: currentDiagram.connections.filter(
        (edge) => edge.from !== selected.id && edge.to !== selected.id,
      ),
    });
    selectNode(nodes[0]?.id || "");
    showToast("Component and its connections removed.");
  };
  const addConnection = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected || !activeTarget) return;
    commit({
      ...currentDiagram,
      connections: [
        ...currentDiagram.connections,
        {
          from: selected.id,
          to: activeTarget,
          label: connectionLabel.trim() || undefined,
        },
      ],
    });
    setConnectionTarget("");
    setConnectionLabel("");
    showToast("Connection added to your architecture.");
  };
  const removeConnection = (from: string, to: string) => {
    commit({
      ...currentDiagram,
      connections: currentDiagram.connections.filter(
        (edge) => !(edge.from === from && edge.to === to),
      ),
    });
    showToast("Connection removed.");
  };
  const handleTabKey = (event: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const index = VIEW_OPTIONS.findIndex((option) => option.id === view);
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? VIEW_OPTIONS.length - 1
          : (index +
              (event.key === "ArrowRight" ? 1 : -1) +
              VIEW_OPTIONS.length) %
            VIEW_OPTIONS.length;
    const next = VIEW_OPTIONS[nextIndex].id;
    setView(next);
    tabRefs.current.get(next)?.focus();
  };

  return (
    <div className="onelake-page ap-page">
      <Helmet>
        <title>
          Architecture Planner | Microsoft Fabric Design Studio | Fabric Master
        </title>
        <meta
          name="description"
          content="Plan your Microsoft Fabric architecture with reference templates, a connected visual canvas, structural rule checks, and diagram exports."
        />
        <link
          rel="canonical"
          href="https://fabric.dattasable.com/architecture/planner"
        />
      </Helmet>
      {toastMessage && (
        <div role="status" className="ap-toast">
          <CheckCircle2 size={17} />
          <span>{toastMessage}</span>
        </div>
      )}
      <div className="ol-page-heading">
        <div>
          <div className="eyebrow">
            <Layers size={14} />
            ARCHITECTURE DESIGN STUDIO
          </div>
          <h1>
            Architecture Planner
            <span>A considered design. A clearer direction.</span>
          </h1>
          <p>
            Shape your Microsoft Fabric estate. Start with a reference
            architecture, connect the pieces, and turn your design into a plan.
          </p>
        </div>
        <Link to="/architecture/onelake" className="premium-button secondary">
          <Waves size={15} />
          Explore OneLake
          <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="ol-summary-strip ap-summary">
        <div>
          <span className="ol-summary-icon">
            <Database size={17} />
          </span>
          <span>
            <strong>{currentDiagram.nodes.length}</strong>Components
          </span>
        </div>
        <div>
          <span className="ol-summary-icon">
            <GitBranch size={17} />
          </span>
          <span>
            <strong>{currentDiagram.connections.length}</strong>Connections
          </span>
        </div>
        <div>
          <span className="ol-summary-icon">
            <Layers size={17} />
          </span>
          <span>
            <strong>
              {populatedStages}
              <small>/ 6</small>
            </strong>
            Stages in use
          </span>
        </div>
        <div
          className={`ap-score ${validation.issues.length ? "has-findings" : ""}`}
        >
          <ShieldCheck size={20} />
          <span>
            <strong>
              {validation.score}
              <small>/ 100</small>
            </strong>
            <span>Structural rule score</span>
          </span>
          <a href="#ap-validation" aria-label="Review architecture checks">
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <div className="ap-template-bar">
        <div>
          <label htmlFor="ap-template-select">REFERENCE ARCHITECTURE</label>
          <select
            id="ap-template-select"
            value={selectedTemplateKey}
            onChange={(event) => selectTemplate(event.target.value)}
          >
            {Object.entries(REFERENCE_ARCHITECTURE_TEMPLATES).map(
              ([key, template]) => (
                <option key={key} value={key}>
                  {template.name}
                </option>
              ),
            )}
          </select>
        </div>
        <span className="ap-template-count">
          {Object.keys(REFERENCE_ARCHITECTURE_TEMPLATES).length} reference
          patterns
        </span>
        <button
          type="button"
          className="premium-button primary"
          onClick={() => openAdd()}
        >
          <Plus size={16} />
          Add component
        </button>
      </div>
      <div className="ap-workbench">
        <section
          className="ol-canvas-panel ap-canvas-panel"
          aria-label="Architecture design canvas"
        >
          <div className="ol-canvas-heading">
            <div>
              <span className="ol-project-symbol">
                <Network size={18} />
              </span>
              <div>
                <h2>{currentDiagram.name}</h2>
                <p>
                  Logical architecture <span>/</span> Editable design
                </p>
              </div>
            </div>
            <span className="ol-sample-badge">DESIGN MODE</span>
          </div>
          <p className="ap-template-description">
            {currentDiagram.description}
          </p>
          <div className="ol-toolbar ap-toolbar">
            <div
              className="ol-view-tabs"
              role="tablist"
              aria-label="Architecture views"
              onKeyDown={handleTabKey}
            >
              {VIEW_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  ref={(element) => {
                    if (element) tabRefs.current.set(option.id, element);
                    else tabRefs.current.delete(option.id);
                  }}
                  type="button"
                  role="tab"
                  id={`ap-tab-${option.id}`}
                  aria-controls="ap-view-panel"
                  aria-selected={view === option.id}
                  tabIndex={view === option.id ? 0 : -1}
                  onClick={() => setView(option.id)}
                >
                  <option.icon size={14} />
                  {option.label}
                </button>
              ))}
            </div>
            <div className="ol-canvas-actions">
              <button
                type="button"
                onClick={resetDiagram}
                aria-label="Reset template"
                title="Restore the original template"
              >
                <RotateCcw size={14} />
              </button>
              <span className="ol-toolbar-divider" />
              <button
                type="button"
                onClick={() => exportDiagramAsSVG(currentDiagram)}
                aria-label="Export SVG"
                title="Export SVG"
              >
                <Download size={14} />
                <span>SVG</span>
              </button>
              <button
                type="button"
                onClick={() => exportDiagramAsJSON(currentDiagram)}
                aria-label="Export JSON"
                title="Export JSON"
              >
                <FileJson size={14} />
                <span>JSON</span>
              </button>
            </div>
          </div>
          {selected && (
            <div className="ol-mobile-selection">
              <span>{selected.label}</span>
              <a href="#ap-item-inspector">
                View details
                <ArrowDown size={13} />
              </a>
            </div>
          )}
          <div
            id="ap-view-panel"
            role="tabpanel"
            aria-labelledby={`ap-tab-${view}`}
            tabIndex={0}
          >
            {view === "diagram" && (
              <>
                <div className="ap-canvas-context">
                  <span>
                    <span className="status-dot" />
                    YOUR FABRIC DATA ESTATE
                  </span>
                  <span>SELECT A COMPONENT TO INSPECT</span>
                </div>
                <ArchitectureCanvas
                  nodes={currentDiagram.nodes}
                  connections={currentDiagram.connections}
                  selectedId={selected?.id || ""}
                  onSelect={selectNode}
                  onAdd={openAdd}
                />
                <div className="ap-canvas-legend">
                  <span>
                    <i className="ap-legend-active" />
                    Selected connections
                  </span>
                  <span>
                    <i />
                    Other connections
                  </span>
                  <span>Logical relationships, not measured data traffic</span>
                </div>
              </>
            )}
            {view === "outline" && (
              <div className="ap-outline">
                <div className="ap-view-intro">
                  <h3>Component outline</h3>
                  <p>
                    A keyboard-friendly inventory of every component in your
                    design.
                  </p>
                </div>
                {ARCHITECTURE_STAGES.map((stage) => {
                  const nodes = currentDiagram.nodes.filter(
                    (node) => node.category === stage.category,
                  );
                  return (
                    <section
                      key={stage.category}
                      className={`ap-outline-group ap-tone-${stage.category}`}
                    >
                      <h4>
                        <stage.icon size={14} />
                        {stage.number} / {stage.title}
                        <span>{nodes.length}</span>
                      </h4>
                      {nodes.length ? (
                        nodes.map((node) => (
                          <button
                            type="button"
                            key={node.id}
                            aria-pressed={selected?.id === node.id}
                            onClick={() => selectNode(node.id)}
                            className={`ap-outline-item ${selected?.id === node.id ? "is-selected" : ""}`}
                          >
                            <span>
                              <strong>{node.label}</strong>
                              <small>{node.serviceName}</small>
                            </span>
                            <ArrowUpRight size={14} />
                          </button>
                        ))
                      ) : (
                        <p className="ap-empty-text">
                          No components in this stage.
                        </p>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
            {view === "connections" && (
              <div className="ap-connections-view">
                <div className="ap-view-intro">
                  <h3>Connected by design</h3>
                  <p>
                    Inspect the source, destination, and purpose of each
                    configured relationship.
                  </p>
                </div>
                {currentDiagram.connections.length ? (
                  currentDiagram.connections.map((edge, index) => {
                    const from = currentDiagram.nodes.find(
                      (node) => node.id === edge.from,
                    );
                    const to = currentDiagram.nodes.find(
                      (node) => node.id === edge.to,
                    );
                    return (
                      <div
                        className="ap-connection-row"
                        key={`${edge.from}-${edge.to}-${index}`}
                      >
                        <span className="ap-connection-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <div>
                            <button
                              type="button"
                              onClick={() => selectNode(edge.from)}
                            >
                              {from?.label || edge.from}
                            </button>
                            <ArrowRight size={14} />
                            <button
                              type="button"
                              onClick={() => selectNode(edge.to)}
                            >
                              {to?.label || edge.to}
                            </button>
                          </div>
                          <p>{edge.label || "Logical relationship"}</p>
                        </div>
                        <button
                          type="button"
                          className="ap-remove-link"
                          onClick={() => removeConnection(edge.from, edge.to)}
                          aria-label={`Remove connection from ${from?.label} to ${to?.label}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="ap-empty-state">
                    <GitBranch size={30} />
                    <h3>No connections yet</h3>
                    <p>
                      Select a component and connect it to a destination in the
                      inspector.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="ol-canvas-bottom">
            <span>
              <ShieldCheck size={13} />
              {saveState === "saved"
                ? "Saved in this browser"
                : saveState === "unavailable"
                  ? "Browser storage unavailable · export to keep your design"
                  : "Changes are saved in this browser"}
            </span>
            <span>
              {currentDiagram.nodes.length} items <i />
              {currentDiagram.connections.length} relationships
            </span>
          </div>
        </section>

        <aside
          className="ol-inspector ap-inspector"
          id="ap-item-inspector"
          tabIndex={-1}
          aria-label="Component inspector"
        >
          <div className="ol-inspector-heading">
            <span>COMPONENT INSPECTOR</span>
            <MousePointer2 size={13} />
          </div>
          {selected ? (
            <div className="ap-inspector-body">
              <div
                className={`ol-inspector-identity ap-tone-${selected.category}`}
              >
                <span className="ol-inspector-icon">
                  <ArchitectureItemIcon node={selected} size={25} />
                </span>
                <span className="ol-layer-pill">{selected.category}</span>
                <h2>{selected.label}</h2>
                <span>{selected.serviceName}</span>
              </div>
              <div className="ol-inspector-section">
                <h3>ROLE IN YOUR ARCHITECTURE</h3>
                <p>{selected.description}</p>
              </div>
              <dl className="ol-item-properties">
                <div>
                  <dt>Design stage</dt>
                  <dd>
                    {
                      ARCHITECTURE_STAGES.find(
                        (stage) => stage.category === selected.category,
                      )?.title
                    }
                  </dd>
                </div>
                <div>
                  <dt>Upstream items</dt>
                  <dd>
                    {
                      selectedConnections.filter(
                        (edge) => edge.to === selected.id,
                      ).length
                    }
                  </dd>
                </div>
                <div>
                  <dt>Downstream items</dt>
                  <dd>
                    {
                      selectedConnections.filter(
                        (edge) => edge.from === selected.id,
                      ).length
                    }
                  </dd>
                </div>
              </dl>
              <div className="ol-inspector-section">
                <h3>
                  CONNECTED ITEMS<span>{selectedConnections.length}</span>
                </h3>
                {selectedConnections.length ? (
                  selectedConnections.map((edge, index) => {
                    const incoming = edge.to === selected.id;
                    const neighbor = currentDiagram.nodes.find(
                      (node) => node.id === (incoming ? edge.from : edge.to),
                    );
                    return neighbor ? (
                      <button
                        type="button"
                        key={`${edge.from}-${edge.to}-${index}`}
                        className={`ol-lineage-item ap-tone-${neighbor.category}`}
                        onClick={() => selectNode(neighbor.id)}
                      >
                        <span className="ol-node-icon">
                          <ArchitectureItemIcon node={neighbor} size={16} />
                        </span>
                        <span>
                          <small>{incoming ? "UPSTREAM" : "DOWNSTREAM"}</small>
                          <strong>{neighbor.label}</strong>
                          <em>{edge.label || "Logical relationship"}</em>
                        </span>
                        <ArrowUpRight size={13} />
                      </button>
                    ) : null;
                  })
                ) : (
                  <p className="ap-empty-text">
                    No relationships configured. Connect this item below.
                  </p>
                )}
              </div>
              <form className="ap-connect-form" onSubmit={addConnection}>
                <h3>
                  <Link2 size={13} />
                  ADD A CONNECTION
                </h3>
                <label htmlFor="ap-connection-target">
                  Connect this item to
                </label>
                <select
                  id="ap-connection-target"
                  value={activeTarget}
                  disabled={!availableTargets.length}
                  onChange={(event) => setConnectionTarget(event.target.value)}
                >
                  {availableTargets.length ? (
                    availableTargets.map((node) => (
                      <option key={node.id} value={node.id}>
                        {node.label}
                      </option>
                    ))
                  ) : (
                    <option value="">No available destinations</option>
                  )}
                </select>
                <label htmlFor="ap-connection-label">
                  Relationship label <span>Optional</span>
                </label>
                <input
                  id="ap-connection-label"
                  maxLength={100}
                  value={connectionLabel}
                  onChange={(event) => setConnectionLabel(event.target.value)}
                  placeholder="e.g. Curated data"
                />
                <button
                  type="submit"
                  disabled={!activeTarget}
                  className="premium-button secondary"
                >
                  <Plus size={13} />
                  Add connection
                </button>
              </form>
              {selectedFindings.length > 0 && (
                <div className="ap-item-findings">
                  {selectedFindings.map((issue) => (
                    <p key={issue.id}>
                      <TriangleAlert size={13} />
                      <span>{issue.message}</span>
                    </p>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="ap-delete-node"
                onClick={removeSelected}
              >
                <Trash2 size={13} />
                Remove component
              </button>
            </div>
          ) : (
            <div className="ap-empty-state">
              <Layers size={30} />
              <h3>Your canvas is ready</h3>
              <p>Add a component or restore a reference template to begin.</p>
              <button
                type="button"
                className="premium-button primary"
                onClick={() => openAdd()}
              >
                Add component
              </button>
            </div>
          )}
        </aside>
      </div>

      <section
        className="ap-validation"
        id="ap-validation"
        aria-label="Architecture rule checks"
      >
        <div className="ap-validation-heading">
          <div>
            <span className="ol-project-symbol">
              <ShieldCheck size={20} />
            </span>
            <div>
              <div className="eyebrow">CHECK THE FOUNDATIONS</div>
              <h2>Architecture review</h2>
            </div>
          </div>
          <span
            className={`ap-findings-badge ${validation.issues.length ? "has-findings" : ""}`}
          >
            {validation.issues.length
              ? `${validation.issues.length} findings`
              : "All structural checks passed"}
          </span>
        </div>
        <p className="ap-review-description">
          Checks for source, storage, analytics, governance, and isolated
          components. Use these findings to refine your design.
        </p>
        {validation.issues.length ? (
          <div className="ap-findings-list">
            {validation.issues.map((issue) => (
              <div
                className={`ap-finding ap-severity-${issue.severity}`}
                key={issue.id}
              >
                {issue.severity === "info" ? (
                  <Info size={17} />
                ) : (
                  <TriangleAlert size={17} />
                )}
                <div>
                  <span>{issue.severity}</span>
                  <h3>{issue.message}</h3>
                  <p>{issue.remediation}</p>
                </div>
                {issue.nodeId && (
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      selectNode(issue.nodeId!);
                      document.getElementById("ap-item-inspector")?.focus();
                    }}
                  >
                    Inspect
                    <ArrowUpRight size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="ap-checks-passed">
            {[
              "Source identified",
              "Storage included",
              "Analytics included",
              "Governance included",
              "Components connected",
            ].map((label) => (
              <span key={label}>
                <CheckCircle2 size={14} />
                {label}
              </span>
            ))}
          </div>
        )}
      </section>
      <div className="ap-guidance-grid">
        <section>
          <h2>
            <CheckCircle2 size={17} />
            Before you implement
          </h2>
          <ul>
            {currentDiagram.prerequisites.map((item) => (
              <li key={item}>
                <Check size={13} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>
            <ShieldCheck size={17} />
            Governance by design
          </h2>
          <p>{currentDiagram.governanceNotes}</p>
          <a
            className="text-link"
            href="https://learn.microsoft.com/en-us/fabric/governance/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the governance guidance
            <ArrowUpRight size={14} />
          </a>
        </section>
      </div>

      {showAddModal && (
        <div
          className="ap-modal-backdrop"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="ap-add-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ap-add-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ap-modal-heading">
              <span className="ol-project-symbol">
                <Plus size={20} />
              </span>
              <button
                type="button"
                className="icon-button"
                aria-label="Close component catalog"
                onClick={() => setShowAddModal(false)}
              >
                <X size={19} />
              </button>
            </div>
            <div className="eyebrow">BUILD YOUR ARCHITECTURE</div>
            <h2 id="ap-add-title">Add a component</h2>
            <p>
              Choose a building block, give it a name, and connect it to your
              estate.
            </p>
            <form onSubmit={addComponent}>
              <label htmlFor="ap-component-type">Component</label>
              <select
                id="ap-component-type"
                value={newNodeCategoryIndex}
                onChange={(event) =>
                  setNewNodeCategoryIndex(Number(event.target.value))
                }
              >
                {AVAILABLE_COMPONENT_CATALOG.map((item, index) => (
                  <option key={`${item.category}-${item.label}`} value={index}>
                    {item.label} · {item.category}
                  </option>
                ))}
              </select>
              <div className="ap-catalog-description">
                <Info size={15} />
                <p>
                  {
                    AVAILABLE_COMPONENT_CATALOG[newNodeCategoryIndex]
                      ?.description
                  }
                </p>
              </div>
              <label htmlFor="ap-component-name">
                Custom name <span>Optional</span>
              </label>
              <input
                id="ap-component-name"
                maxLength={80}
                value={newNodeLabel}
                onChange={(event) => setNewNodeLabel(event.target.value)}
                placeholder={
                  AVAILABLE_COMPONENT_CATALOG[newNodeCategoryIndex]?.label
                }
              />
              <div className="ap-modal-footer">
                <button
                  type="button"
                  className="premium-button secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="premium-button primary">
                  <Plus size={15} />
                  Add to canvas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
