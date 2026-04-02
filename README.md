# Family Tree Mini-Builder

A full-stack application for constructing simple family trees. Create people, assign parent-child relationships, and visualize the tree interactively.

**Live demo:** https://family-tree-ui.fly.dev

## Features

- Create, edit, and delete people (name, date of birth, place of birth) — inline within the home view, no page navigation required
- Assign parent-child relationships via a dedicated form page; remove them via inline confirmation on the home view
- Validation: 0–2 parents, 15-year minimum age gap, no cycles, no future date of birth
- Interactive family tree visualization (React Flow) with root ancestor filter and hierarchical node layout
- Toast notifications for all mutation results (add, update, delete, remove relationship)
- Clean Tailwind CSS UI with stats cards, person cards (age tag, location tag, parents, children pills), and inline edit/delete confirmations
- 10 Playwright E2E tests + 33 backend integration tests

---

## How to Run Locally

### Prerequisites

- Node.js 22+
- npm 10+

### Install

```bash
npm ci
```

### Start

Run both servers in separate terminals:

```bash
# Terminal 1 — backend (http://localhost:5000)
cd api && npm run dev

# Terminal 2 — frontend (http://localhost:3000)
cd ui && npm run dev
```

### Tests

```bash
# Backend unit + integration tests
cd api && npm test

# Frontend E2E tests (requires both servers running)
cd ui && npm run test:e2e
```

---

## How to Run via Docker

### Prerequisites

- Docker Desktop

### Start

```bash
docker compose up --build
```

The app is available at **http://localhost:3000**. The API runs at **http://localhost:5000**.

Data is persisted in a Docker volume (`db-data`) and survives container restarts.

### Stop

```bash
docker compose down          # stop containers, keep volume
docker compose down -v       # stop containers and delete data
```

---

## Architecture Overview

```
/
├── api/          # Express + TypeScript backend (port 5000)
├── ui/           # React + Vite + TypeScript frontend (port 3000)
├── specs/        # AI constitutions and retained specs
└── planning/     # Working planning docs (gitignored)
```

**Data flow:**

1. User interacts with the React UI
2. UI calls the Express REST API via `fetch` (proxied through nginx in Docker)
3. API validates input with Zod, enforces domain rules in services, queries SQLite via `node:sqlite`
4. Responses follow a consistent shape: `{ data: T }` on success, `{ error: { message } }` on failure

**In Docker (local)**, the frontend nginx container proxies `/api/` requests to the `api` container on the internal Docker network. The UI serves the Vite-built static files.

**On Fly.io (production)**, the `family-tree-ui` app serves static files via nginx and proxies `/api/` to `https://family-tree-api.fly.dev`. The API app mounts a persistent Fly.io volume at `/app/data` for SQLite storage. Both apps are deployed automatically on every push to `main` via the CD pipeline (`.github/workflows/cd.yml`).

---

## Data Model & Validation

### Person

| Field          | Type          | Constraints                        |
| -------------- | ------------- | ---------------------------------- |
| `id`           | integer       | Auto-assigned                      |
| `name`         | string        | Required, non-empty                |
| `dateOfBirth`  | string (date) | Required, not in the future        |
| `placeOfBirth` | string        | Optional                           |

### Relationship

| Field      | Type    | Description             |
| ---------- | ------- | ----------------------- |
| `id`       | integer | Auto-assigned           |
| `parentId` | integer | Foreign key → Person.id |
| `childId`  | integer | Foreign key → Person.id |

### Validation Rules

1. A person can have **0–2 parents**
2. A parent must be **at least 15 years older** than their child (by date of birth, to the day)
3. **No cycles** — a person cannot be their own ancestor
4. A person **cannot be their own parent**
5. Date of birth must **not be in the future**

All rules are enforced server-side. The frontend shows server error messages inline.

---

## API Reference

Base URL (local): `http://localhost:5000`  
Base URL (live): `https://family-tree-api.fly.dev`

All responses: `{ data: T }` on success, `{ error: { message: string } }` on failure.

### People

#### `GET /api/people`
Returns all people.

```json
{ "data": [{ "id": 1, "name": "Alice", "dateOfBirth": "1990-06-15", "placeOfBirth": null }] }
```

#### `POST /api/people`
Create a person.

