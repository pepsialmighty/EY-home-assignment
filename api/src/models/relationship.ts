export interface Relationship {
  id: number;
  parentId: number;
  childId: number;
}

export interface CreateRelationshipDto {
  parentId: number;
  childId: number;
}
