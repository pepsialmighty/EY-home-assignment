import { useQuery } from '@tanstack/react-query';
import type { Node, Edge } from '@xyflow/react';
import { fetchPeople } from './people';
import { fetchAllRelationships } from './relationships';

export interface TreeData {
  nodes: Node[];
  edges: Edge[];
}

async function fetchTreeData(): Promise<TreeData> {
  const [people, relationships] = await Promise.all([
    fetchPeople(),
    fetchAllRelationships(),
  ]);

  const nodes: Node[] = people.map((person) => ({
    id: String(person.id),
    data: { label: person.name },
    position: { x: 0, y: 0 },
  }));

  const edges: Edge[] = relationships.map((rel) => ({
    id: `e${rel.parentId}-${rel.childId}`,
    source: String(rel.parentId),
    target: String(rel.childId),
  }));

  return { nodes, edges };
}

export function useTreeData() {
  return useQuery({ queryKey: ['tree'], queryFn: fetchTreeData });
}
