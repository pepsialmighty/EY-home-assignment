# Planning Constitution

## Terminology

| Term          | Meaning                                                    |
| ------------- | ---------------------------------------------------------- |
| **Work Item** | The overall thing being worked on (feature, bugfix, etc.)  |
| **Brief**     | User input describing the work item (`brief.md`)           |
| **Slice**     | A vertical, self-contained segment of implementation       |
| **Spec**      | Detailed specification for one slice (1:1 with slice)      |
| **Steps**     | Implementation instructions for a spec (`steps.md`)        |
| **Test Data** | Optional test scenarios for a slice                        |

> **Alias:** Users often say "Spec 1" to mean "Slice 1". Treat them as equivalent.

## Core Process - Spec-Driven

1. **Capture** work item requirements in a brief
2. **Break down** the brief into slices
3. **Convert** each slice into a spec
4. **Break** specs down to steps
5. **Optionally generate** test data — ask the user after steps are approved
6. **Implement** steps

### Brief Generation

When AI generates a brief from user input:

1. **Ask for vertical, topic, subtopic** — folder structure must be user-determined
2. **Generate brief** — based on user input and codebase
3. **Refine brief** — find ambiguities, gaps or conflicts, ask user
4. **Repeat refinement** — until all clear
5. **Request confirmation** — user must approve before proceeding
6. **Brief locks** — editing FORBIDDEN after confirmation

**DO NOT CONTINUE IF BRIEF CONTAINS `[MUST RESOLVE]`**

### Brief Lock

After confirmation, the brief is the source of truth. Propose changes only when a genuine gap surfaces — requires explicit user approval.

**DO NOT** edit a locked brief without explicit user approval.

## Validation Gates

Human approval is required between planning phases:

- Brief must be confirmed before slice creation
- Slices must be approved before spec creation
- Specs must be approved before step creation
- Steps must be approved before development starts
- **After steps are approved, ask the user:**

> Do you want to generate test data for this slice?

## Domain Analysis

Before creating slices or specs, analyze the domain:

- Missing domain concepts required by the brief
- Existing models that need extension
- API endpoints that don't exist yet
- Validation rules not currently enforced

## Slices

### What is a Slice?

A slice is a self-contained unit of work, functional end-to-end, with a clear boundary.

### Slice Rules

- One slice = one concern
- Dependencies must be explicit
- If a slice feels too large, split it
- **Final slice is always a Review slice**

## Specs

### What is a Spec?

A spec describes WHAT needs to be accomplished, not HOW. Each spec corresponds 1:1 with a slice.

Specs define:

- Domain models: properties, types, entity structure
- API surface (endpoints, request/response shapes)
- Business rules and validation
- Expected behaviors and edge cases

Specs do NOT include:

- Internal implementation details
- Code snippets or algorithms
- Time estimates

## Steps

### Research Before Writing Steps

Steps must be **implementation-ready** — the implementer applies code, not researches how.

Before writing steps:

1. **Find similar patterns** — locate existing code that does something similar
2. **Identify exact files** — determine which files need modification or creation
3. **Note method signatures** — record existing interfaces
4. **Capture code snippets** — include relevant patterns in `context.md`

### Step Format

- Use `specs/_TEMPLATES/steps.md`
- Imperative mood ("Add", "Create", "Update")
- **Include exact file paths**
- **Reference existing code** — "following the pattern in `ExistingService.DoThing()`"
- **Specify method names**

### Step States

| State         | Meaning                                    |
| ------------- | ------------------------------------------ |
| `PENDING`     | Not yet started                            |
| `IMPLEMENTED` | Code complete, awaiting final review slice |
| `DONE`        | Final review slice passed                  |

## Context

`context.md` captures domain and code context discovered during planning.

### Content

- Key files and their purposes
- Domain concepts and behaviors
- Code patterns to follow (with snippets)
- Method signatures the implementation must use
- Constraints or gotchas discovered

## File Structure

Use camelCase naming for files and folders.

**Structure:** `[vertical]/[topic]/[sub-topic]`

**CRITICAL:** Briefs are created in `planning/`, never in `specs/`.

```
planning/[vertical]/[topic]/[sub-topic]/brief.md
planning/[vertical]/[topic]/[sub-topic]/slices.md
planning/[vertical]/[topic]/[sub-topic]/context.md
planning/[vertical]/[topic]/[sub-topic]/[##-slice]/*.md
specs/[vertical]/[topic]/[sub-topic]/brief.md          # Retained
specs/[vertical]/[topic]/[sub-topic]/[##-slice].md      # Retained
```

### Spec Retainment

**MANDATORY** — performed during the **review slice**, never before.

1. Copy `brief.md` to `specs/[vertical]/[topic]/[sub-topic]/brief.md`
2. Copy all slice specs to `specs/[vertical]/[topic]/[sub-topic]/[##-slice].md`

### Never Commit

Planning documents are working files. **NEVER** commit them.

## Anti-Patterns

- **DO NOT** continue if brief contains `[MUST RESOLVE]`
- **DO NOT** edit a locked brief without explicit user approval
- **DO NOT** create briefs in `specs/` — briefs go in `planning/`
- **DO NOT** copy specs before the review slice completes
- **DO NOT** commit planning documents — they are working files
- **DO NOT** suggest new features beyond the brief
- **DO NOT** write steps before researching existing code patterns
- **DO NOT** skip context.md creation
- **DO NOT** determine the planning folder structure without asking the user
- **DO NOT** include code snippets or implementation details in specs
