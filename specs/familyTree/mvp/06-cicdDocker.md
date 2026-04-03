# Spec: CI/CD & Docker

**Slice:** 6 of 8 — `planning/familyTree/mvp/slices.md`

## Behavior

The application is fully containerized for local self-hosting via `docker compose up`. A GitHub Actions CI pipeline runs all tests on every push to `main`. A CD pipeline deploys both services to Fly.io automatically on merge to `main`, after tests pass. The live application is accessible via public Fly.io URLs.

## Business Rules

- The backend Docker image serves the Express API on port `5000`
- The frontend Docker image serves the built Vite app via nginx on port `3000`
- The SQLite database is persisted via a Fly.io volume mounted at `/app/data`
- The CI pipeline runs on every push to `main` — tests must pass before deployment proceeds
- The CD pipeline runs only on push to `main` (not PRs) and deploys only after tests pass
- If any test step fails, deployment does not proceed
- The frontend nginx configuration proxies `/api/` requests to the Fly.io API app URL in production

## Edge Cases

- Database volume not present on first Fly.io deploy: created automatically
- `FLY_API_TOKEN` not set in GitHub secrets: CD workflow fails with a clear error

## Domain Models

- No domain models

## API Surface

- No new endpoints

## Artifacts

- `api/Dockerfile` — multi-stage build for the backend (already implemented)
- `ui/Dockerfile` — multi-stage build for the frontend: build stage + nginx serve stage (already implemented)
- `ui/nginx.conf` — nginx config for local Docker Compose (already implemented)
- `ui/nginx.fly.conf` — nginx config for Fly.io production (proxies `/api/` to the live API app URL)
- `docker-compose.yml` — orchestrates both services locally with volume for DB (already implemented)
- `api/fly.toml` — Fly.io app configuration for the backend
- `ui/fly.toml` — Fly.io app configuration for the frontend
- `.github/workflows/ci.yml` — CI: tests on every push to `main` (already implemented)
- `.github/workflows/cd.yml` — CD: replace DockerHub publish job with Fly.io deploy job

## Success Criteria

- `docker compose up --build` starts the full application at `http://localhost:3000`
- Push to `main` triggers CI: all tests (unit, integration, E2E) pass
- Merge to `main` triggers CD: tests pass, then both Fly.io apps are deployed automatically
- The live API is reachable at `https://family-tree-api.fly.dev/health` (`200`)
- The live frontend is reachable at `https://family-tree-ui.fly.dev` and can reach the API
- SQLite data persists across Fly.io deployments (volume is not wiped on redeploy)

## Notes

- One GitHub secret required: `FLY_API_TOKEN` (obtained from `fly tokens create deploy`)
- Two Fly.io apps: `family-tree-api` and `family-tree-ui` (or user-chosen names)
- The CI workflow is unchanged — only the CD workflow's `publish` job is replaced
- `docker-compose.yml` and local Dockerfiles remain for the local self-hosting story
