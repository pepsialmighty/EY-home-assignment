# Project Structure

## Root Layout

```
family-tree-setup/
├── api/              # Express + TypeScript backend
├── ui/               # React + TypeScript frontend (Vite)
├── specs/            # AI constitutions and architecture specs
├── planning/         # Working planning documents (not committed)
└── README.md         # Required project documentation
```

## Domain

**Family Tree Mini-Builder** is a full-stack tech demo for constructing simple family trees:

- Person management (name, date of birth, place of birth)
- Parent-child relationship assignment
- Family tree visualization (list, graph, or hierarchy)
- Validation: 0-2 parents, 15-year age gap, no cycles, no future DOB

## Technology Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Backend  | Node.js, TypeScript, Express, node:sqlite (built-in) |
| Frontend | React 18, TypeScript, Vite, TanStack Query      |
| Testing  | Vitest, React Testing Library, supertest         |
| Database | SQLite                                           |

## Development Environment

| Service  | URL                    |
| -------- | ---------------------- |
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:5000  |

## Validation Rules (Core Domain Logic)

1. A person can have 0–2 parents
2. A parent must be at least 15 years older than their child
3. Cyclical relationships are not allowed
4. A person cannot be their own ancestor
5. Date of birth is required and must not be in the future
6. Relationship creation must be validated server-side with clear errors
