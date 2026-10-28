import { useTranslation } from "react-i18next";
import React, { useEffect, useId, useRef, useState } from "react";
import {
  Activity,
  Database,
  LayoutDashboard,
  Plus,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type {
  ArchitectureNode,
  ArchitectureConnection,
  ComponentCategory,
} from "../../lib/architecture";
export const ARCHITECTURE_STAGES = [
  {
    category: "source",
    number: "01",
    title: "Data sources",
    subtitle: "Where data begins",
    icon: Server,
  },
  {
    category: "ingestion",
    number: "02",
    title: "Ingestion",
    subtitle: "Bring it together",
    icon: Activity,
  },
  {
    category: "storage",
    number: "03",
    title: "OneLake storage",
    subtitle: "A shared foundation",
    icon: Database,
  },
  {
    category: "processing",
    number: "04",
    title: "Processing",
    subtitle: "Shape & transform",
    icon: Sparkles,
  },
  {
    category: "analytics",
    number: "05",
    title: "Analytics",
    subtitle: "Make it meaningful",
    icon: LayoutDashboard,
  },
  {
    category: "governance",
    number: "06",
    title: "Governance",
    subtitle: "Trust & protect",
    icon: ShieldCheck,
  },
] as const;
export function ArchitectureItemIcon({
  node,
  size = 18,
}: {
  node: ArchitectureNode;
  size?: number;
}) {
  const Icon =
    ARCHITECTURE_STAGES.find((stage) => stage.category === node.category)
      ?.icon || Database;
  return <Icon size={size} strokeWidth={1.6} />;
}
interface CanvasProps {
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: (category: ComponentCategory) => void;
}
type DrawnPath = {
  from: string;
  to: string;
  d: string;
};
export function ArchitectureCanvas({
  nodes,
  connections,
  selectedId,
  onSelect,
  onAdd,
}: CanvasProps) {
  const tx = useTranslation().t;
  const boardRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const markerId = useId().replace(/:/g, "");
  const [geometry, setGeometry] = useState<{
    width: number;
    height: number;
    paths: DrawnPath[];
  }>({ width: 1, height: 1, paths: [] });
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    let frame = 0;
    const measure = () => {
      const base = board.getBoundingClientRect();
      const rectangles = [...nodeRefs.current.values()].map((element) =>
        element.getBoundingClientRect(),
      );
      const bottomChannel =
        Math.max(base.top, ...rectangles.map((rectangle) => rectangle.bottom)) -
        base.top;
      const paths = connections.flatMap((edge, index) => {
        const from = nodeRefs.current.get(edge.from)?.getBoundingClientRect();
        const to = nodeRefs.current.get(edge.to)?.getBoundingClientRect();
        if (!from || !to) return [];
        const sameColumn = Math.abs(from.left - to.left) < 4;
        let d: string;
        if (!sameColumn) {
          const rightward = to.left > from.left;
          const sx = (rightward ? from.right : from.left) - base.left;
          const tx = (rightward ? to.left : to.right) - base.left;
          const sy = from.top + from.height / 2 - base.top;
          const ty = to.top + to.height / 2 - base.top;
          if (Math.abs(sx - tx) < 80) {
            d = `M ${sx} ${sy} C ${(sx + tx) / 2} ${sy}, ${(sx + tx) / 2} ${ty}, ${tx} ${ty}`;
          } else {
            // Long relationships use the outer gutters instead of crossing cards.
            const direction = rightward ? 1 : -1;
            const sourceGutter = sx + direction * 9;
            const targetGutter = tx - direction * 9;
            const channel = bottomChannel + 9 + (index % 3) * 5;
            d = `M ${sx} ${sy} H ${sourceGutter} V ${channel} H ${targetGutter} V ${ty} H ${tx}`;
          }
        } else {
          const downward = to.top > from.top;
          const sx = from.left + from.width / 2 - base.left;
          const tx = to.left + to.width / 2 - base.left;
          const sy = (downward ? from.bottom : from.top) - base.top;
          const ty = (downward ? to.top : to.bottom) - base.top;
          const low = Math.min(from.bottom, to.bottom);
          const high = Math.max(from.top, to.top);
          const blocked = rectangles.some(
            (rectangle) =>
              Math.abs(rectangle.left - from.left) < 4 &&
              rectangle.top > low &&
              rectangle.bottom < high,
          );
          if (blocked) {
            const start = from.right - base.left;
            const end = to.right - base.left;
            const gutter = Math.max(start, end) + 9;
            d = `M ${start} ${from.top + from.height / 2 - base.top} H ${gutter} V ${to.top + to.height / 2 - base.top} H ${end}`;
          } else {
            const bend = (sy + ty) / 2;
            d = `M ${sx} ${sy} C ${sx} ${bend}, ${tx} ${bend}, ${tx} ${ty}`;
          }
        }
        return [{ from: edge.from, to: edge.to, d }];
      });
      const next = {
        width: Math.max(base.width, 1),
        height: Math.max(base.height, 1),
        paths,
      };
      setGeometry((previous) =>
        JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(board);
    nodeRefs.current.forEach((element) => observer.observe(element));
    schedule();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [nodes, connections]);
  return (
    <div className="ap-flow-board" ref={boardRef}>
      <svg
        className="ap-flow-lines"
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <marker
            id={`${markerId}-normal`}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto-start-reverse"
          >
            <path
              d="M0 0 L6 3 L0 6"
              fill="none"
              stroke="var(--color-text-muted)"
              strokeWidth="1"
            />
          </marker>
          <marker
            id={`${markerId}-active`}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto-start-reverse"
          >
            <path
              d="M0 0 L6 3 L0 6"
              fill="none"
              stroke="var(--color-accent-primary)"
              strokeWidth="1"
            />
          </marker>
        </defs>
        {geometry.paths.map((path, index) => (
          <path
            key={`${path.from}-${path.to}-${index}`}
            d={path.d}
            className={
              path.from === selectedId || path.to === selectedId
                ? "is-highlighted"
                : ""
            }
            markerEnd={`url(#${markerId}-${path.from === selectedId || path.to === selectedId ? "active" : "normal"})`}
          />
        ))}
      </svg>
      {ARCHITECTURE_STAGES.map((stage) => {
        const stageNodes = nodes.filter(
          (node) => node.category === stage.category,
        );
        return (
          <section
            className={`ap-stage-row ap-tone-${stage.category}`}
            key={stage.category}
            aria-label={tx(String(stage.title ?? ""))}
          >
            <div className="ap-stage-heading">
              <span className="ap-stage-number">{stage.number}</span>
              <div>
                <h3>{tx(String(stage.title ?? ""))}</h3>
                <p>{tx(String(stage.subtitle ?? ""))}</p>
              </div>
              <span className="ap-stage-count">{stageNodes.length}</span>
            </div>
            <div className="ap-stage-items">
              {stageNodes.length ? (
                stageNodes.map((node) => (
                  <button
                    type="button"
                    key={node.id}
                    ref={(element) => {
                      if (element) nodeRefs.current.set(node.id, element);
                      else nodeRefs.current.delete(node.id);
                    }}
                    aria-label={tx("Inspect {{name}}", { name: tx(node.label) })}
                    aria-pressed={selectedId === node.id}
                    className={`ap-node-card ${selectedId === node.id ? "is-selected" : ""}`}
                    onClick={() => onSelect(node.id)}
                  >
                    <span className="ap-node-meta">
                      <span className="ol-node-icon">
                        <ArchitectureItemIcon node={node} />
                      </span>
                      <small>{tx(String(stage.title ?? ""))}</small>
                      <span className="ap-node-dot" />
                    </span>
                    <strong>{tx(String(node.label ?? ""))}</strong>
                    <span className="ap-node-service">
                      {tx(String(node.serviceName ?? ""))}
                    </span>
                  </button>
                ))
              ) : (
                <button
                  type="button"
                  className="ap-empty-stage"
                  onClick={() => onAdd(stage.category)}
                >
                  <Plus size={15} />
                  <span>
                    {tx("Add component: {{category}}", { category: tx(stage.category) })}
                  </span>
                </button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
