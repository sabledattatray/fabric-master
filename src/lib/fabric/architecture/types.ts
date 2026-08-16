export type ArchitectureNodeType = 
  | "onelake"
  | "lakehouse"
  | "warehouse"
  | "eventhouse"
  | "semantic-model"
  | "power-bi"
  | "data-factory"
  | "spark"
  | "eventstream"
  | "kql-database";

export type ArchitectureNode = {
  id: string;
  type: ArchitectureNodeType;
  label: string;
  name?: string;
  layer?: "bronze" | "silver" | "gold" | "serving";
  description?: string;
};

export type ArchitectureEdge = {
  source: string;
  target: string;
  relationship: string;
};

export type ArchitectureDiagram = {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
};
