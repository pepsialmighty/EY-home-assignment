# API — Family Tree Mini-Builder

Express + TypeScript REST API backed by SQLite.

## Stack

| Concern    | Technology                        |
| ---------- | --------------------------------- |
| Runtime    | Node.js 22+                       |
| Framework  | Express 4                         |
| Language   | TypeScript 5                      |
| Database   | SQLite via `node:sqlite` (Node 22 built-in) |
| Validation | Zod                               |
| Testing    | Vitest + supertest                |

## Directory Structure

```
api/
├── src/
│   ├── index.ts          # HTTP server entry point
│   ├── app.ts            # Express app, middleware, route mounting
│   ├── routes/           # Thin route handlers — validate input, call service
│   ├── services/         # Business logic and domain rules
│   ├── models/           # TypeScript interfaces (Person, Relationship)
│   ├── db/               # All SQL queries; no SQL outside this folder
│   ├── validation/       # Zod schemas
│   └── middleware/       # Centralized error handler
├── tests/                # Vitest + supertest integration tests
├── data/                 # SQLite DB file (gitignored)
├── dist/                 # Compiled output (gitignored)
└── package.json
```

## Getting Started

```bash
# From repo root (installs all workspaces)
npm ci

# Start dev server with hot reload (http://localhost:5000)
cd api && npm run dev

# Build
cd api && npm run build

# Run tests
cd api && npm test
```

## Scripts

| Script        | Command                                     |
| ------------- | ------------------------------------------- |
| `dev`         | `ts-node-dev --respawn --transpile-only src/index.ts` |
| `build`       | `tsc`                                       |
| `start`       | `node dist/index.js` (production)           |
| `test`        | `vitest run`                                |

## API Endpoints

All responses use `{ data: T }` on success and `{ error: { message: string } }` on failure.

| Method   | Path                        | Description                          | Status |
| -------- | --------------------------- | ------------------------------------ | ------ |
| `GET`    | `/health`                   | Health check                         | 200    |
| `GET`    | `/api/people`               | List all people                      | 200    |
| `POST`   | `/api/people`               | Create a person                      | 201    |
| `PUT`    | `/api/people/:id`           | Update a person                      | 200    |
| `DELETE` | `/api/people/:id`           | Delete a person (cascades)           | 204    |
| `GET`    | `/api/people/:id/parents`   | Get parents of a person              | 200    |
| `GET`    | `/api/relationships`        | List all relationships               | 200    |
| `POST`   | `/api/relationships`        | Create a parent-child relationship   | 201    |
| `DELETE` | `/api/relationships/:id`    | Delete a relationship                | 204    |

## Domain Rules

Enforced in `src/services/` — not in routes or the database layer:

1. A person can have **0–2 parents**
2. A parent must be **≥ 15 years older** than their child (to the day)
3. **No cycles** — a person cannot be their own ancestor
4. A person **cannot be their own parent**
5. Date of birth must **not be in the future**

## Testing Approach

Tests mock at the `*Db` layer using in-memory arrays (avoids Vitest/Vite incompatibility with `node:sqlite`):

```typescript
const store = { people: [], nextId: 1 };
vi.mock('../src/db/personDb', () => ({
  getAllPeople: () => [...store.people],
  // ...
}));
beforeEach(() => { store.people = []; store.nextId = 1; });
```

33 tests cover: all CRUD endpoints, all validation rules, cycle detection edge cases.
