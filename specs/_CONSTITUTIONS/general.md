# General Constitution

Cross-cutting rules for all development work.

## Terminal

**ALWAYS** read `terminal.md` before running **any** terminal commands!

## Scope Management

**Golden Rule:** Do what is NECESSARY for the task, nothing more.

### Stay in Scope

- **DO** fix bugs directly required by the current task
- **DO** update tests broken by your changes
- **DO** add methods needed for your feature
- **DO NOT** refactor unrelated code "while you're here"
- **DO NOT** add features the user might want later
- **DO NOT** optimize code that isn't a performance bottleneck

Complete the full task; if blocked, document the blocker and ask.

### Phase Confirmation

When awaiting confirmation to proceed:

- **IS confirmation** — "ok", "continue", "go ahead", or requesting the next phase
- **NOT confirmation** — new instructions without explicit "continue" / "go ahead"
- New instructions mid-wait → do only those, do **not** auto-proceed

## Verification

Never assume success based on IDE diagnostics alone, lack of exceptions, or previous runs. Always verify through command execution and exit code checking.

## Comments

- **Preserve** existing comments unless told otherwise
- **Don't comment** self-explanatory code, obvious assignments, or HOW something works
- **Do comment** WHY non-obvious decisions were made, business rules not clear from code, edge cases

## Documents

- **Be terse.**
- **Be specific.**
- Use `code entity` and `path/to/file` syntax

## Testing Philosophy

### Priority

1. **Integration tests** — Primary approach; test real behavior through actual interfaces
2. **Unit tests** — Test complex domain logic edge cases exhaustively

### What to Test

- Validation logic (cycle detection, age rules, parent count)
- API endpoints (request/response, error handling)
- Complex calculations or validations
- **Not** simple CRUD with no logic
- **Not** direct passthrough methods

## Anti-Patterns

- **DO NOT** refactor unrelated code
- **DO NOT** add features beyond the brief
- **DO NOT** assume success without verification
- **DO NOT** skip testing validation logic — it is the core of this application
