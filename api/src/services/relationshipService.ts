import * as personDb from '../db/personDb';
import * as relationshipDb from '../db/relationshipDb';
import { ParentEntry } from '../db/relationshipDb';
import { AppError } from '../middleware/errorHandler';
import { CreateRelationshipDto, Relationship } from '../models/relationship';

const MIN_PARENT_AGE_DIFF_YEARS = 15;
const MAX_PARENTS = 2;

export function getAllRelationships(): Relationship[] {
  return relationshipDb.getAllRelationships();
}

export function getParentsOf(childId: number): ParentEntry[] {
  return relationshipDb.getParentsOf(childId);
}

export function createRelationship(dto: CreateRelationshipDto): Relationship {
  const parent = personDb.getPersonById(dto.parentId);
  if (!parent) throw new AppError(404, 'Parent person not found');

  const child = personDb.getPersonById(dto.childId);
  if (!child) throw new AppError(404, 'Child person not found');

  if (dto.parentId === dto.childId) {
    throw new AppError(400, 'A person cannot be their own parent');
  }

  if (relationshipDb.getParentCount(dto.childId) >= MAX_PARENTS) {
    throw new AppError(400, 'A person can have at most 2 parents');
  }

  // Cycle check before age gap: structural integrity takes precedence.
  // A cycle would always fail the age gap check too (the "parent" would be younger),
  // but reporting "cycle" is more informative than "age gap".
  const ancestorsOfParent = relationshipDb.getAllAncestorIds(dto.parentId);
  if (ancestorsOfParent.has(dto.childId)) {
    throw new AppError(400, 'This relationship would create a cycle');
  }

  // Age gap check: child's DOB must be at least 15 years after parent's DOB (to the day)
  const parentDob = new Date(parent.dateOfBirth);
  const minChildDob = new Date(parentDob);
  minChildDob.setFullYear(minChildDob.getFullYear() + MIN_PARENT_AGE_DIFF_YEARS);
  if (new Date(child.dateOfBirth) < minChildDob) {
    throw new AppError(400, 'A parent must be at least 15 years older than their child');
  }

  try {
    return relationshipDb.createRelationship(dto);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('UNIQUE constraint failed')) {
      throw new AppError(409, 'This relationship already exists');
    }
    throw err;
  }
}

export function deleteRelationship(id: number): void {
  const existing = relationshipDb.getRelationshipById(id);
  if (!existing) throw new AppError(404, 'Relationship not found');
  relationshipDb.deleteRelationship(id);
}
