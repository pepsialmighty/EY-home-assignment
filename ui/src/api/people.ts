import { Person, PersonDto } from '../types/person';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.error?.message ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  const body = await res.json();
  return body.data as T;
}

export async function fetchPeople(): Promise<Person[]> {
  const res = await fetch('/api/people');
  return handleResponse<Person[]>(res);
}

export async function createPerson(dto: PersonDto): Promise<Person> {
  const res = await fetch('/api/people', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  return handleResponse<Person>(res);
}

export async function updatePerson(id: number, dto: PersonDto): Promise<Person> {
  const res = await fetch(`/api/people/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  return handleResponse<Person>(res);
}

export async function deletePerson(id: number): Promise<void> {
  const res = await fetch(`/api/people/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.error?.message ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }
}
