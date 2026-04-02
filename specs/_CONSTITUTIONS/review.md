# Review Constitution

Rules for code reviews — review slices and PR review triage.

## Review Slice

> **Prerequisites:** All implementation slices complete with steps marked `IMPLEMENTED`.

### 1. Determine Diff Base

**Ask the user** for the diff base:

1. Previous commit (`HEAD~1`)
2. Current branch's open PR base
3. Other — branch, SHA, or relative ref

**NEVER** guess — must come from the user.
Branch comparison → always **remote** ref (`origin/...`).

### 2. Determine Review Source

**Ask the user:**

1. **Agent review** — AI analyzes the diff and identifies issues
2. **Both** — CodeRabbit + agent review (if CodeRabbit available)

> **CodeRabbit** is installed as a VS Code extension in this project. For PRs, it runs automatically. For solo/local work without PRs, trigger it manually on the diff. Always prefer "Both" when CodeRabbit is available.

### 3. Execute Review

Analyze `git diff <diff-base>`, read changed files fully, identify issues based on constitutions, project patterns, and code quality.

### 4. Scope — Relevant Files

1. **Changed files** — `git diff --name-only <diff-base>`
2. **Indirectly affected files** — files impacted by the changes

### 5. Triage Issues

| Category           | Meaning                                       | Default |
| ------------------ | --------------------------------------------- | ------- |
| **Recommended**    | Should be fixed before completion             | `- [x]` |
| **Optional**       | Valid but not required                        | `- [ ]` |
| **False Positive** | Incorrect or not applicable                   | `- [ ]` |

### 6. User Confirmation

Write triage to the review document file. User toggles checkboxes.

**Do not apply fixes until user confirms.**

### 7. Apply Fixes

Fix all checked issues. Mark each as done in the review document.

### 8. Spec Retainment

**MANDATORY** — Copy `brief.md` and each `[##-slice]/01-spec.md` to `specs/[vertical]/[topic]/[sub-topic]/`.

### 9. Completion

Mark all steps `DONE`. Summarize fixes applied, specs retained, work complete.

**After user confirms triage (step 6), complete steps 7-9 in one pass.**

## File Paths

File paths in review documents **MUST**:

- Be valid, relative to project root, leading `/`, forward slashes only
- Include line number if applicable
- Be verified after writing

## Anti-Patterns

- **DO NOT** guess the diff base — must come from the user
- **DO NOT** apply fixes before user confirmation
- **DO NOT** skip retainment
- **DO NOT** blindly accept findings — analyze independently
- **DO NOT** mark steps `DONE` before retainment completes
