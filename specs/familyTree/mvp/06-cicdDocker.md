# Spec: CI/CD & Docker

**Slice:** 6 of 8 — `planning/familyTree/mvp/slices.md`

## Behavior

The application is fully containerized for local self-hosting via `docker compose up`. A GitHub Actions CI pipeline runs all tests on every push to `main`. A CD pipeline deploys both services to an AWS EC2 instance automatically on merge to `main`, after tests pass. The live application is accessible via the instance's public IP.

## Business Rules

- The backend Docker image serves the Express API on port `5000` (internal only — not publicly exposed)
- The frontend Docker image serves the built Vite app via nginx on port `80`
- The frontend nginx proxies `/api/` requests to the `api` container on the internal Docker network
- The SQLite database is persisted via a Docker volume mounted at `/app/data`
- The CI pipeline runs on every push to `main` — tests must pass before deployment proceeds
- The CD pipeline runs only on push to `main` (not PRs) and deploys only after tests pass
- If any test step fails, deployment does not proceed

## Edge Cases

- Database volume not present on first deploy: created automatically by Docker
- Any required GitHub secret missing: CD workflow fails with a clear error

## Domain Models

- No domain models

## API Surface

- No new endpoints

## Artifacts

- `api/Dockerfile` — multi-stage build for the backend
- `ui/Dockerfile` — multi-stage build for the frontend: build stage + nginx serve stage
- `ui/nginx.conf` — nginx config: serves static files, proxies `/api/` to the `api` container
- `docker-compose.yml` — orchestrates both services with a named volume for DB persistence
- `.github/workflows/cd.yml` — CD: SSHs into EC2, runs `git pull && docker compose up -d --build && docker image prune -f`

## Success Criteria

- `docker compose up --build` starts the full application at `http://localhost:80`
- Push to `main` triggers CI: all tests (unit, integration, E2E) pass
- Merge to `main` triggers CD: tests pass, then the EC2 instance pulls and rebuilds automatically
- The live app is reachable at the EC2 public IP (`http://13.60.237.172`)
- SQLite data persists across deployments (Docker volume is not removed on redeploy)

## Notes

- Three GitHub secrets required: `EC2_SSH_KEY` (PEM private key), `EC2_USER`, `EC2_HOST`
- The SSH private key must be passed via an env var (not a shell variable) to preserve PEM newlines
- Port `5000` is not publicly exposed — the API is only reachable through the nginx proxy
- `docker-compose.yml` serves both local development and production deployment
