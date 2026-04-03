# Spec: Documentation

**Slice:** 7 of 8 — `planning/familyTree/mvp/slices.md`

## Behavior

A `README.md` at the repo root provides everything a reviewer needs to run, understand, and evaluate the project. It covers local setup, Docker setup, AI-assisted development approach, architecture, data model, API reference, and future improvements.

## Business Rules

- `README.md` is at the repo root
- All commands in the README must be accurate and runnable
- The AI approach section must reference the spec-driven development process used in this project

## Required Sections

1. **Project Overview** — what the app does, key features delivered, link to live Fly.io URL
2. **How to Run Locally** — prerequisites, install steps, start commands for both `api/` and `ui/`
3. **How to Run via Docker** — `docker compose up` instructions
4. **Live Demo** — `https://family-tree-ui.fly.dev`; note that the SQLite DB is shared (demo data may exist)
5. **AI Approach** — tools used (Claude Code + spec-driven development), what they were used for, why they were chosen
6. **Architecture Overview** — description of the monorepo structure, frontend/backend separation, data flow, Fly.io deployment topology
7. **Data Model & Validation** — `Person` and `Relationship` models, all validation rules explained
8. **API Reference** — all endpoints with method, path, request shape, response shape, and one example each
9. **What I Would Do With More Time** — honest prioritized list of improvements

## Domain Models

- No new domain models

## API Surface

- No new endpoints

## Success Criteria

- `README.md` exists at the repo root
- All nine required sections are present
- All commands are accurate and tested
- Live Fly.io URL is included and accessible
- API reference covers all endpoints from slices 2 and 3
- AI approach section explains spec-driven development and why it was chosen

## Notes

- Diagrams are optional but welcomed (ASCII or image)
- Be concise — reviewers skim; use headers, bullets, and code blocks
