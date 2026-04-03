import { useQuery } from '@tanstack/react-query';
import type { Node, Edge } from '@xyflow/react';
import { fetchPeople } from './people';
import { fetchAllRelationships } from './relationships';
import type { Person, Relationship } from '../types/person';

export interface TreeData {
  nodes: Node[];
  edges: Edge[];
  people: Person[];
  relationships: Relationship[];
}

async function fetchTreeData(): Promise<TreeData> {
  const [people, relationships] = await Promise.all([
    fetchPeople(),
    fetchAllRelationships(),
  ]);

  const nodes: Node[] = people.map((person) => ({
    id: String(person.id),
    data: { label: person.name, dateOfBirth: person.dateOfBirth },
    position: { x: 0, y: 0 },
  }));

  const edges: Edge[] = relationships.map((rel) => ({
    id: `e${rel.parentId}-${rel.childId}`,
    source: String(rel.parentId),
    target: String(rel.childId),
    // relationshipId carried in data so TreeView can call DELETE /api/relationships/:id
    data: { relationshipId: rel.id },
  }));

  return { nodes, edges, people, relationships };
}

export function useTreeData() {
  return useQuery({ queryKey: ['tree'], queryFn: fetchTreeData });
}
