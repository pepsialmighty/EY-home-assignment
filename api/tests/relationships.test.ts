import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Person } from '../src/models/person';
import type { Relationship } from '../src/models/relationship';

// ── In-memory stores ──────────────────────────────────────────────────────────

const personStore: { items: Person[]; nextId: number } = { items: [], nextId: 1 };
const relStore: { items: Relationship[]; nextId: number } = { items: [], nextId: 1 };

// ── Mock personDb ─────────────────────────────────────────────────────────────

vi.mock('../src/db/personDb', () => ({
  getAllPeople: () => [...personStore.items],
  getPersonById: (id: number) => personStore.items.find((p) => p.id === id),
  createPerson: (dto: { name: string; dateOfBirth: string; placeOfBirth?: string }) => {
    const person: Person = {
      id: personStore.nextId++,
      name: dto.name,
      dateOfBirth: dto.dateOfBirth,
      placeOfBirth: dto.placeOfBirth ?? null,
    };
    personStore.items.push(person);
    return person;
  },
  updatePerson: (id: number, dto: { name: string; dateOfBirth: string; placeOfBirth?: string }) => {
    const idx = personStore.items.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    personStore.items[idx] = { ...personStore.items[idx], ...dto, placeOfBirth: dto.placeOfBirth ?? null };
    return personStore.items[idx];
  },
  deletePerson: (id: number) => {
    const idx = personStore.items.findIndex((p) => p.id === id);
    if (idx !== -1) personStore.items.splice(idx, 1);
  },
}));

// ── Mock relationshipDb ───────────────────────────────────────────────────────

vi.mock('../src/db/relationshipDb', () => ({
  getParentsOf: (childId: number) => {
    return relStore.items
      .filter((r) => r.childId === childId)
      .map((r) => {
        const person = personStore.items.find((p) => p.id === r.parentId)!;
        return { relationshipId: r.id, person };
      });
  },
  getChildrenOf: (parentId: number) =>
    relStore.items
      .filter((r) => r.parentId === parentId)
      .map((r) => personStore.items.find((p) => p.id === r.childId)!),
  getParentCount: (childId: number) =>
    relStore.items.filter((r) => r.childId === childId).length,
  getRelationshipById: (id: number) => relStore.items.find((r) => r.id === id),
  createRelationship: (dto: { parentId: number; childId: number }) => {
    // Simulate UNIQUE constraint
    const exists = relStore.items.some(
      (r) => r.parentId === dto.parentId && r.childId === dto.childId
    );
    if (exists) throw new Error('UNIQUE constraint failed: relationships.parent_id, relationships.child_id');
    const rel: Relationship = { id: relStore.nextId++, parentId: dto.parentId, childId: dto.childId };
    relStore.items.push(rel);
    return rel;
  },
  deleteRelationship: (id: number) => {
    const idx = relStore.items.findIndex((r) => r.id === id);
    if (idx !== -1) relStore.items.splice(idx, 1);
  },
  getAllAncestorIds: (personId: number) => {
    const ancestors = new Set<number>();
    const queue: number[] = [personId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const r of relStore.items.filter((r) => r.childId === current)) {
        if (!ancestors.has(r.parentId)) {
          ancestors.add(r.parentId);
          queue.push(r.parentId);
        }
      }
    }
    return ancestors;
  },
}));

const { default: app } = await import('../src/app');
const { default: request } = await import('supertest');

// ── Helpers ───────────────────────────────────────────────────────────────────

async function addPerson(name: string, dateOfBirth: string) {
  const res = await request(app).post('/api/people').send({ name, dateOfBirth });
  return res.body.data as Person;
}

