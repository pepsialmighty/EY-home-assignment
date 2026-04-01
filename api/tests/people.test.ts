import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Person } from '../src/models/person';

// Prevent node:sqlite from loading — app.ts now also mounts relationshipRoutes
vi.mock('../src/db/relationshipDb', () => ({
  getParentsOf: () => [],
  getChildrenOf: () => [],
  getParentCount: () => 0,
  getRelationshipById: () => undefined,
  createRelationship: () => { throw new Error('not used in people tests'); },
  deleteRelationship: () => {},
  getAllAncestorIds: () => new Set(),
}));

// Mock personDb with an in-memory store — avoids importing node:sqlite in tests
const store: { people: Person[]; nextId: number } = { people: [], nextId: 1 };

vi.mock('../src/db/personDb', () => ({
  getAllPeople: () => [...store.people].sort((a, b) => a.name.localeCompare(b.name)),
  getPersonById: (id: number) => store.people.find((p) => p.id === id),
  createPerson: (dto: { name: string; dateOfBirth: string; placeOfBirth?: string }) => {
    const person: Person = {
      id: store.nextId++,
      name: dto.name,
      dateOfBirth: dto.dateOfBirth,
      placeOfBirth: dto.placeOfBirth ?? null,
    };
    store.people.push(person);
    return person;
  },
  updatePerson: (id: number, dto: { name: string; dateOfBirth: string; placeOfBirth?: string }) => {
    const idx = store.people.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    store.people[idx] = { ...store.people[idx], ...dto, placeOfBirth: dto.placeOfBirth ?? null };
    return store.people[idx];
  },
  deletePerson: (id: number) => {
    const idx = store.people.findIndex((p) => p.id === id);
    if (idx !== -1) store.people.splice(idx, 1);
  },
}));

const { default: app } = await import('../src/app');
const { default: request } = await import('supertest');

describe('People API', () => {
  beforeEach(() => {
    store.people = [];
    store.nextId = 1;
  });

  describe('POST /api/people', () => {
    it('creates a person with valid payload', async () => {
      const res = await request(app)
        .post('/api/people')
        .send({ name: 'Alice', dateOfBirth: '1990-01-01', placeOfBirth: 'London' });
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Alice');
      expect(res.body.data.dateOfBirth).toBe('1990-01-01');
      expect(res.body.data.placeOfBirth).toBe('London');
    });

    it('creates a person without placeOfBirth (optional)', async () => {
      const res = await request(app)
        .post('/api/people')
        .send({ name: 'Bob', dateOfBirth: '1985-06-15' });
      expect(res.status).toBe(201);
      expect(res.body.data.placeOfBirth).toBeNull();
    });

    it('rejects missing name', async () => {
      const res = await request(app)
        .post('/api/people')
        .send({ dateOfBirth: '1990-01-01' });
      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/name/i);
    });

    it('rejects blank name after trim', async () => {
      const res = await request(app)
        .post('/api/people')
        .send({ name: '   ', dateOfBirth: '1990-01-01' });
      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/name/i);
    });

    it('rejects missing dateOfBirth', async () => {
      const res = await request(app)
        .post('/api/people')
        .send({ name: 'Alice' });
      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/date/i);
    });

    it('rejects future dateOfBirth', async () => {
      const res = await request(app)
        .post('/api/people')
        .send({ name: 'Alice', dateOfBirth: '2099-01-01' });
      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/future/i);
    });

    it('accepts today as dateOfBirth', async () => {
      const today = new Date().toISOString().split('T')[0];
      const res = await request(app)
        .post('/api/people')
        .send({ name: 'Alice', dateOfBirth: today });
      expect(res.status).toBe(201);
    });
  });

  describe('GET /api/people', () => {
    it('returns empty array when no people', async () => {
      const res = await request(app).get('/api/people');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('returns all people', async () => {
      await request(app).post('/api/people').send({ name: 'Alice', dateOfBirth: '1990-01-01' });
      await request(app).post('/api/people').send({ name: 'Bob', dateOfBirth: '1985-01-01' });
      const res = await request(app).get('/api/people');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('PUT /api/people/:id', () => {
    it('updates an existing person', async () => {
      const created = await request(app)
        .post('/api/people')
        .send({ name: 'Alice', dateOfBirth: '1990-01-01' });
      const id = created.body.data.id;

      const res = await request(app)
        .put(`/api/people/${id}`)
        .send({ name: 'Alice Updated', dateOfBirth: '1990-01-01' });
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Alice Updated');
    });

    it('returns 404 for unknown id', async () => {
      const res = await request(app)
        .put('/api/people/99999')
        .send({ name: 'Ghost', dateOfBirth: '1990-01-01' });
      expect(res.status).toBe(404);
    });

    it('rejects future dateOfBirth on update', async () => {
      const created = await request(app)
        .post('/api/people')
        .send({ name: 'Alice', dateOfBirth: '1990-01-01' });
      const id = created.body.data.id;

      const res = await request(app)
        .put(`/api/people/${id}`)
        .send({ name: 'Alice', dateOfBirth: '2099-01-01' });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/people/:id', () => {
    it('deletes an existing person', async () => {
      const created = await request(app)
        .post('/api/people')
        .send({ name: 'Alice', dateOfBirth: '1990-01-01' });
      const id = created.body.data.id;

      const res = await request(app).delete(`/api/people/${id}`);
      expect(res.status).toBe(204);

      const list = await request(app).get('/api/people');
      expect(list.body.data).toHaveLength(0);
    });

    it('returns 404 for unknown id', async () => {
      const res = await request(app).delete('/api/people/99999');
      expect(res.status).toBe(404);
    });
  });
});
