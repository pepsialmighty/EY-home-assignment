# Brief: Family Tree MVP

**Date:** 2026-04-01

## Goal

Build a full-stack Family Tree Mini-Builder that allows users to create, edit, and delete people, assign parent-child relationships, and visualize a family tree interactively — packaged for deployment and documented for handoff.

## Context

This is an interview home assignment and tech demo showcasing full-stack skills: form design, API design, validation logic, data modelling, testing discipline, and DevOps awareness. The stack and domain rules are predefined in `specs/_STRUCTURE/general.md`.

## Requirements

### Core App
- Create, edit, and delete people with name, date of birth, and place of birth
- Assign and remove parent-child relationships between people
- Enforce all domain validation rules server-side with clear error messages:
  - A person can have 0–2 parents
  - A parent must be at least 15 years older than their child
  - Cyclical relationships are not allowed (no ancestor loops)
  - Date of birth must not be in the future
- Display validation errors clearly in the UI

### Visualization
- Interactive family tree visualization (hierarchy/graph view, not just a list)

### Testing
- Integration tests for all validation logic (cycle detection, age gap, parent limits)
- Unit tests for complex domain edge cases

### CI/CD & Packaging
- Dockerize the application (frontend + backend)
- GitHub Actions CI/CD pipeline that builds and pushes Docker images to DockerHub on merge to main

### Documentation
- `README.md` covering:
  - How to run locally
  - How to run via Docker
  - AI approach: tools used, what for, and why
  - Architecture overview
  - Data model and validation explanation
  - API format (endpoints + example requests/responses)
  - "What I would do with more time"
  - Features delivered

## Constraints

- **Frontend:** React 18 + TypeScript + Vite + TanStack Query, served at `http://localhost:3000`
- **Backend:** Node.js + TypeScript + Express + better-sqlite3, served at `http://localhost:5000`
- **Database:** SQLite (via better-sqlite3)
- **Testing:** Vitest, React Testing Library, supertest
- **CI/CD:** GitHub Actions + DockerHub

## Out of Scope

- Authentication / user accounts
- Multiple family trees per session
- Deployment to a live hosting service (e.g. Vercel) — deferred
- Export / import functionality

## Related

- `specs/_STRUCTURE/general.md` — domain rules, tech stack, validation rules
- `AGENTS.md` — project overview and responsibilities