async function addRelationship(parentId: number, childId: number) {
  return request(app).post('/api/relationships').send({ parentId, childId });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Relationships API', () => {
  beforeEach(() => {
    personStore.items = [];
    personStore.nextId = 1;
    relStore.items = [];
    relStore.nextId = 1;
  });

  describe('POST /api/relationships', () => {
    it('creates a valid relationship', async () => {
      const parent = await addPerson('Parent', '1960-01-01');
      const child = await addPerson('Child', '1990-01-01');
      const res = await addRelationship(parent.id, child.id);
      expect(res.status).toBe(201);
      expect(res.body.data.parentId).toBe(parent.id);
      expect(res.body.data.childId).toBe(child.id);
    });

    it('rejects when child already has 2 parents', async () => {
      const p1 = await addPerson('Parent1', '1960-01-01');
      const p2 = await addPerson('Parent2', '1961-01-01');
      const child = await addPerson('Child', '1990-01-01');
      await addRelationship(p1.id, child.id);
      await addRelationship(p2.id, child.id);
      const res = await addRelationship((await addPerson('Parent3', '1962-01-01')).id, child.id);
      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/2 parents/i);
    });

    it('rejects when parent is less than 15 years older (14y 364d)', async () => {
      // Child born exactly 1 day before parent's DOB + 15 years
      const parent = await addPerson('Parent', '1960-06-15');
      const child = await addPerson('Child', '1975-06-14'); // 14y 364d gap
      const res = await addRelationship(parent.id, child.id);
      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/15 years/i);
    });

    it('accepts when parent is exactly 15 years older (to the day)', async () => {
      const parent = await addPerson('Parent', '1960-06-15');
      const child = await addPerson('Child', '1975-06-15'); // exactly 15 years
      const res = await addRelationship(parent.id, child.id);
      expect(res.status).toBe(201);
    });

    it('rejects same person as parent and child', async () => {
      const person = await addPerson('Person', '1980-01-01');
      const res = await addRelationship(person.id, person.id);
      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/own parent/i);
    });

    it('rejects duplicate relationship', async () => {
      const parent = await addPerson('Parent', '1960-01-01');
      const child = await addPerson('Child', '1990-01-01');
      await addRelationship(parent.id, child.id);
      const res = await addRelationship(parent.id, child.id);
      expect(res.status).toBe(409);
      expect(res.body.error.message).toMatch(/already exists/i);
    });

    it('rejects direct cycle (A parent of B, B parent of A)', async () => {
      const a = await addPerson('A', '1960-01-01');
      const b = await addPerson('B', '1990-01-01');
      await addRelationship(a.id, b.id); // A → B
      const res = await addRelationship(b.id, a.id); // B → A (cycle)
      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/cycle/i);
    });

    it('rejects indirect cycle (A→B→C, assign C parent of A)', async () => {
      const a = await addPerson('A', '1930-01-01');
      const b = await addPerson('B', '1950-01-01');
      const c = await addPerson('C', '1970-01-01');
      await addRelationship(a.id, b.id); // A → B
      await addRelationship(b.id, c.id); // B → C
      const res = await addRelationship(c.id, a.id); // C → A (cycle)
      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/cycle/i);
    });

    it('returns 404 when parent person not found', async () => {
      const child = await addPerson('Child', '1990-01-01');
      const res = await addRelationship(99999, child.id);
      expect(res.status).toBe(404);
    });

    it('returns 404 when child person not found', async () => {
      const parent = await addPerson('Parent', '1960-01-01');
      const res = await addRelationship(parent.id, 99999);
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/relationships/:id', () => {
    it('deletes an existing relationship', async () => {
      const parent = await addPerson('Parent', '1960-01-01');
      const child = await addPerson('Child', '1990-01-01');
      const created = await addRelationship(parent.id, child.id);
      const res = await request(app).delete(`/api/relationships/${created.body.data.id}`);
      expect(res.status).toBe(204);
    });

    it('returns 404 for unknown relationship', async () => {
      const res = await request(app).delete('/api/relationships/99999');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/people/:id/parents', () => {
    it('returns the correct parents for a person', async () => {
      const parent = await addPerson('Parent', '1960-01-01');
      const child = await addPerson('Child', '1990-01-01');
      await addRelationship(parent.id, child.id);

      const res = await request(app).get(`/api/people/${child.id}/parents`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].person.name).toBe('Parent');
      expect(res.body.data[0].relationshipId).toBeDefined();
    });

    it('returns empty array when person has no parents', async () => {
      const person = await addPerson('Person', '1990-01-01');
      const res = await request(app).get(`/api/people/${person.id}/parents`);
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });
});
