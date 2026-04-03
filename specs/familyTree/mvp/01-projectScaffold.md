# Spec: Project Scaffold

**Slice:** 1 of 8 — `planning/familyTree/mvp/slices.md`

## Behavior

Sets up the full monorepo with two independent packages: `api/` (Express + TypeScript backend) and `ui/` (React + TypeScript + Vite frontend). Both dev servers start without errors. The backend connects to a SQLite database and responds to a health-check request. The frontend renders a placeholder page and can reach the backend.

## Business Rules

- `api/` and `ui/` are separate npm workspaces under a root `package.json`
- Backend runs on port `5000`, frontend on port `3000`
- Database file is stored at `api/data/family-tree.db`
- TypeScript strict mode is enabled in both packages
- CORS is configured on the backend to allow requests from `http://localhost:3000`

## Domain Models

- No domain models yet — scaffold only

## API Surface

- `GET /health`
  - Response: `{ status: "ok" }`
  - Behavior: confirms the server is running and the database connection is alive

## Success Criteria

- `npm run dev` (or equivalent) starts both servers without errors
- `GET /health` returns `200 { status: "ok" }`
- Frontend renders at `http://localhost:3000` without console errors
- TypeScript compiles without errors in both packages
- SQLite database file is created on first run

## Notes

- ESLint configuration should be present in both packages
- `.gitignore` must exclude `api/data/*.db` and all `node_modules`
