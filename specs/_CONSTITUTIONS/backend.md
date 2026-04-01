# Backend Constitution

This constitution governs all backend TypeScript development in the `api/` folder.

## Technology

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Database:** SQLite via better-sqlite3
- **Validation:** Zod
- **Testing:** Vitest + supertest

## Project Structure

```
api/
├── src/
│   ├── index.ts              # App entry point
│   ├── app.ts                # Express app setup
│   ├── routes/               # Route handlers
│   ├── services/             # Business logic
│   ├── models/               # Type definitions
│   ├── db/                   # Database setup and queries
│   ├── validation/           # Zod schemas and validators
│   └── middleware/           # Express middleware (error handling, etc.)
├── tests/                    # Test files
├── tsconfig.json
└── package.json
```

## Naming Conventions

- Files: camelCase (`personService.ts`, `familyRoutes.ts`)
- Types/Interfaces: PascalCase (`Person`, `CreatePersonRequest`)
- Functions/Variables: camelCase (`createPerson`, `validateAge`)
- Constants: UPPER_SNAKE_CASE for true constants (`MIN_PARENT_AGE_DIFF`)

## API Design

### Response Format

Return structured JSON. Errors use a consistent shape:

```typescript
// Success
{ data: T }

// Error
{ error: { message: string; field?: string; code?: string } }
// or for multiple errors
{ errors: Array<{ message: string; field?: string; code?: string }> }
```

### HTTP Methods

| Method | Use Case       | Returns                         |
| ------ | -------------- | ------------------------------- |
| GET    | Retrieve data  | 200 with data, 404 if not found |
| POST   | Create         | 201 with created entity         |
| DELETE | Remove         | 204 No Content                  |

### Validation

- **All input validation uses Zod schemas**
- Validate in route handlers before calling services
- Services assume valid input — business rule validation only
- Return 400 with descriptive error messages for validation failures

## Database

- Use better-sqlite3 (synchronous API)
- SQL queries in dedicated db module — not scattered in services
- Use parameterized queries — **never** string concatenation for SQL
- Initialize schema on startup (CREATE TABLE IF NOT EXISTS)

## Error Handling

- Use a centralized error-handling middleware
- Custom error classes for business rule violations
- Never expose stack traces in responses

## Domain Rules (Family Tree)

These validation rules are the core of the application:

- A person can have 0–2 parents
- A parent must be at least 15 years older than their child
- Cyclical relationships are not allowed (a person cannot be their own ancestor)
- Date of birth is required and must not be in the future
- **Server-side validation is the source of truth** — frontend prechecks are UX only

## Anti-Patterns

- **DO NOT** use string concatenation for SQL queries — use parameterized queries
- **DO NOT** scatter database queries across services — keep them in `db/`
- **DO NOT** skip server-side validation — the backend is the source of truth
- **DO NOT** expose stack traces in error responses
- **DO NOT** use `any` type — use proper TypeScript types
