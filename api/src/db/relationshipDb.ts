import db from './database';
import { Person } from '../models/person';
import { Relationship, CreateRelationshipDto } from '../models/relationship';

export interface ParentEntry {
  relationshipId: number;
  person: Person;
}

export function getParentsOf(childId: number): ParentEntry[] {
  const stmt = db.prepare(`
    SELECT r.id AS relationshipId,
           p.id, p.name, p.date_of_birth AS dateOfBirth, p.place_of_birth AS placeOfBirth
    FROM people p
    JOIN relationships r ON r.parent_id = p.id
    WHERE r.child_id = ?
  `);
  const rows = stmt.all(childId) as unknown as Array<{ relationshipId: number; id: number; name: string; dateOfBirth: string; placeOfBirth: string | null }>;
  return rows.map(({ relationshipId, ...person }) => ({ relationshipId, person }));
}

export function getChildrenOf(parentId: number): Person[] {
  const stmt = db.prepare(`
    SELECT p.id, p.name, p.date_of_birth AS dateOfBirth, p.place_of_birth AS placeOfBirth
    FROM people p
    JOIN relationships r ON r.child_id = p.id
    WHERE r.parent_id = ?
  `);
  return stmt.all(parentId) as unknown as Person[];
}

export function getParentCount(childId: number): number {
  const stmt = db.prepare('SELECT COUNT(*) AS cnt FROM relationships WHERE child_id = ?');
  const row = stmt.get(childId) as unknown as { cnt: number };
  return row.cnt;
}

export function createRelationship(dto: CreateRelationshipDto): Relationship {
  const stmt = db.prepare('INSERT INTO relationships (parent_id, child_id) VALUES (?, ?)');
  const result = stmt.run(dto.parentId, dto.childId) as { lastInsertRowid: number };
  return getRelationshipById(result.lastInsertRowid) as Relationship;
}

export function deleteRelationship(id: number): void {
  const stmt = db.prepare('DELETE FROM relationships WHERE id = ?');
  stmt.run(id);
}

export function getRelationshipById(id: number): Relationship | undefined {
  const stmt = db.prepare('SELECT id, parent_id AS parentId, child_id AS childId FROM relationships WHERE id = ?');
  return stmt.get(id) as unknown as Relationship | undefined;
}

// Walks the relationships table upward recursively to collect all ancestor IDs.
// Used for cycle detection before inserting a new parent-child relationship.
export function getAllAncestorIds(personId: number): Set<number> {
  const ancestors = new Set<number>();
  const queue: number[] = [personId];

  const stmt = db.prepare('SELECT parent_id AS parentId FROM relationships WHERE child_id = ?');

  while (queue.length > 0) {
    const current = queue.shift()!;
    const rows = stmt.all(current) as unknown as { parentId: number }[];
    for (const row of rows) {
      if (!ancestors.has(row.parentId)) {
        ancestors.add(row.parentId);
        queue.push(row.parentId);
      }
    }
  }

  return ancestors;
}
