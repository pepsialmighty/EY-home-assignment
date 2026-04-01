# AGENTS.md - Instructions for AI

## Project Overview

**Family Tree Mini-Builder** is a full-stack application for constructing simple family trees:

- **Frontend:** React + TypeScript (Vite) in the `ui/` directory
- **Backend:** Node.js + TypeScript (Express) in the `api/` directory
- **Database:** SQLite via `node:sqlite` (built-in Node 22+)

This is a small tech demo showcasing full-stack skills: form design, validation, data modelling, API design, and coding style.

## Responsibilities

You are responsible for aiding in the development of Family Tree Mini-Builder: planning, coding, testing, debugging, and documentation.

### Mandatory Reading

**ALWAYS PERFORM THIS STEP**

Before performing **any** task, read **only** the relevant constitutions from `specs/_CONSTITUTIONS/`.
Until all relevant constitutions are read, you **MUST NOT** do anything else. **ALL TOOL CALLS ARE FORBIDDEN UNTIL DONE.**

#### Sequencing Gate

1. Read required constitutions.
2. Repeat 1 until all relevant and referenced constitutions are read.
3. Perform the **first** non-constitution-reading tool call to perform your task.

**CRITICAL:**

- **DO NOT** read partial constitutions — read the **entire** file
- **DO NOT** rely on memory of constitution contents — re-read each session
- **DO NOT** run commands from memory — check the constitution for exact syntax

Constitutions live in `specs/_CONSTITUTIONS/`.

| Constitution      | Read When                                                 |
| ----------------- | --------------------------------------------------------- |
| `general.md`      | **Always** — scope management, verification, comments     |
| `terminal.md`     | Running any shell commands                                |
| `backend.md`      | Writing or modifying backend code in `api/`               |
| `frontend.md`     | Writing or modifying frontend code in `ui/`               |
| `planning.md`     | Breaking down work items into slices, creating specs      |
| `implementer.md`  | Executing implementation steps from a planning spec       |
| `review.md`       | Executing the final review slice or addressing reviews    |
| `git.md`          | Committing, branching, merging, or creating PRs           |

### Task Workflow

1. **Read constitutions** — Identify and read only the relevant constitutions
2. **Gather context** — Understand existing code patterns before making changes
3. **Stay in scope** — Do what is necessary, nothing more (see `general.md`)
4. **Verify work** — Check exit codes, run tests, confirm success through execution
5. **Review slice** — For completed work, execute the review slice

**When the user's instruction shifts to a different task type mid-conversation, STOP and re-check the constitution table above before proceeding.**

### Key Principles

- **Verify** — check exit codes; IDE diagnostics may be stale
- **Scope** — fix related bugs; don't refactor or add features out of scope
- **Preserve** — keep existing comments and patterns unless instructed otherwise
- **Senior developer mindset** — act as a senior developer. When the user raises a question or proposes a solution, provide an honest, well-reasoned point of view. If their option is suboptimal, say so clearly and explain why. Do not agree just to validate — the goal is to arrive at the best solution together through genuine discussion.

### Enforcement

All constitutions are binding. Violations include:

- Not reading all relevant constitutions before starting
- Making changes outside the requested scope
- Assuming success without verification
- Running commands from memory instead of copying from constitution

**Read the constitutions. Follow them exactly.**

### Spec-driven

When instructed to follow spec-driven development, follow the **Core process** in `specs/_CONSTITUTIONS/planning.md`
