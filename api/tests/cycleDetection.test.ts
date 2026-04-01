import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Relationship } from '../src/models/relationship';

// ── In-memory relationship store for unit testing getAllAncestorIds ────────────

const relStore: { items: Relationship[]; nextId: number } = { items: [], nextId: 1 };

vi.mock('../src/db/database', () => ({
  default: {
    prepare: (sql: string) => ({
      all: (id: number) => {
        // Only supports the ancestor-walk query: SELECT parent_id AS parentId FROM relationships WHERE child_id = ?
        return relStore.items
          .filter((r) => r.childId === id)
          .map((r) => ({ parentId: r.parentId }));
      },
    }),
  },
}));

const { getAllAncestorIds } = await import('../src/db/relationshipDb');

function addRelationship(parentId: number, childId: number) {
  relStore.items.push({ id: relStore.nextId++, parentId, childId });
}

describe('getAllAncestorIds', () => {
  beforeEach(() => {
    relStore.items = [];
    relStore.nextId = 1;
  });

  it('returns empty set for a node with no parents', () => {
    const result = getAllAncestorIds(1);
    expect(result.size).toBe(0);
  });

  it('returns direct parent', () => {
    addRelationship(1, 2); // 1 → 2
    const result = getAllAncestorIds(2);
    expect(result).toEqual(new Set([1]));
  });

  it('linear chain A→B→C: ancestors of C = {A, B}', () => {
    addRelationship(1, 2); // A → B
    addRelationship(2, 3); // B → C
    const result = getAllAncestorIds(3);
    expect(result).toEqual(new Set([1, 2]));
  });

  it('diamond: A is parent of B and C, B and C are parents of D: ancestors of D = {A, B, C}', () => {
    addRelationship(1, 2); // A → B
    addRelationship(1, 3); // A → C
    addRelationship(2, 4); // B → D
    addRelationship(3, 4); // C → D
    const result = getAllAncestorIds(4);
    expect(result).toEqual(new Set([1, 2, 3]));
  });

  it('large chain of 10 nodes: correct ancestor set returned', () => {
    // 1 → 2 → 3 → ... → 10
    for (let i = 1; i < 10; i++) {
      addRelationship(i, i + 1);
    }
    const result = getAllAncestorIds(10);
    expect(result).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]));
  });
});
