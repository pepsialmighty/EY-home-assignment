import type { Relationship, ParentEntry } from '../types/person';

async function handleErrorResponse(res: Response): Promise<never> {
  const body = await res.json().catch(() => ({}));
  const message = body?.error?.message ?? `Request failed with status ${res.status}`;
  throw new Error(message);
}

export async function fetchParents(personId: number): Promise<ParentEntry[]> {
  const res = await fetch(`/api/people/${personId}/parents`);
  if (!res.ok) return handleErrorResponse(res);
  const body = await res.json();
  return body.data as ParentEntry[];
}

export async function createRelationship(dto: { parentId: number; childId: number }): Promise<Relationship> {
  const res = await fetch('/api/relationships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) return handleErrorResponse(res);
  const body = await res.json();
  return body.data as Relationship;
}

export async function deleteRelationship(id: number): Promise<void> {
  const res = await fetch(`/api/relationships/${id}`, { method: 'DELETE' });
  if (!res.ok) return handleErrorResponse(res);
}

export async function fetchAllRelationships(): Promise<Relationship[]> {
  const res = await fetch('/api/relationships');
  if (!res.ok) return handleErrorResponse(res);
  const body = await res.json();
  return body.data as Relationship[];
}
