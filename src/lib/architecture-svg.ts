import type { ArchitectureDiagram } from "./architecture";

const escapeXml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character]!,
  );
const stages = [
  "Data sources",
  "Ingestion",
  "OneLake storage",
  "Processing",
  "Analytics",
  "Governance",
];
const tones = [
  "#b7c2c9",
  "#83bcd8",
  "#7fc8b9",
  "#b5a1d4",
  "#8ed1a3",
  "#d7bc83",
];
function wrap(value: string, limit: number): string[] {
  const words = value
    .split(/\s+/)
    .flatMap((word) =>
      word.length > limit
        ? word.match(new RegExp(`.{1,${limit}}`, "g")) || []
        : [word],
    );
  const lines: string[] = [];
  for (const word of words) {
    const last = lines.length - 1;
    if (last < 0 || `${lines[last]} ${word}`.length > limit) lines.push(word);
    else lines[last] += ` ${word}`;
  }
  return lines;
}

/** Standalone SVG: every node, configured edge and XML-sensitive label is retained. */
export function generateArchitectureSVG(diagram: ArchitectureDiagram): string {
  const width = 1536,
    margin = 42,
    gap = 22,
    cardWidth = (width - margin * 2 - gap * 5) / 6;
  const titleLines = wrap(diagram.name, 96);
  const headerHeight = 98 + titleLines.length * 29;
  const labelLines = diagram.nodes.map((node) => wrap(node.label, 24).length);
  const serviceLines = diagram.nodes.map(
    (node) => wrap(node.serviceName, 30).length,
  );
  const cardHeight = Math.max(
    118,
    58 + Math.max(1, ...labelLines) * 17 + Math.max(1, ...serviceLines) * 13,
  );
  const counts = new Map<number, number>();
  const positions = new Map<string, { x: number; y: number }>();
  for (const node of diagram.nodes) {
    const tier = Math.max(1, Math.min(6, node.tier));
    const index = counts.get(tier) || 0;
    counts.set(tier, index + 1);
    positions.set(node.id, {
      x: margin + (tier - 1) * (cardWidth + gap),
      y: headerHeight + 73 + index * (cardHeight + 28),
    });
  }
  const height = Math.max(
    540,
    headerHeight +
      73 +
      Math.max(1, ...counts.values()) * (cardHeight + 28) +
      56,
  );
  const text = (
    value: string,
    x: number,
    y: number,
    className: string,
    limit: number,
    lineHeight: number,
  ) =>
    `<text x="${x}" y="${y}" class="${className}">${wrap(value, limit)
      .map(
        (line, index) =>
          `<tspan x="${x}" dy="${index ? lineHeight : 0}">${escapeXml(line)}</tspan>`,
      )
      .join("")}</text>`;
  const edges = diagram.connections
    .flatMap((edge) => {
      const source = positions.get(edge.from),
        target = positions.get(edge.to);
      if (!source || !target) return [];
      const sameColumn = source.x === target.x;
      let sx: number, sy: number, tx: number, ty: number, d: string;
      if (sameColumn) {
        const down = target.y > source.y;
        sx = source.x + cardWidth / 2;
        tx = target.x + cardWidth / 2;
        sy = source.y + (down ? cardHeight : 0);
        ty = target.y + (down ? 0 : cardHeight);
        d = `M${sx} ${sy} C${sx} ${(sy + ty) / 2},${tx} ${(sy + ty) / 2},${tx} ${ty}`;
      } else {
        const right = target.x > source.x;
        sx = source.x + (right ? cardWidth : 0);
        tx = target.x + (right ? 0 : cardWidth);
        sy = source.y + cardHeight / 2;
        ty = target.y + cardHeight / 2;
        d = `M${sx} ${sy} C${(sx + tx) / 2} ${sy},${(sx + tx) / 2} ${ty},${tx} ${ty}`;
      }
      return [
        `<path d="${d}" class="edge"><title>${escapeXml(edge.label || "Logical relationship")}</title></path>`,
      ];
    })
    .join("");
  const nodes = diagram.nodes
    .map((node) => {
      const position = positions.get(node.id)!;
      const labelHeight = wrap(node.label, 24).length * 17;
      const tone = tones[Math.max(0, Math.min(5, node.tier - 1))];
      return `<g transform="translate(${position.x} ${position.y})"><rect width="${cardWidth}" height="${cardHeight}" rx="9" fill="#171c1c" stroke="#34403c"/><rect x="14" y="15" width="6" height="6" rx="3" fill="${tone}"/><text x="28" y="21" class="category" fill="${tone}">${escapeXml(node.category.toUpperCase())}</text>${text(node.label, 14, 48, "label", 24, 17)}${text(node.serviceName, 14, 55 + labelHeight, "service", 30, 13)}</g>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(diagram.name)}"><title>${escapeXml(diagram.name)}</title><desc>${escapeXml(diagram.description)}</desc><style>text{font-family:Segoe UI,Arial,sans-serif}.label{fill:#edf3f1;font-size:13px;font-weight:500}.service{fill:#a1aeaa;font-size:10px}.category{font-size:8px;letter-spacing:1px}.edge{fill:none;stroke:#74b99f;stroke-width:1.2;opacity:.65;marker-end:url(#arrow)}</style><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10" fill="none" stroke="#74b99f" stroke-width="1.5"/></marker></defs><rect width="100%" height="100%" fill="#101414"/><text x="${margin}" y="39" fill="#74e2bd" font-size="10" letter-spacing="2">FABRIC MASTER / ARCHITECTURE DESIGN</text>${text(diagram.name, margin, 76, "label", 96, 29).replace('class="label"', 'class="label" style="font-size:24px"')}<text x="${margin}" y="${headerHeight - 17}" fill="#a1aeaa" font-size="11">${diagram.nodes.length} components · ${diagram.connections.length} logical relationships</text><path d="M${margin} ${headerHeight} H${width - margin}" stroke="#2b3332"/>${stages.map((stage, index) => `<text x="${margin + index * (cardWidth + gap)}" y="${headerHeight + 35}" fill="${tones[index]}" font-size="11">0${index + 1} / ${stage}</text>`).join("")}${edges}${nodes}<text x="${margin}" y="${height - 24}" fill="#82928c" font-size="10">Logical reference design · Fabric Master · Validate implementation assumptions before deployment</text></svg>`;
}
