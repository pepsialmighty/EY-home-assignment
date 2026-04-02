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
│   ├── main.tsx              # Vite entry point
│   ├── App.tsx               # Root component: BrowserRouter, shell layout, routes
│   ├── views/                # Page-level components
│   │   ├── PeopleView.tsx    # Home view (/)
│   │   ├── AddPersonView.tsx # Add person form (/add-person)
│   │   ├── AddRelationshipView.tsx  # Add relationship form (/add-relationship)
│   │   └── TreeView.tsx      # Family tree canvas (/tree)
│   ├── components/           # Reusable components (PersonForm, Toast)
│   ├── context/              # React contexts (ToastContext)
│   ├── api/                  # Fetch functions and TanStack Query hooks
│   └── types/                # Shared TypeScript interfaces
├── e2e/                      # Playwright E2E tests
├── playwright.config.ts      # Playwright configuration
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

### `/` — Home

- Stats cards: total people and relationships counts
- Person cards with age tag, location tag, parents text, and children pills
- Inline edit mode per card: name, date of birth, place of birth inputs with field-level validation and API error banner
- Inline delete confirmation per card (no `window.confirm()`)
- Children pill `×` button with inline confirmation to remove a relationship
- Empty state with call-to-action when no people exist
- Toast notifications on all successful mutations

### `/add-person` — Add Person

- Centered card form: name, date of birth, place of birth
- Inline field validation and API error banner
- Navigates back to `/` with a toast on success

### `/add-relationship` — Add Relationship

- Centered card form: parent select, child select
- Child dropdown excludes people who already have 2 parents
- Inline validation and API error banner
- Navigates back to `/` with a toast on success

### `/tree` — Family Tree

- Root ancestor dropdown: lists people who have no parents but have at least one child; selecting one renders that lineage only
- Hierarchical node layout (client-side BFS): root at top, each generation below, no overlapping nodes
- Custom node cards: person name + date of birth
- `smoothstep` edges in neutral gray
- Fixed-height canvas (`600px`); no viewport overflow
- Empty state when no people exist; "no root ancestors" message when people exist but no relationships do
- Auto-refreshes on data changes (TanStack Query invalidation)

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
