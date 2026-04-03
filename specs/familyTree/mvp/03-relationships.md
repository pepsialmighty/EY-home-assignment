# Spec: Relationships

**Slice:** 3 of 8 — `planning/familyTree/mvp/slices.md`

## Behavior

Users can assign parent-child relationships and remove them. All domain validation rules are enforced server-side. The UI has a dedicated `/add-relationship` page with parent and child dropdowns for creating relationships. Each person's card on the home view displays their parents as secondary text and their children as removable pill tags; clicking `×` on a child pill triggers an inline confirmation before removing the relationship. Validation errors are shown inline.

## Business Rules

- A person can have at most 2 parents
- A parent must be at least 15 years older than their child (based on date of birth)
- A relationship must not create a cycle (a person cannot be their own ancestor)
- A person cannot be their own parent
- Relationships are directional: `parent → child`

## Edge Cases

- Adding a 3rd parent: rejected
- Parent is exactly 14 years and 364 days older: rejected
- Parent is exactly 15 years older (to the day): accepted
- Person A is parent of B, B is parent of C — assigning C as parent of A: rejected (cycle)
- Person assigned as their own parent: rejected
- Either person not found: `404`

## Validation

- Person already has 2 parents (Domain): `400 { error: "A person can have at most 2 parents" }`
- Age gap less than 15 years (Domain): `400 { error: "A parent must be at least 15 years older than their child" }`
- Relationship creates a cycle (Domain): `400 { error: "This relationship would create a cycle" }`
- Parent and child are the same person (Domain): `400 { error: "A person cannot be their own parent" }`
- Person not found (Technical): `404 { error: "Person not found" }`
- Relationship already exists (Domain): `409 { error: "This relationship already exists" }`

## Domain Models

- **Relationship** — a parent-child link between two people
  - `id` (number): auto-incremented primary key
  - `parentId` (number): foreign key → `Person.id`
  - `childId` (number): foreign key → `Person.id`

## API Surface

- `GET /api/relationships`
  - Response: `Relationship[]`
  - Behavior: returns all relationships; used by the home view to derive parents and children for each person card

- `GET /api/people/:id/parents`
  - Response: `Person[]`
  - Behavior: returns the parents of the given person

- `POST /api/relationships`
  - Request: `{ parentId, childId }`
  - Response: `Relationship`
  - Behavior: creates the relationship after all validations pass

- `DELETE /api/relationships/:id`
  - Response: `204 No Content`
  - Behavior: removes the relationship

## Success Criteria

- All four endpoints exist and return correct status codes
- All five validation rules are enforced server-side
- Cycle detection works for chains of arbitrary depth
- UI home view shows each person's parents as secondary text
- UI home view shows each person's children as pill tags with `×` remove buttons
- Clicking `×` on a child pill shows an inline confirmation before calling the delete API
- `/add-relationship` page allows selecting a parent and child from dropdowns; people with 2 parents are excluded from the child dropdown
- UI shows server validation errors inline
- Integration tests cover all validation rules including cycle detection edge cases
- Unit tests cover the cycle detection algorithm exhaustively
