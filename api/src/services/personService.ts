import { AppError } from '../middleware/errorHandler';
import { Person, CreatePersonDto, UpdatePersonDto } from '../models/person';
import * as personDb from '../db/personDb';

export function getAllPeople(): Person[] {
  return personDb.getAllPeople();
}

export function createPerson(dto: CreatePersonDto): Person {
  return personDb.createPerson(dto);
}

export function updatePerson(id: number, dto: UpdatePersonDto): Person {
  const existing = personDb.getPersonById(id);
  if (!existing) {
    throw new AppError(404, 'Person not found');
  }
  const updated = personDb.updatePerson(id, dto);
  if (!updated) throw new AppError(404, 'Person not found');
  return updated;
}

export function deletePerson(id: number): void {
  const existing = personDb.getPersonById(id);
  if (!existing) {
    throw new AppError(404, 'Person not found');
  }
  personDb.deletePerson(id);
}
