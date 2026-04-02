# UI — Family Tree Mini-Builder

React + TypeScript frontend built with Vite, served via nginx in Docker.

## Stack

| Concern       | Technology                      |
| ------------- | ------------------------------- |
| Framework     | React 19 + TypeScript           |
| Build tool    | Vite 8                          |
| Routing       | React Router DOM 7              |
| Server state  | TanStack Query (React Query) 5  |
| Visualization | @xyflow/react (React Flow) 12   |
| Testing       | Vitest + React Testing Library  |
| E2E           | Playwright (Chromium)           |

## Directory Structure

```
ui/
├── src/
│   ├── main.tsx          # Vite entry point
│   ├── App.tsx           # Root component with BrowserRouter and nav
│   ├── views/            # Page-level components (PeopleView, TreeView)
│   ├── components/       # Reusable components (PersonForm, ParentManager)
│   ├── api/              # Fetch functions and TanStack Query hooks
│   └── types/            # Shared TypeScript interfaces
├── e2e/                  # Playwright E2E tests
├── playwright.config.ts  # Playwright configuration
└── package.json
```

## Getting Started

```bash
# From repo root (installs all workspaces)
npm ci

# Start dev server (http://localhost:3000) — requires api running on :5000
cd ui && npm run dev

# Type check
cd ui && npm run check-types

# Build for production
cd ui && npm run build
```

## Scripts

| Script        | Description                                    |
| ------------- | ---------------------------------------------- |
| `dev`         | Start Vite dev server on port 3000             |
| `build`       | Type-check + Vite production build             |
| `check-types` | Run `tsc -b` (full project reference check)    |
| `test`        | Vitest unit tests                              |
| `test:e2e`    | Playwright E2E tests (auto-starts Vite server) |

## Views

### `/` — People

- List all people with edit and delete actions
- Inline add/edit form (`PersonForm`)
- `ParentManager` per person: shows current parents, add/remove controls
- All server validation errors shown inline

### `/tree` — Family Tree

- Interactive React Flow canvas with zoom/pan controls
- All people as nodes, all parent-child relationships as edges
- Empty state when no people exist
- Error state on fetch failure
- Auto-refreshes when people or relationships change (TanStack Query invalidation)

## E2E Tests

10 tests across 3 spec files — run serially (`workers: 1`) to avoid shared-DB contamination:

| File                            | Scenarios                                     |
| ------------------------------- | --------------------------------------------- |
| `e2e/personManagement.spec.ts`  | Create, edit, delete, future DOB rejection    |
| `e2e/relationships.spec.ts`     | Happy path, age gap, parent limit, cycle      |
| `e2e/treeVisualization.spec.ts` | Empty state, tree renders with nodes/edges    |

Each test cleans up all people via the API in `beforeEach`.

```bash
# Requires api server running on :5000
cd api && npm run dev &
cd ui && npm run test:e2e
```
