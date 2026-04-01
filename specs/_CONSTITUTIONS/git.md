# Git Constitution

Git behavior — commits, branches, merging.

## Commits

**Only commit when instructed.**

### Message Format

```
Description in past tense
```

- Past tense, specific, terse (`Added person creation endpoint.`)

### Behavior

- Stage files explicitly — avoid `git add -A` or `git add .`
- **DO NOT** amend published commits without explicit instruction
- **DO NOT** commit generated files (node_modules, dist, *.db)

## Branch Model

| Prefix     | Purpose           | Based on |
| ---------- | ----------------- | -------- |
| `main`     | Production        | —        |
| `feature/` | New functionality | `main`   |
| `bugfix/`  | Bug fixes         | `main`   |

## Anti-Patterns

- **DO NOT** force-push to `main`
- **DO NOT** commit `node_modules/`, `dist/`, or `*.db` files
- **DO NOT** stage files with `git add -A` or `git add .`
