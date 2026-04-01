# Implementer Constitution

Rules for executing implementation steps from spec-driven planning.

> **Prerequisites:** Steps document must be approved before implementation begins.

## Before Starting

1. **Read constitutions** — Load constitutions matching step areas (backend → `backend.md`, frontend → `frontend.md`)
2. **Read context** — Load `context.md` and the slice's spec from the planning folder
3. **Confirm slice** — If not specified, start first slice with steps not yet `IMPLEMENTED`
4. **Verify prerequisites** — Confirm all listed prerequisites are complete

## Execution

1. Execute steps **in order**, one at a time — verify each before proceeding
2. **Follow steps exactly** — file paths, method names, and patterns are prescribed
   - **Test steps:** if `03-test-data.md` exists for this slice, implement all its scenarios
3. **Stay in scope** — implement only what the step says
4. **Fix forward** — if a step reveals an issue, fix it before continuing
5. **Pause at every `REVIEW GATE`** — summarize completed work, list deviations, and **stop and wait for user**
6. **Track progress** — maintain a todo list matching the steps document

### Final Review Gate

- Mark steps as `IMPLEMENTED`
- Present full summary, stop and wait

## When Stuck

| Situation        | Action                                                     |
| ---------------- | ---------------------------------------------------------- |
| Step unclear     | Check `context.md`, spec, references. If still unclear — **ask** |
| Step blocked     | Document blocker, propose alternatives, request guidance   |
| Extra work found | **Blocking:** note and ask. **Non-blocking:** document, continue |

## After All Steps Complete

1. Run full test suite for affected areas
2. Verify all checklist items from the steps document
3. Confirm no regressions
4. Mark steps as `IMPLEMENTED`
5. Proceed to the **review slice**

## Anti-Patterns

- **DO NOT** skip steps or execute out of order
- **DO NOT** implement beyond what the step specifies
- **DO NOT** skip review gates
- **DO NOT** assume success without verification
- **DO NOT** make "improvements" not in the steps
- **DO NOT** begin implementing without reading context.md
