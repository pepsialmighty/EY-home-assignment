# Spec: Person Management

**Slice:** 2 of 8 — `planning/familyTree/mvp/slices.md`

## Behavior

Users can create, view, edit, and delete people. Each person has a name, date of birth, and place of birth. All data is persisted in SQLite. The UI provides a dedicated form page (`/add-person`) for creation. Editing is done inline within the person card (no separate edit page). Deletion shows an inline confirmation prompt within the card. Validation errors are returned from the server and displayed in the UI.

## Business Rules

- Name is required and must not be blank
- Date of birth is required and must not be in the future
- Place of birth is optional
- Deleting a person removes all their relationships (cascade)

## Edge Cases

- Blank name after trimming whitespace: rejected with validation error
- Date of birth set to today: accepted
- Date of birth set to tomorrow or later: rejected
- Deleting a person who is a parent or child: allowed; their relationships are removed

## Validation

- Missing `name` (Domain): `400 { error: "Name is required" }`
- Blank `name` after trim (Domain): `400 { error: "Name is required" }`
- Missing `dateOfBirth` (Domain): `400 { error: "Date of birth is required" }`
- Future `dateOfBirth` (Domain): `400 { error: "Date of birth cannot be in the future" }`
- Person not found on edit/delete (Technical): `404 { error: "Person not found" }`

## Domain Models

- **Person** — represents an individual in the family tree
  - `id` (number): auto-incremented primary key
  - `name` (string): full name
  - `dateOfBirth` (string, ISO 8601 date): date of birth
  - `placeOfBirth` (string | null): place of birth, optional

## API Surface

- `GET /api/people`
  - Response: `Person[]`
  - Behavior: returns all people ordered by name

- `POST /api/people`
  - Request: `{ name, dateOfBirth, placeOfBirth }`
  - Response: `Person`
  - Behavior: creates and returns the new person

- `PUT /api/people/:id`
  - Request: `{ name, dateOfBirth, placeOfBirth }`
  - Response: `Person`
  - Behavior: updates and returns the person

- `DELETE /api/people/:id`
  - Response: `204 No Content`
  - Behavior: deletes the person and all their relationships

## Success Criteria

- All four endpoints exist and return correct status codes
- Validation errors return `400` with a descriptive message
- Deleting a person cascades to their relationships
- UI `/add-person` form creates a person
- UI supports inline editing of name, date of birth, and place of birth within the person card
- UI shows an inline delete confirmation prompt (no `window.confirm()`)
- UI list displays all people with age tag and optional location tag
- UI shows inline validation errors from the server
- Integration tests cover all validation rules and CRUD operations

## Notes

- `dateOfBirth` is stored and returned as an ISO 8601 date string (`YYYY-MM-DD`)
- Validation is authoritative on the server; client-side validation is optional
