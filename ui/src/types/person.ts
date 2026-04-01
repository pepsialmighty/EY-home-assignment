export interface Person {
  id: number;
  name: string;
  dateOfBirth: string;
  placeOfBirth: string | null;
}

export interface PersonDto {
  name: string;
  dateOfBirth: string;
  placeOfBirth?: string;
}

export interface Relationship {
  id: number;
  parentId: number;
  childId: number;
}

export interface ParentEntry {
  relationshipId: number;
  person: Person;
}