```json
// Request
{ "name": "Alice", "dateOfBirth": "1990-06-15", "placeOfBirth": "London" }

// Response 201
{ "data": { "id": 1, "name": "Alice", "dateOfBirth": "1990-06-15", "placeOfBirth": "London" } }
```

#### `PUT /api/people/:id`
Update a person.

```json
// Request
{ "name": "Alice Smith", "dateOfBirth": "1990-06-15" }

// Response 200
{ "data": { "id": 1, "name": "Alice Smith", "dateOfBirth": "1990-06-15", "placeOfBirth": null } }
```

#### `DELETE /api/people/:id`
Delete a person (cascades to their relationships). Response: `204 No Content`.

#### `GET /api/people/:id/parents`
Returns the parents of a person.

```json
{ "data": [{ "relationshipId": 3, "person": { "id": 2, "name": "Bob", "dateOfBirth": "1960-01-01", "placeOfBirth": null } }] }
```

### Relationships

#### `GET /api/relationships`
Returns all relationships.

```json
{ "data": [{ "id": 1, "parentId": 2, "childId": 1 }] }
```

#### `POST /api/relationships`
Create a parent-child relationship. Enforces all domain rules.

```json
// Request
{ "parentId": 2, "childId": 1 }

// Response 201
{ "data": { "id": 1, "parentId": 2, "childId": 1 } }

// Error examples
{ "error": { "message": "A parent must be at least 15 years older than their child" } }
{ "error": { "message": "This relationship would create a cycle" } }
{ "error": { "message": "A person can have at most 2 parents" } }
```

#### `DELETE /api/relationships/:id`
Delete a relationship. Response: `204 No Content`.

#### `GET /health`
Health check. Response: `{ "data": { "status": "ok" } }`.

---

## AI Approach

This project was built using **[Claude Code](https://claude.ai/code)** (Anthropic's CLI agent) following a **spec-driven development** process.

### Process

1. **Brief** — A `brief.md` defined the full scope upfront
2. **Slices** — Work was broken into 8 ordered slices (scaffold → persons → relationships → visualization → E2E → Docker → docs → review)
3. **Constitutions** — Binding rule files (`specs/_CONSTITUTIONS/`) governed every phase: backend patterns, frontend patterns, testing philosophy, git conventions, review process
4. **Steps** — Each slice had a `steps.md` with exact file paths, method names, and acceptance criteria
5. **Review** — After each slice, a structured review identified issues with recommended/optional/false-positive triage

### Why spec-driven + Claude Code

- **Consistency** — Constitutions enforce the same patterns across all files without drift
- **Reviewability** — Every decision is traceable to a spec step; deviations are documented
- **Speed** — Claude Code handles boilerplate while the developer focuses on domain rules and architecture
- **Quality gate** — The review slice catches issues before they accumulate

**Also used:** CodeRabbit (VS Code extension) for automated code review on diffs.

---

## UI Design Decisions

### Tree View — Root Ancestor Filter

The family tree dropdown lists only people who are **root ancestors with at least one child** (i.e. no parents, but have children of their own). People with no relationships are excluded.

**Rationale:** A family tree is read top-down from a founding ancestor. Showing a person with no relationships in the dropdown would produce a canvas with a single node and no edges — not a useful visualisation. Restricting to root ancestors with children ensures every option in the dropdown shows a meaningful lineage.

If no such root ancestors exist (e.g. all people have been added but no relationships created yet), the view shows a prompt to add relationships first.

### Inline Edit & Delete (Home View)

Edit and delete actions happen inline within each person card rather than navigating to a separate page. This matches the brief's intent to keep the home view as the primary workspace. Delete uses a styled inline confirmation prompt — not `window.confirm()`.

---

## What I Would Do With More Time

1. **Tree layout** — Replace the client-side BFS layout with Dagre or ELK for wide trees with many siblings — the current layout works well for linear chains but can produce wide layouts for large families
2. **Siblings display** — Show sibling relationships derived from shared parents
3. **Search & filter** — Filter the people list and highlight nodes in the tree
4. **UI unit tests** — Add Vitest + React Testing Library tests for form validation and component state
5. **Auth** — Add user accounts so multiple family trees can be managed independently
6. **Export** — PDF or image export of the tree
7. **Pagination** — For large family trees, paginate the people list
