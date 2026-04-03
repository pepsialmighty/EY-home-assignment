# Spec: E2E Tests

**Slice:** 5 of 8 — `planning/familyTree/mvp/slices.md`

## Behavior

Playwright E2E tests exercise the full application through the browser against a running local instance. Tests cover the primary happy path and all critical validation error scenarios. Tests are runnable via a single command and produce a clear pass/fail report.

## Business Rules

- Tests run against the local dev environment (`http://localhost:3000`)
- Each test is independent — test data is created and cleaned up per test
- Tests must not depend on pre-existing database state

## Test Scenarios

### Happy Path
- Create two people with a valid age gap → assign parent relationship via `/add-relationship` → the parent appears in the root ancestor dropdown on `/tree` → selecting the ancestor shows the lineage with both nodes connected

### Validation Errors
- Attempt to set a date of birth in the future → expect error message in UI
- Create two people with less than 15 years age gap → attempt to assign parent → expect age gap error in UI
- Create three people, assign two parents to one child → attempt to assign a third parent → expect parent limit error in UI
- Create a chain A → B → C → attempt to assign C as parent of A → expect cycle error in UI

### Person Management
- Create a person → verify they appear in the people list
- Inline-edit a person's name (click Edit button on the card, update name, click Save) → verify the updated name appears in the card
- Delete a person (click Delete, confirm inline prompt) → verify they are removed from the list

## Domain Models

- No new domain models — E2E tests consume the full application

## API Surface

- No new endpoints

## Success Criteria

- All scenarios above have corresponding passing Playwright tests
- Tests can be run with a single command (e.g. `npm run test:e2e`)
- Tests pass reliably without flakiness
- CI pipeline runs E2E tests as part of the build

## Notes

- Playwright config should target Chromium by default
- Use `data-testid` attributes on key UI elements to keep selectors stable
