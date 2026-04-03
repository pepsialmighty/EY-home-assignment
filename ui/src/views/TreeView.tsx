import { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
} from "@xyflow/react";
import type { NodeProps, Node, Edge, EdgeProps, Connection } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTreeData } from "../api/useTreeData";
import { useCreateRelationship, useDeleteRelationship } from "../api/useRelationships";
import { useToast } from "../context/ToastContext";

function PersonNode({ data }: NodeProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm min-w-[140px]">
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <div className="font-medium text-gray-900 text-sm">
        {data.label as string}
      </div>
      <div className="text-xs text-gray-400 mt-0.5">
        {data.dateOfBirth as string}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400"
      />
    </div>
  );
}

function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
}: EdgeProps) {
  const deleteRelationship = useDeleteRelationship();
  const { showToast } = useToast();

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  function handleDelete() {
    const relId = (data as { relationshipId: number }).relationshipId;
    deleteRelationship.mutate(relId, {
      onSuccess: () => showToast("Relationship removed"),
      onError: (err) =>
        showToast(err instanceof Error ? err.message : "Failed to remove relationship"),
    });
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} />
      <EdgeLabelRenderer>
        <button
          onClick={handleDelete}
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }}
          className="absolute pointer-events-auto w-5 h-5 rounded-full bg-white border border-gray-300 text-gray-400 text-xs leading-none flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors nodrag nopan"
          title="Remove relationship"
        >
          ×
        </button>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes = { person: PersonNode };
const edgeTypes = { deletable: DeletableEdge };

// Assigns x/y positions to nodes using a simple top-down hierarchical layout.
function applyTreeLayout(nodes: Node[], edges: Edge[]): Node[] {
  const NODE_W = 200;
  const NODE_H = 110;

  const childrenMap = new Map<string, string[]>();
  for (const n of nodes) childrenMap.set(n.id, []);
  for (const e of edges) childrenMap.get(e.source)?.push(e.target);

  const hasParent = new Set(edges.map((e) => e.target));
  const roots = nodes.filter((n) => !hasParent.has(n.id));

  const positions = new Map<string, { x: number; y: number }>();

  // Returns the width (in node units) consumed by this subtree.
  function place(id: string, depth: number, left: number): number {
    const kids = childrenMap.get(id) ?? [];
    if (kids.length === 0) {
      positions.set(id, { x: left * NODE_W, y: depth * NODE_H });
      return 1;
    }
    let width = 0;
    for (const kid of kids) width += place(kid, depth + 1, left + width);
    // Centre this node over its children.
    positions.set(id, {
      x: (left + width / 2 - 0.5) * NODE_W,
      y: depth * NODE_H,
    });
    return width;
  }

  let offset = 0;
  for (const root of roots) offset += place(root.id, 0, offset);

  return nodes.map((n) => ({
    ...n,
    position: positions.get(n.id) ?? { x: 0, y: 0 },
  }));
}

function getLineage(rootId: string, allNodes: Node[], allEdges: Edge[]) {
  const visited = new Set([rootId]);
  const queue = [rootId];
  while (queue.length) {
    const id = queue.shift()!;
    for (const e of allEdges) {
      if (e.source === id && !visited.has(e.target)) {
        visited.add(e.target);
        queue.push(e.target);
      }
    }
  }
  return {
    nodes: allNodes.filter((n) => visited.has(n.id)),
    edges: allEdges.filter(
      (e) => visited.has(e.source) && visited.has(e.target),
    ),
  };
}

export function TreeView() {
  const { data, isLoading, error } = useTreeData();
  const [selectedRootId, setSelectedRootId] = useState<string | null>(null);
  const createRelationship = useCreateRelationship();
  const { showToast } = useToast();

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      createRelationship.mutate(
        {
          parentId: parseInt(connection.source, 10),
          childId: parseInt(connection.target, 10),
        },
        {
          onSuccess: () => showToast("Relationship added"),
          onError: (err) =>
            showToast(err instanceof Error ? err.message : "Failed to add relationship"),
        },
      );
    },
    [createRelationship, showToast],
  );

  const rootAncestors = useMemo(() => {
    if (!data) return [];
    const childIds = new Set(data.relationships.map((r) => String(r.childId)));
    const parentIds = new Set(
      data.relationships.map((r) => String(r.parentId)),
    );
    // Only include people who have children but no parents — actual lineage roots.
    // Unconnected people (no relationships at all) are excluded since they have no lineage to show.
    return data.people.filter(
      (p) => !childIds.has(String(p.id)) && parentIds.has(String(p.id)),
    );
  }, [data]);

  const effectiveRootId = useMemo(() => {
    if (!rootAncestors.length) return null;
    const id = String(rootAncestors[0].id);
    if (
      selectedRootId &&
      rootAncestors.some((p) => String(p.id) === selectedRootId)
    ) {
      return selectedRootId;
    }
    return id;
  }, [rootAncestors, selectedRootId]);

  const { nodes: filteredNodes, edges: filteredEdges } = useMemo(() => {
    if (!data || !effectiveRootId)
      return { nodes: data?.nodes ?? [], edges: data?.edges ?? [] };
    const lineage = getLineage(effectiveRootId, data.nodes, data.edges);
    const typedEdges = lineage.edges.map((e) => ({
      ...e,
      type: "deletable",
      style: { stroke: "#9ca3af" },
    }));
    const typedNodes = lineage.nodes.map((n) => ({ ...n, type: "person" }));
    return {
      nodes: applyTreeLayout(typedNodes, typedEdges),
      edges: typedEdges,
    };
  }, [data, effectiveRootId]);

  if (isLoading) return <p>Loading tree…</p>;
  if (error) return <p>Failed to load tree.</p>;

  if (!data || data.nodes.length === 0) {
    return (
      <p data-testid="empty-tree">
        No people yet. Add some in People tab using the Add Person button to see
        their lineage.
      </p>
    );
  }

  if (rootAncestors.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No root ancestors found. Add relationships between people to see their
        lineage here.
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Select a founding ancestor to explore their lineage. Drag from a node's
        bottom handle to another node's top handle to add a relationship. Click
        × on an edge to remove it.
      </p>

      <div className="mb-4">
        <label
          htmlFor="root-ancestor"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          View lineage from
        </label>
        <select
          id="root-ancestor"
          value={effectiveRootId ?? ""}
          onChange={(e) => setSelectedRootId(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 cursor-pointer transition-colors"
        >
          {rootAncestors.map((p) => (
            <option key={p.id} value={String(p.id)}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div
        data-testid="tree-view"
        className="h-[600px] w-full rounded-xl border border-gray-200 overflow-hidden"
      >
        <ReactFlow
          nodes={filteredNodes}
          edges={filteredEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
