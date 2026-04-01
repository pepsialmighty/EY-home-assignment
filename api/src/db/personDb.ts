import db from './database';
import { Person, CreatePersonDto, UpdatePersonDto } from '../models/person';

export function getAllPeople(): Person[] {
  const stmt = db.prepare('SELECT id, name, date_of_birth AS dateOfBirth, place_of_birth AS placeOfBirth FROM people ORDER BY name');
  return stmt.all() as unknown as Person[];
}

export function getPersonById(id: number): Person | undefined {
  const stmt = db.prepare('SELECT id, name, date_of_birth AS dateOfBirth, place_of_birth AS placeOfBirth FROM people WHERE id = ?');
  return stmt.get(id) as unknown as Person | undefined;
}

export function createPerson(dto: CreatePersonDto): Person {
  const stmt = db.prepare('INSERT INTO people (name, date_of_birth, place_of_birth) VALUES (?, ?, ?)');
  const result = stmt.run(dto.name, dto.dateOfBirth, dto.placeOfBirth ?? null) as { lastInsertRowid: number };
  return getPersonById(result.lastInsertRowid) as Person;
}

export function updatePerson(id: number, dto: UpdatePersonDto): Person | undefined {
  const stmt = db.prepare('UPDATE people SET name = ?, date_of_birth = ?, place_of_birth = ? WHERE id = ?');
  stmt.run(dto.name, dto.dateOfBirth, dto.placeOfBirth ?? null, id);
  return getPersonById(id);
}

export function deletePerson(id: number): void {
  const stmt = db.prepare('DELETE FROM people WHERE id = ?');
  stmt.run(id);
}
